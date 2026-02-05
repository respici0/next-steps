import { getUserSession } from '@/lib/server-actions/login';
import type { User } from 'better-auth';

export async function getUser(): Promise<User> {
  const session = await getUserSession();
  const user = session?.user;
  return user as User;
}
