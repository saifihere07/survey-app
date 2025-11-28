"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface AuthButtonsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: any;
}

export default function AuthButtons({ session }: AuthButtonsProps) {
  return session?.user ? (
    <div className="flex items-center gap-2">
      <Link href="/dashboard">
        <Button variant="outline">Dashboard</Button>
      </Link>
      <Button variant="outline" onClick={() => signOut()}>
        Sign Out
      </Button>
    </div>
  ) : (
    <Link href="/sign-in">
      <Button variant="outline">Sign In</Button>
    </Link>
  );
}
