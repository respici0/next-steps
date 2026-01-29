'use client';
import { useState } from 'react';
import { type Job } from '@/lib/models/jobApplications';
import { JobColumn } from './JobColumn';

export function JobBoard({ jobs }: { jobs: Job[] }) {
  const [applied, setApplied] = useState([]);
  const [interviewing, setInterviewing] = useState([]);
  const [offered, setOffered] = useState([]);
  const [rejected, setRejected] = useState([]);

  return (
    <div className="md:grid md:grid-cols-4 gap-2">
      <JobColumn name="Applied" />
      <JobColumn name="Interviewing" />
      <JobColumn name="Offered" />
      <JobColumn name="Rejected" />
    </div>
  );
}
