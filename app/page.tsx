import { getAllJobApplications } from "@/lib/server-actions/jobApplications";
import { JobCard } from "@/components/JobCard";

function JobBoard() {
  return (
    <div>
      <div className="md:grid md:grid-cols-4 gap-4 mb-4">
        <div className="bg-gray-400 text-white font-medium border-2 p-2 text-center rounded-md">
          Applied
        </div>
        <div className="bg-gray-400 text-white font-medium">Interviewing</div>
        <div className="bg-gray-400 text-white font-medium">Offer</div>
        <div className="bg-gray-400 text-white font-medium">Rejected</div>
      </div>
    </div>
  );
}

export default async function Home() {
  const jobApplications = await getAllJobApplications();

  console.log(jobApplications);
  return (
    <div>
      <main className="w-full p-4">
        {/* we're designing for mobile first design here - need to research how to make each column take vw and snap like swiping to next column */}
        <JobBoard />
        {jobApplications !== null && jobApplications.length > 0 ? (
          <div className="md:grid md:grid-cols-4 gap-4">
            <div>
              <JobCard />
              <JobCard />
              <JobCard />
            </div>
            <JobCard />
            <JobCard />
            <JobCard />
            <div></div>
            <div></div>
            <div></div>
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
