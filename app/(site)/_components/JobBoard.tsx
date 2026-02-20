'use client';
import { useMemo, useState } from 'react';
import { type Job } from '@/lib/models/jobApplications';
import JobColumn from './JobColumn';
import { updateJobStatus } from '@/lib/server-actions/jobApplications';
import { JobCard } from './JobCard';

export type ColumnKey = 'applied' | 'interviewing' | 'offered' | 'rejected';

export function JobBoard({ jobs }: { jobs: Job[] }) {
  const [jobsByStatus, setJobsByStatus] = useState<Record<ColumnKey, Job[]>>({
    applied: jobs.filter((job) => job.status === 'applied'),
    interviewing: jobs.filter((job) => job.status === 'interviewing'),
    offered: jobs.filter((job) => job.status === 'offered'),
    rejected: jobs.filter((job) => job.status === 'rejected'),
  });
  const [column, setColumn] = useState('');

  const cachedJobsById = useMemo(() => {
    const cachedJobs = [...Object.values(jobsByStatus).flat()];
    const map = new Map<string, Job>();
    for (const job of cachedJobs) map.set(String((job as Job)._id ?? ''), job);
    return map;
  }, [jobsByStatus]);

  function handleCreateForm(columnKey: ColumnKey) {
    setColumn(columnKey);
  }

  function createJob(status: ColumnKey, job: Job) {
    setJobsByStatus((prev) => {
      return {
        ...prev,
        [status]: [...prev[status], job],
      };
    });
  }

  function replaceJob(jobs: Job[], updatedJob: Job): Job[] {
    return jobs.map((job: Job) =>
      String(job._id) === String(updatedJob._id)
        ? {
            ...updatedJob,
          }
        : job,
    );
  }

  function updateJob(status: ColumnKey, job: Job) {
    setJobsByStatus((prev) => {
      return {
        ...prev,
        [status]: replaceJob(prev[status], job),
      };
    });
  }

  function removeJobFromColumn(jobId: string) {
    setJobsByStatus((prev) => {
      const obj = {} as typeof prev;

      for (const status of Object.keys(prev)) {
        obj[status as ColumnKey] = prev[status as ColumnKey].filter(
          (job) => String((job as Job)._id ?? '') !== jobId,
        );
      }

      return obj;
    });
  }

  function moveJob(jobId: string, toColumn: ColumnKey) {
    const job = cachedJobsById.get(jobId);
    const addJobToColumn = createJob;
    if (!job) return;

    removeJobFromColumn(jobId);
    const updatedJob = { ...job, status: toColumn } as Job;
    addJobToColumn(toColumn, updatedJob);
    // we can improve performance here by debouncing this call  until the drag and drop have stopped
    updateJobStatus(job._id, updatedJob);
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
        count={jobsByStatus['applied'].length}
        columnKey="applied"
        openCreateForm={column === 'applied'}
        handleCreateForm={handleCreateForm}
        onJobCreated={createJob}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {jobsByStatus['applied'].map((job) => (
          <JobCard
            key={String((job as Job)._id ?? '')}
            job={job}
            onJobUpdated={updateJob}
            handleDragStart={handleDragStart}
            columnKey="applied"
          />
        ))}
      </JobColumn>
      <JobColumn
        name="Interviewing"
        count={jobsByStatus['interviewing'].length}
        columnKey="interviewing"
        openCreateForm={column === 'interviewing'}
        handleCreateForm={handleCreateForm}
        onJobCreated={createJob}
        onDragOver={handleDragOver}
        onDrop={(e: React.DragEvent) => handleDrop(e, 'interviewing')}
      >
        {jobsByStatus['interviewing'].map((job) => (
          <JobCard
            key={String((job as Job)._id ?? '')}
            onJobUpdated={updateJob}
            job={job}
            handleDragStart={handleDragStart}
            columnKey="interviewing"
          />
        ))}
      </JobColumn>
      <JobColumn
        name="Offered"
        count={jobsByStatus['offered'].length}
        columnKey="offered"
        openCreateForm={column === 'offered'}
        handleCreateForm={handleCreateForm}
        onJobCreated={createJob}
        onDragOver={handleDragOver}
        onDrop={(e: React.DragEvent) => handleDrop(e, 'offered')}
      >
        {jobsByStatus['offered'].map((job) => (
          <JobCard
            key={String((job as Job)._id ?? '')}
            onJobUpdated={updateJob}
            job={job}
            handleDragStart={handleDragStart}
            columnKey="offered"
          />
        ))}
      </JobColumn>
      <JobColumn
        name="Rejected"
        count={jobsByStatus['rejected'].length}
        columnKey="rejected"
        openCreateForm={column === 'rejected'}
        handleCreateForm={handleCreateForm}
        onJobCreated={createJob}
        onDragOver={handleDragOver}
        onDrop={(e: React.DragEvent) => handleDrop(e, 'rejected')}
      >
        {jobsByStatus['rejected'].map((job) => (
          <JobCard
            key={String((job as Job)._id ?? '')}
            onJobUpdated={updateJob}
            job={job}
            handleDragStart={handleDragStart}
            columnKey="rejected"
          />
        ))}
      </JobColumn>
    </div>
  );
}
