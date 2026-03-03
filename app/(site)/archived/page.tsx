import { getArchivedJobs } from '@/lib/server-actions/jobApplications';
import { ArchivedJobList } from '@/app/(site)/_components/ArchivedJobList';

export default async function ArchivedPage() {
  const archivedJobs = await getArchivedJobs();

  return (
    <main className="h-screen overflow-y-auto p-4 pb-16 flex flex-col items-center">
      <div className="w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Archived Jobs</h1>
        <ArchivedJobList jobs={archivedJobs} />
      </div>
    </main>
  );
}
