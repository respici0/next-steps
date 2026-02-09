'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logoutUser } from '@/lib/server-actions/login';
import type { User } from 'better-auth';

export function NavBar({ user }: { user: User | null }) {
  const firstLetter = user?.name?.charAt(0) ?? '';
  return (
    <nav className="border-b-2">
      <div className="px-4 py-1 flex items-center justify-between">
        <Link href="/">
          <p className="text-black">Logo</p>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="border-2 flex items-center justify-center rounded-full border-black w-10 h-10 cursor-pointer"
            >
              <span className="text-black font-bold uppercase">{firstLetter}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40" align="start">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={logoutUser}>Log out</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
