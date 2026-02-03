import { getAllJobApplications } from '@/lib/server-actions/jobApplications';
import { JobBoard } from '@/components/JobBoard';

export default async function Home() {
  // DEBUG: set to `true` to force a visible load delay so `app/loading.tsx` appears.
  // Turn this off (false) when finished testing.
  // const DEBUG_FORCE_LOADING = true;

  // if (DEBUG_FORCE_LOADING) {
  //   // artificial delay to ensure the route suspends long enough for the loading UI to render
  //   await new Promise((res) => setTimeout(res, 5000));
  // }

  const jobApplications = await getAllJobApplications();
  return (
    <div className="w-full p-4 min-h-screen overflow-scroll">
      <main>
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
