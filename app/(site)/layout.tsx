import { NavBar } from '@/components/NavBar';
import { getUserSession } from '@/lib/server-actions/login';
import { redirect } from 'next/navigation';

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getUserSession();

  const user = session?.user;

  if (user) {
    return (
      <>
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur">
          <NavBar user={user} />
        </header>
        {children}
      </>
    );
  } else {
    redirect('/login');
  }
}
