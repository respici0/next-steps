import { getUser } from '@/lib/auth/getUser';
import { redirect } from 'next/navigation';

export default async function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  if (user) {
    redirect('/');
  } else {
    return children;
  }
}
