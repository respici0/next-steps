import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    occupation: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

export type UserDoc = mongoose.InferSchemaType<typeof userSchema> & {
  _id: mongoose.Types.ObjectId;
};

const User =
  (mongoose.models.User as mongoose.Model<UserDoc>) ||
  mongoose.model<UserDoc>("User", userSchema);

export default User;
