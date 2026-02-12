'use client';
import { useEffect, useMemo, useState } from 'react';
import { type Job } from '@/lib/models/jobApplications';
import JobColumn from './JobColumn';
import { updateJob } from '@/lib/server-actions/jobApplications';
import { JobCard } from './JobCard';

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
    if (!jobId) return;
    moveJob(jobId, toColumn);
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
        {appliedJobs.map((job) => (
          <JobCard
            key={String((job as Job)._id ?? '')}
            job={job}
            handleDragStart={handleDragStart}
          />
        ))}
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
        {interviewingJobs.map((job) => (
          <JobCard
            key={String((job as Job)._id ?? '')}
            job={job}
            handleDragStart={handleDragStart}
          />
        ))}
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
        {offeredJobs.map((job) => (
          <JobCard
            key={String((job as Job)._id ?? '')}
            job={job}
            handleDragStart={handleDragStart}
          />
        ))}
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
        {rejectedJobs.map((job) => (
          <JobCard
            key={String((job as Job)._id ?? '')}
            job={job}
            handleDragStart={handleDragStart}
          />
        ))}
      </JobColumn>
    </div>
  );
}
