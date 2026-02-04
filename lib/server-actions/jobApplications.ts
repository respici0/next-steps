'use server';

import dbConnect from '../db/mongo';
import JobApplications, { type Job } from '../models/jobApplications';
// import { notFound } from "next/navigation";

export async function getAllJobApplications(): Promise<Job[] | null> {
  await dbConnect();
  try {
    const jobApplications = await JobApplications.find().lean<Job[]>().exec();
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
  await dbConnect();
  try {
    const res = await JobApplications.updateOne({ _id }, job);
    console.log(res.acknowledged);
  } catch (error) {
    console.error(error);
  }
}

// NOTES

// the job app tracking portion, with lanes and cards
// eventually a table
// if no jobs, display a no jobs tracked
