"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui";

export function UserProfile() {
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <Button size="sm">Comenzar</Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-8 w-8",
            },
          }}
        />
      </SignedIn>
    </>
  );
}
