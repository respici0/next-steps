"use server";

import dbConnect from "../db/mongo";
import JobApplication from "../models/jobApplications"
import { notFound } from "next/navigation";

export async function getAllJobApplications() {
    await dbConnect();
  try {
    console.log("TODO: get all job applications");
    const jobApplications = await JobApplication.find();
    return jobApplications;
  } catch (error) {
    console.error("TODO: error", error);
    notFound();
  }
}

// NOTES 

// the job app tracking portion, with lanes and cards
// eventually a table
// if no jobs, display a no jobs tracked
