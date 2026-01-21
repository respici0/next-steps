import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: String, required: true },
    jobTitle: { type: String, required: true },
    status: { type: String, enum: ['applied', 'interviewing', 'offered', 'rejected'], default: 'applied' },
    appliedAt: { type: Date, default: Date.now },
    notes: { type: String },
    jobUrl: { type: String },
}, {
    timestamps: true,
})

const JobApplication = mongoose.models.JobApplication || mongoose.model('JobApplication', jobApplicationSchema);

export default JobApplication;