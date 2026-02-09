'use client';
import { useEffect, useMemo, useState } from 'react';
import { type Job } from '@/lib/models/jobApplications';
import JobColumn from './JobColumn';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { updateJob } from '@/lib/server-actions/jobApplications';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { daysSinceUtc } from '@/lib/utils/calculateDaysPastFromMongoUTC';

export type ColumnKey = 'applied' | 'interviewing' | 'offered' | 'rejected';

export function JobBoard({ jobs }: { jobs: Job[] }) {
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [interviewingJobs, setInterviewingJobs] = useState<Job[]>([]);
  const [offeredJobs, setOfferedJobs] = useState<Job[]>([]);
  const [rejectedJobs, setRejectedJobs] = useState<Job[]>([]);
  const [openCreateForm, setOpenCreateForm] = useState({
    applied: false,
    interviewing: false,
    offered: false,
    rejected: false,
  });

  const jobsById = useMemo(() => {
    const map = new Map<string, Job>();
    for (const job of jobs) map.set(String((job as Job)._id ?? ''), job);
    return map;
  }, [jobs]);

  const cachedJobsById = useMemo(() => {
    const cachedJobs = [...appliedJobs, ...interviewingJobs, ...offeredJobs, ...rejectedJobs];
    const map = new Map<string, Job>();
    for (const job of cachedJobs) map.set(String((job as Job)._id ?? ''), job);
    return map;
  }, [appliedJobs, interviewingJobs, offeredJobs, rejectedJobs]);

  useEffect(() => {
    const appliedList: Job[] = [];
    const interviewingList: Job[] = [];
    const offeredList: Job[] = [];
    const rejectedList: Job[] = [];

    for (const job of jobs) {
      switch (job.status) {
        case 'applied':
          appliedList.push(job);
          break;
        case 'interviewing':
          interviewingList.push(job);
          break;
        case 'offered':
          offeredList.push(job);
          break;
        case 'rejected':
          rejectedList.push(job);
          break;
        default:
          break;
      }
    }

    setAppliedJobs(appliedList);
    setInterviewingJobs(interviewingList);
    setOfferedJobs(offeredList);
    setRejectedJobs(rejectedList);
  }, [jobs]);

  function handleCreateForm(columnKey: ColumnKey) {
    setOpenCreateForm((prevObj) => {
      const obj = { ...prevObj };

      for (const key of Object.keys(prevObj) as Array<keyof typeof prevObj>) {
        if (obj[key]) {
          obj[key] = false;
        }
      }

      return {
        ...obj,
        [columnKey]: true,
      };
    });
  }

  function createJob(status: ColumnKey, job: Job) {
    switch (status) {
      case 'applied':
        setAppliedJobs((prev) => [...prev, job]);
        break;
      case 'interviewing':
        setInterviewingJobs((prev) => [...prev, job]);
        break;
      case 'offered':
        setOfferedJobs((prev) => [...prev, job]);
        break;
      case 'rejected':
        setRejectedJobs((prev) => [...prev, job]);
        break;
      default:
        break;
    }
  }

  function moveJob(jobId: string, toColumn: ColumnKey) {
    const job = jobsById.get(jobId) || cachedJobsById.get(jobId);
    if (!job) return;

    setAppliedJobs((prev) => prev.filter((job) => String((job as Job)._id ?? '') !== jobId));
    setInterviewingJobs((prev) => prev.filter((job) => String((job as Job)._id ?? '') !== jobId));
    setOfferedJobs((prev) => prev.filter((job) => String((job as Job)._id ?? '') !== jobId));
    setRejectedJobs((prev) => prev.filter((job) => String((job as Job)._id ?? '') !== jobId));

    const updatedJob = { ...job, status: toColumn } as Job;

    switch (toColumn) {
      case 'applied':
        setAppliedJobs((prev) => [...prev, updatedJob]);
        break;
      case 'interviewing':
        setInterviewingJobs((prev) => [...prev, updatedJob]);
        break;
      case 'offered':
        setOfferedJobs((prev) => [...prev, updatedJob]);
        break;
      case 'rejected':
        setRejectedJobs((prev) => [...prev, updatedJob]);
        break;
    }
    // we can improve performance here by debouncing this call  until the drag and drop have stopped
    updateJob(job._id, updatedJob);
  }

  function handleDragStart(e: React.DragEvent, jobId: string) {
    e.dataTransfer.setData('text/plain', jobId);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function handleDrop(e: React.DragEvent, toColumn: ColumnKey) {
    e.preventDefault();
    const jobId = e.dataTransfer.getData('text/plain');
    console.log('da fuq', jobId);
    if (!jobId) return;
    moveJob(jobId, toColumn);
  }

  function jobCard(job: Job) {
    const id = String((job as Job)._id ?? '');
    const appliedAt = `${job.appliedAt.getUTCMonth() + 1}/${job.appliedAt.getUTCDate()}/
            ${job.appliedAt.getUTCFullYear()}`;

    return (
      <Card
        key={id}
        draggable
        onDragStart={(e) => handleDragStart(e, id)}
        className="bg-white rounded-md mb-2 shadow cursor-grab gap-4"
      >
        <CardHeader>
          <CardTitle className="font-semibold">{job.jobTitle ?? 'Untitled'}</CardTitle>
          <CardTitle className="text-sm text-muted-foreground">{job.company ?? ''}</CardTitle>
          {job?.jobUrl && (
            <CardDescription>
              <Button variant="link" className="p-0">
                <a href={job?.jobUrl} target="_blank" rel="noopener noreferrer">
                  Visit Job Posting
                </a>
              </Button>
            </CardDescription>
          )}
          <CardDescription className="text-xs text-black">Notes: {job.notes}</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between items-center">
          <p className="text-sm font-sans">Applied: {appliedAt}</p>
          <Badge variant="default" className="text-sm font-sans font-medium">
            {daysSinceUtc(job.appliedAt.toISOString())} days
          </Badge>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="md:grid md:grid-cols-4 gap-2">
      <h1 className="sr-only">Job Application Board</h1>
      <JobColumn
        name="Applied"
        count={appliedJobs.length}
        columnKey="applied"
        openCreateForm={openCreateForm.applied}
        handleCreateForm={handleCreateForm}
        onJobCreated={createJob}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {appliedJobs.map((job) => jobCard(job))}
      </JobColumn>
      <JobColumn
        name="Interviewing"
        count={interviewingJobs.length}
        columnKey="interviewing"
        openCreateForm={openCreateForm.interviewing}
        handleCreateForm={handleCreateForm}
        onJobCreated={createJob}
        onDragOver={handleDragOver}
        onDrop={(e: React.DragEvent) => handleDrop(e, 'interviewing')}
      >
        {interviewingJobs.map((job) => jobCard(job))}
      </JobColumn>
      <JobColumn
        name="Offered"
        count={offeredJobs.length}
        columnKey="offered"
        openCreateForm={openCreateForm.offered}
        handleCreateForm={handleCreateForm}
        onJobCreated={createJob}
        onDragOver={handleDragOver}
        onDrop={(e: React.DragEvent) => handleDrop(e, 'offered')}
      >
        {offeredJobs.map((job) => jobCard(job))}
      </JobColumn>
      <JobColumn
        name="Rejected"
        count={rejectedJobs.length}
        columnKey="rejected"
        openCreateForm={openCreateForm.rejected}
        handleCreateForm={handleCreateForm}
        onJobCreated={createJob}
        onDragOver={handleDragOver}
        onDrop={(e: React.DragEvent) => handleDrop(e, 'rejected')}
      >
        {rejectedJobs.map((job) => jobCard(job))}
      </JobColumn>
    </div>
  );
}
