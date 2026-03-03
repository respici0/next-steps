'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { type ArchivedJob } from '@/lib/models/jobApplications';
import { ARCHIVE_TTL_DAYS } from '@/lib/constants';
import { unarchiveJob } from '@/lib/server-actions/jobApplications';
import { daysSinceUtc } from '@/lib/utils/calculateDaysPastFromMongoUTC';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Props = { jobs: ArchivedJob[] };

export function ArchivedJobList({ jobs }: Props) {
  const [archivedJobs, setArchivedJobs] = useState<ArchivedJob[]>(jobs);
  const router = useRouter();

  async function handleUnarchive(jobId: string) {
    const result = await unarchiveJob(jobId);
    if (result.success) {
      setArchivedJobs((prev) => prev.filter((j) => String(j._id) !== jobId));
      router.push('/');
    }
  }

  if (archivedJobs.length === 0) {
    return <p className="text-muted-foreground">No archived jobs.</p>;
  }

  return (
    <div className="flex flex-col gap-3 max-w-xl">
      {archivedJobs.map((job) => {
        console.log('JOB', job);
        if (!job.archivedAt) {
          job.archivedAt = new Date();
        }
        const id = String(job._id);
        const daysSinceArchived = daysSinceUtc(job?.archivedAt.toISOString());
        const daysRemaining = Math.max(0, ARCHIVE_TTL_DAYS - daysSinceArchived);
        const archivedDate = `${job.archivedAt.getUTCMonth() + 1}/${job.archivedAt.getUTCDate()}/${job.archivedAt.getUTCFullYear()}`;

        return (
          <Card key={id} className="bg-white rounded-md shadow gap-1 font-sans py-4">
            <CardHeader>
              <CardTitle className="flex flex-col">
                <span className="font-semibold text-2xl">{job.jobTitle}</span>
                <span className="text-sm font-medium text-muted-foreground">{job.company}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              <p className="text-sm">
                Last status:{' '}
                <Badge variant="outline">{job.previousStatus ?? 'applied'}</Badge>
              </p>
              <p className="text-sm text-muted-foreground">Archived: {archivedDate}</p>
              <p className="text-sm text-muted-foreground">
                Deleted in: <span className="font-medium">{daysRemaining} days</span>
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => handleUnarchive(id)}>
                Unarchive
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
