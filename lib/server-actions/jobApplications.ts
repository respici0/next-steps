"use server";

import dbConnect from "../db/mongo";
import JobApplications, {
  type JobApplicationsDoc,
} from "../models/jobApplications";
// import { notFound } from "next/navigation";

export async function getAllJobApplications(): Promise<
  JobApplicationsDoc[] | null
> {
  await dbConnect();
  try {
    console.log("TODO: get all job applications");

    const jobApplications = await JobApplications.find();
    return jobApplications as unknown as JobApplicationsDoc[] | null;
  } catch (error) {
    console.error("TODO: error", error);
    return null;
    // notFound();
  }
}

// NOTES

// the job app tracking portion, with lanes and cards
// eventually a table
// if no jobs, display a no jobs tracked
