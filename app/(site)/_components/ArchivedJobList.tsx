'use client';
import { useState, useRef, useEffect } from 'react';
import { type ArchivedJob } from '@/lib/models/jobApplications';
import { ARCHIVE_TTL_DAYS } from '@/lib/constants';
import { unarchiveJob } from '@/lib/server-actions/jobApplications';
import { daysSinceUtc } from '@/lib/utils/calculateDaysPastFromMongoUTC';
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArchiveRestore } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type Props = { jobs: ArchivedJob[] };

function ArchivedJobCard({
  job,
  onUnarchive,
}: {
  job: ArchivedJob;
  onUnarchive: (id: string) => void;
}) {
  const [isTruncated, setIsTruncated] = useState(false);
  const titleRef = useRef<HTMLSpanElement>(null);
  const id = String(job._id);

  useEffect(() => {
    const el = titleRef.current;
    if (el) setIsTruncated(el.scrollWidth > el.offsetWidth);
  }, [job.jobTitle]);

  if (!job.archivedAt) job.archivedAt = new Date();
  const daysSinceArchived = daysSinceUtc(job.archivedAt.toISOString());
  const daysRemaining = Math.max(0, ARCHIVE_TTL_DAYS - daysSinceArchived);
  const archivedDate = `${job.archivedAt.getUTCMonth() + 1}/${job.archivedAt.getUTCDate()}/${job.archivedAt.getUTCFullYear()}`;

  return (
    <Card key={id} className="bg-white rounded-md shadow gap-1 font-sans py-4">
      <CardHeader>
        <CardTitle className="flex flex-col min-w-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span ref={titleRef} className="font-semibold text-2xl truncate">
                  {job.jobTitle}
                </span>
              </TooltipTrigger>
              {isTruncated && <TooltipContent>{job.jobTitle}</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
          <span className="text-sm font-medium text-muted-foreground">{job.company}</span>
        </CardTitle>
        <CardAction>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => onUnarchive(id)}>
                  <ArchiveRestore />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Unarchive</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <p className="text-sm">
          Last status:{' '}
          <Badge variant="default" className="text-sm font-medium">
            {job.previousStatus
              ? job.previousStatus.charAt(0).toUpperCase() + job.previousStatus.slice(1)
              : 'Applied'}
          </Badge>
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">Archived: {archivedDate}</p>
        <p className="text-sm text-muted-foreground">
          Deleted in: <span className="font-medium">{daysRemaining} days</span>
        </p>
      </CardFooter>
    </Card>
  );
}

export function ArchivedJobList({ jobs }: Props) {
  const [archivedJobs, setArchivedJobs] = useState<ArchivedJob[]>(jobs);

  async function handleUnarchive(jobId: string) {
    const result = await unarchiveJob(jobId);
    if (result.success) {
      setArchivedJobs((prev) => prev.filter((j) => String(j._id) !== jobId));
    }
  }

  if (archivedJobs.length === 0) {
    return <p className="text-muted-foreground">No archived jobs.</p>;
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {archivedJobs.map((job) => (
        <ArchivedJobCard key={String(job._id)} job={job} onUnarchive={handleUnarchive} />
      ))}
    </div>
  );
}
