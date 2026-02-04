'use server';

import User, { type UserDoc } from '@/lib/models/user';
import dbConnect from '../db/mongo';
// eventually update this to validate user tokens once we have Auth implemented and then route to /login if token cannot be renewed on refresh.
export async function getUser(): Promise<UserDoc | null> {
  await dbConnect();
  try {
    const user = await User.findById('696e89b54f138149a24204d3').lean().exec();
    return user as UserDoc | null;
  } catch (error) {
    console.error('Unable to get user', error);
    return null;
  }
}
