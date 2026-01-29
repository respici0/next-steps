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
    console.log('lean', jobs);
    return jobs as Job[] | null;
  } catch (error) {
    console.error('TODO: error', error);
    return null;
    // notFound();
  }
}

// NOTES

// the job app tracking portion, with lanes and cards
// eventually a table
// if no jobs, display a no jobs tracked
