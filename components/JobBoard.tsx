import { useState } from 'react';
import { JobApplicationsDoc } from '@/lib/models/jobApplications';
import { JobColumn } from './JobColumn';

type Jobs = {
  jobs: JobApplicationsDoc[];
};

export function JobBoard({ jobs }: Jobs) {
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
