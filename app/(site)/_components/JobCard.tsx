'use client';
import { type Job } from '@/lib/models/jobApplications';
import { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { daysSinceUtc } from '@/lib/utils/calculateDaysPastFromMongoUTC';
import { MoreHorizontal, SquarePen, Archive } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import JobForm from './JobForm';
import { type ColumnKey } from './JobBoard';

type Props = {
  job: Job;
  onJobUpdated: (status: ColumnKey, job: Job) => void;
  onJobArchived: (jobId: string, columnKey: ColumnKey) => void;
  handleDragStart: (e: React.DragEvent, id: string) => void;
  columnKey: ColumnKey;
};

export function JobCard({ job, handleDragStart, onJobUpdated, onJobArchived, columnKey }: Props) {
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const titleRef = useRef<HTMLSpanElement>(null);
  const id = String((job as Job)._id ?? '');

  useEffect(() => {
    const el = titleRef.current;
    if (el) setIsTruncated(el.scrollWidth > el.offsetWidth);
  }, [job.jobTitle]);
  const appliedAt = `${job.appliedAt.getUTCMonth() + 1}/${job.appliedAt.getUTCDate()}/${job.appliedAt.getUTCFullYear()}`;

  return (
    <>
      {!openUpdateForm ? (
        <Card
          key={id}
          draggable
          onDragStart={(e) => handleDragStart(e, id)}
          className="bg-white rounded-md mb-2 shadow cursor-grab gap-1 font-sans py-4"
        >
          <CardHeader>
            <CardTitle className="flex flex-col min-w-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      ref={titleRef}
                      className="font-semibold text-2xl text-shadow-black truncate"
                    >
                      {job.jobTitle ?? 'Untitled'}
                    </span>
                  </TooltipTrigger>
                  {isTruncated && <TooltipContent>{job.jobTitle ?? 'Untitled'}</TooltipContent>}
                </Tooltip>
              </TooltipProvider>
              <span className="text-sm font-medium text-muted-foreground">{job.company ?? ''}</span>
            </CardTitle>
            {job?.jobUrl && (
              <CardDescription>
                <Button variant="link" className="p-0 hover:opacity-60">
                  <a href={job?.jobUrl} target="_blank" rel="noopener noreferrer">
                    Visit Job Posting
                  </a>
                </Button>
              </CardDescription>
            )}
            <CardAction>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setOpenUpdateForm((prev) => !prev)}>
                    <SquarePen className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onJobArchived(id, columnKey)}>
                    <Archive className="mr-2 h-4 w-4" />
                    Archive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-light">{job.notes}</p>
          </CardContent>
          <CardFooter className="flex justify-between items-center mt-1">
            <p className="text-sm">Applied: {appliedAt}</p>
            <Badge variant="default" className="text-sm font-medium">
              {daysSinceUtc(job.appliedAt.toISOString())} days
            </Badge>
          </CardFooter>
        </Card>
      ) : (
        <JobForm
          columnKey={columnKey}
          action="update"
          onJobUpdated={onJobUpdated}
          onClose={() => setOpenUpdateForm((prev) => !prev)}
          job={job}
        />
      )}
    </>
  );
}
