'use server';

import { getUser } from '../auth/getUser';
import dbConnect from '../db/mongo';
import JobApplications, {
  type Job,
  type ArchivedJob,
  ARCHIVE_TTL_DAYS,
} from '../models/jobApplications';

// const mockPromise = async () => {
//   await new Promise((resolve) => setTimeout(resolve, 2000));
// };

async function getUserId(): Promise<string> {
  const { id } = await getUser();
  if (!id) {
    throw new Error('Unable to authorize user session');
  }
  return id;
}

export async function getAllJobApplications(): Promise<Job[]> {
  const userId = await getUserId();
  await dbConnect();
  try {
    const jobApplications = await JobApplications.find({
      userId,
      status: { $ne: 'archived' },
    })
      .lean<Job[]>()
      .exec();
    const jobs = jobApplications.map((job: Job) => ({
      ...job,
      _id: job._id.toString(),
      userId: job.userId.toString(),
    }));
    return jobs as Job[];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function updateJob(
  _id: string,
  formData: FormData,
): Promise<{
  success: boolean;
  error: string | null;
  job: Job | null;
}> {
  const userId = await getUserId();
  await dbConnect();

  const rawData = Object.fromEntries(formData);
  try {
    const jobDoc = await JobApplications.findOneAndUpdate(
      { _id, userId },
      { ...rawData },
      { new: true },
    );
    if (!jobDoc) {
      throw new Error('Unable to update job');
    }

    const job: Job = {
      ...jobDoc.toObject(),
      _id: jobDoc._id.toString(),
      userId: jobDoc.userId.toString(),
    };

    return {
      success: true,
      error: null,
      job,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: message || 'Unable to update job.',
      job: null,
    };
  }
}

export async function createJob(formData: FormData): Promise<{
  success: boolean;
  error: string | null;
  job: Job | null;
}> {
  const userId = await getUserId();
  await dbConnect();

  const rawData = Object.fromEntries(formData);
  try {
    const jobDoc = await JobApplications.create({ userId, ...rawData });

    const job: Job = {
      ...jobDoc.toObject(),
      _id: jobDoc._id.toString(),
      userId: jobDoc.userId.toString(),
    };

    return {
      success: true,
      error: null,
      job,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: 'Something went wrong',
      job: null,
    };
  }
}

export async function updateJobStatus(_id: string, job: Job) {
  try {
    const userId = await getUserId();
    await dbConnect();
    await JobApplications.updateOne({ _id, userId }, job);
  } catch (error) {
    console.error(error);
  }
}

export async function archiveJob(id: string, previousStatus: string): Promise<void> {
  try {
    const userId = await getUserId();
    await dbConnect();
    await JobApplications.updateOne(
      { _id: id, userId },
      { $set: { status: 'archived', archivedAt: new Date(), previousStatus } },
    );
  } catch (error) {
    console.error(error);
  }
}

export async function getArchivedJobs(): Promise<ArchivedJob[]> {
  const userId = await getUserId();
  await dbConnect();
  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - ARCHIVE_TTL_DAYS);
  await JobApplications.deleteMany({ userId, status: 'archived', archivedAt: { $lte: cutoff } });
  const docs = await JobApplications.find({ userId, status: 'archived' })
    .sort({ archivedAt: -1 })
    .lean<ArchivedJob[]>()
    .exec();
  return docs.map((doc) => ({
    ...doc,
    _id: doc._id.toString(),
    userId: doc.userId.toString(),
  })) as ArchivedJob[];
}

export async function unarchiveJob(id: string): Promise<{
  success: boolean;
  error: string | null;
}> {
  try {
    const userId = await getUserId();
    await dbConnect();
    const doc = await JobApplications.findOne({ _id: id, userId, status: 'archived' });
    if (!doc) throw new Error('Archived job not found');
    const restoredStatus = doc.previousStatus ?? 'applied';
    await JobApplications.updateOne(
      { _id: id, userId },
      { $set: { status: restoredStatus }, $unset: { archivedAt: '', previousStatus: '' } },
    );
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

// NOTES

// the job app tracking portion, with lanes and cards
// eventually a table
// if no jobs, display a no jobs tracked
