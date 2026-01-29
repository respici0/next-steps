import { getAllJobApplications } from '@/lib/server-actions/jobApplications';
import { JobBoard } from '@/components/JobBoard';
import { type Job } from '@/lib/models/jobApplications';

export default async function Home() {
  const jobApplications = await getAllJobApplications();
  // console.log('job', jobApplications)
  // const job = jobApplications?.map((jobApplication: Job))
  // const jobs = {...jobApplications, id: jobApplications}
  // console.log(jobApplications);
  return (
    <div className="bg-zinc-600">
      <main className="w-full p-4 min-h-screen">
        {/* we're designing for mobile first design here - need to research how to make each column take vw and snap like swiping to next column */}
        {jobApplications !== null && jobApplications.length > 0 ? (
          <JobBoard jobs={jobApplications} />
        ) : (
          <div className="flex w-full justify-center ">
            <p>No jobs to track.</p>
          </div>
        )}
      </main>
    </div>
  );
}
