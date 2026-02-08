'use server';

import { getUser } from '../auth/getUser';
import dbConnect from '../db/mongo';
import JobApplications, { type Job } from '../models/jobApplications';
// import { notFound } from "next/navigation";

const mockPromise = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
};

async function getUserId(): Promise<string> {
  const { id } = await getUser();
  if (!id) {
    throw new Error('Unable to authorize user session');
  }
  return id;
}

export async function getAllJobApplications(): Promise<Job[] | null> {
  const userId = await getUserId();
  await dbConnect();
  try {
    // const jobApplications = await JobApplications.find({ userId }).lean<Job[]>().exec();
    const jobApplications = await JobApplications.find({ userId }).lean<Job[]>().exec();
    const jobs = jobApplications.map((job: Job) => ({
      ...job,
      _id: job._id.toString(),
      userId: job.userId.toString(),
    }));
    return jobs as Job[] | null;
  } catch (error) {
    return null;
    // notFound();
  }
}

export async function updateJob(_id: string, job: Job): Promise<void> {
  await getUserId();
  await dbConnect();
  try {
    const res = await JobApplications.updateOne({ _id }, job);
    console.log(res.acknowledged);
  } catch (error) {
    console.error(error);
  }
}

export async function createJob(
  prevState: unknown,
  formData: FormData,
): Promise<{
  success: boolean;
  error: string | null;
  job: Job | null;
}> {
  const userId = await getUserId();
  await dbConnect();

  const rawData = Object.fromEntries(formData);

  // console.log({appliedAt, position})

  try {
    const jobDoc = await JobApplications.create({ userId, ...rawData });

    const job: Job = {
      ...jobDoc.toObject(),
      _id: jobDoc._id.toString(),
      userId: jobDoc.userId.toString(),
    };

    console.log(job);
    return {
      success: true,
      error: null,
      job,
    };
  } catch (e) {
    console.error(e);
    return {
      success: false,
      error: 'Something went wrong',
      job: null,
    };
  }
}

// NOTES

// the job app tracking portion, with lanes and cards
// eventually a table
// if no jobs, display a no jobs tracked
