import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { NavBar } from '@/components/NavBar';
import { getUser } from '@/lib/server-actions/users';
import { cn } from '@/lib/utils';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Next Steps',
  description: 'Job tracker app',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const _user = await getUser();
  const user = _user ? { ..._user, _id: String(_user._id) } : null;

  return (
    <html lang="en">
      <body
        className={cn(`${geistSans.variable} ${geistMono.variable} antialiased`, 'overflow-hidden')}
      >
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur">
          <NavBar user={user} />
        </header>
        {children}
      </body>
    </html>
  );
}
