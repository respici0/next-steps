import mongoose from 'mongoose';
import { ARCHIVE_TTL_DAYS } from '../constants';
export { ARCHIVE_TTL_DAYS };

const jobApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: { type: String, required: true },
    jobTitle: { type: String, required: true },
    status: {
      type: String,
      enum: ['applied', 'interviewing', 'offered', 'rejected', 'archived'],
      default: 'applied',
    },
    appliedAt: { type: Date, default: Date.now },
    notes: { type: String },
    jobUrl: { type: String },
    archivedAt: { type: Date, default: null },
    previousStatus: {
      type: String,
      enum: ['applied', 'interviewing', 'offered', 'rejected'],
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export type JobApplicationsDoc = mongoose.InferSchemaType<typeof jobApplicationSchema> & {
  _id: mongoose.Types.ObjectId;
};

type Ids = { _id: string; userId: string };
export type Job = Ids & Omit<JobApplicationsDoc, '_id' | 'userId'>;
export type ArchivedJob = Job & { archivedAt: Date; previousStatus: string };

const JobApplications =
  (mongoose.models.JobApplication as mongoose.Model<JobApplicationsDoc>) ||
  mongoose.model('JobApplication', jobApplicationSchema);

export default JobApplications;
