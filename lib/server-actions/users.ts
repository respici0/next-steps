"use server";

import User, { type UserDoc } from "@/lib/models/user";

export async function getUser(): Promise<UserDoc | null> {
  try {
    const user = await User.findById("696e89b54f138149a24204d3").lean().exec();
    return user as UserDoc | null;
  } catch (error) {
    console.error("Unable to get user", error);
    return null;
  }
}
