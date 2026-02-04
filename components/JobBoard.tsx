'use client';
import { useEffect, useMemo, useState } from 'react';
import { type Job } from '@/lib/models/jobApplications';
import { JobColumn } from './JobColumn';
import { Card, CardHeader, CardTitle } from './ui/card';

export type ColumnKey = 'applied' | 'interviewing' | 'offered' | 'rejected';

export function JobBoard({ jobs }: { jobs: Job[] }) {
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [interviewingJobs, setInterviewingJobs] = useState<Job[]>([]);
  const [offeredJobs, setOfferedJobs] = useState<Job[]>([]);
  const [rejectedJobs, setRejectedJobs] = useState<Job[]>([]);

  const jobsById = useMemo(() => {
    const map = new Map<string, Job>();
    for (const job of jobs) map.set(String((job as Job)._id ?? ''), job);
    return map;
  }, [jobs]);

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

  function moveJob(jobId: string, toColumn: ColumnKey) {
    const job = jobsById.get(jobId);
    if (!job) return;

    setAppliedJobs((prev) => prev.filter((job) => String((job as Job)._id ?? '') !== jobId));
    setInterviewingJobs((prev) => prev.filter((job) => String((job as Job)._id ?? '') !== jobId));
    setOfferedJobs((prev) => prev.filter((job) => String((job as Job)._id ?? '') !== jobId));
    setRejectedJobs((prev) => prev.filter((job) => String((job as Job)._id ?? '') !== jobId));

    const updatedJob = { ...job, status: toColumn } as Job;

    switch (toColumn) {
      case 'applied':
        setAppliedJobs((prev) => [updatedJob, ...prev]);
        break;
      case 'interviewing':
        setInterviewingJobs((prev) => [updatedJob, ...prev]);
        break;
      case 'offered':
        setOfferedJobs((prev) => [updatedJob, ...prev]);
        break;
      case 'rejected':
        setRejectedJobs((prev) => [updatedJob, ...prev]);
        break;
    }

    // TODO: persist change to backend (call server action / API)
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
    if (!jobId) return;
    moveJob(jobId, toColumn);
  }

  function jobCard(job: Job) {
    const id = String((job as Job)._id ?? '');
    return (
      <Card
        key={id}
        draggable
        onDragStart={(e) => handleDragStart(e, id)}
        className="bg-white p-4 rounded-md mb-2 shadow cursor-grab gap-1"
      >
        <CardHeader>
          <CardTitle className="font-semibold">{job.jobTitle ?? 'Untitled'}</CardTitle>
          <CardTitle className="text-sm text-muted-foreground">{job.company ?? ''}</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="md:grid md:grid-cols-4 gap-2">
      <JobColumn name="Applied" columnKey="applied" onDragOver={handleDragOver} onDrop={handleDrop}>
        {appliedJobs.map((job) => jobCard(job))}
      </JobColumn>
      <JobColumn
        name="Interviewing"
        columnKey="interviewing"
        onDragOver={handleDragOver}
        onDrop={(e: React.DragEvent) => handleDrop(e, 'interviewing')}
      >
        {interviewingJobs.map((job) => jobCard(job))}
      </JobColumn>
      <JobColumn
        name="Offered"
        columnKey="offered"
        onDragOver={handleDragOver}
        onDrop={(e: React.DragEvent) => handleDrop(e, 'offered')}
      >
        {offeredJobs.map((job) => jobCard(job))}
      </JobColumn>
      <JobColumn
        name="Rejected"
        columnKey="rejected"
        onDragOver={handleDragOver}
        onDrop={(e: React.DragEvent) => handleDrop(e, 'rejected')}
      >
        {rejectedJobs.map((job) => jobCard(job))}
      </JobColumn>
    </div>
  );
}
