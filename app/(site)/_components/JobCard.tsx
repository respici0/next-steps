'use client';
import { type Job } from '@/lib/models/jobApplications';
import { useState } from 'react';
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
import { SquarePen } from 'lucide-react';
import JobForm from './JobForm';
import { type ColumnKey } from './JobBoard';

type Props = {
  job: Job;
  handleDragStart: (e: React.DragEvent, id: string) => void;
  columnKey: ColumnKey;
};

export function JobCard({ job, handleDragStart, columnKey }: Props) {
  const [openUpdateForm, setOpenUpdateForm] = useState(false);
  const id = String((job as Job)._id ?? '');
  const appliedAt = `${job.appliedAt.getUTCMonth() + 1}/${job.appliedAt.getUTCDate()}/${job.appliedAt.getUTCFullYear()}`;

  function handleUpdateForm() {
    setOpenUpdateForm((prev) => !prev);
  }

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
            <CardTitle className="flex flex-col">
              <span className="font-semibold text-2xl text-shadow-black">
                {job.jobTitle ?? 'Untitled'}
              </span>
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
              <Button variant="ghost" onClick={handleUpdateForm}>
                <SquarePen />
              </Button>
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
        <JobForm columnKey={columnKey} action="update" onClose={handleUpdateForm} />
      )}
    </>
  );
}
