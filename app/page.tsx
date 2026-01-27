import { getAllJobApplications } from '@/lib/server-actions/jobApplications';
import { JobColumn } from '@/components/JobColumn';

export default async function Home() {
  const jobApplications = await getAllJobApplications();

  console.log(jobApplications);
  return (
    <div className="bg-zinc-600">
      <main className="w-full p-4 min-h-screen">
        {/* we're designing for mobile first design here - need to research how to make each column take vw and snap like swiping to next column */}
        {jobApplications !== null && jobApplications.length > 0 ? (
          <div className="md:grid md:grid-cols-4 gap-2">
            <JobColumn name="Applied" />
            <JobColumn name="Interviewing" />
            <JobColumn name="Offered" />
            <JobColumn name="Rejected" />
          </div>
        ) : (
          <div className="flex w-full justify-center ">
            <p>No jobs to track.</p>
          </div>
        )}
      </main>
    </div>
  );
}
