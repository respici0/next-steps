"use client";
import Link from "next/link";
import User, { type UserDoc } from "@/lib/models/user";

type Id = { id: string };
type User = Id & Omit<UserDoc, "_id">;

export function NavBar({ user }: { user: User | null }) {
  const firstLetter = user?.name?.charAt(0) ?? "";
  return (
    <nav>
      <div className="px-4 py-1 flex items-center justify-between">
        <Link href="/">
          <p className="text-black">Logo</p>
        </Link>
        <div className="border-2 flex items-center justify-center rounded-full border-black w-10 h-10">
          <span className="text-black font-bold">{firstLetter}</span>
        </div>
      </div>
    </nav>
  );
}
