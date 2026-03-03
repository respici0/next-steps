import { getArchivedJobs } from '@/lib/server-actions/jobApplications';
import { ArchivedJobList } from '@/app/(site)/_components/ArchivedJobList';

export default async function ArchivedPage() {
  const archivedJobs = await getArchivedJobs();

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Archived Jobs</h1>
      <ArchivedJobList jobs={archivedJobs} />
    </main>
  );
}
