'use server';

import { getUser } from '../auth/getUser';
import dbConnect from '../db/mongo';
import JobApplications, { type Job } from '../models/jobApplications';
// import { notFound } from "next/navigation";

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

export async function createJob(prevState: unknown, formData: FormData) {
  const userId = await getUserId();
  await dbConnect();

  const appliedAt = formData.get('appliedAt');
  const position = formData.get('position');
  console.log({ appliedAt, position });
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    success: true,
    error: 'Something went wrong',
  };
  // try {
  //   // await JobApplications.create({ userId });
  // } catch (error) {
  //   console.error();
  // }
}

// NOTES

// the job app tracking portion, with lanes and cards
// eventually a table
// if no jobs, display a no jobs tracked
