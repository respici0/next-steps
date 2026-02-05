import { getUserSession } from '@/lib/server-actions/login';
import { redirect } from 'next/navigation';

export default async function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getUserSession();

  const user = session?.user;

  if (user) {
    redirect('/');
  } else {
    return children;
  }
}
