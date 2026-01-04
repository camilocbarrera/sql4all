"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";

export function useProfileSync() {
  const { user, isLoaded } = useUser();
  const hasSynced = useRef(false);

  useEffect(() => {
    if (!isLoaded || !user || hasSynced.current) return;

    // Sync profile on login
    const syncProfile = async () => {
      try {
        await fetch("/api/profiles/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        hasSynced.current = true;
      } catch (error) {
        console.warn("Failed to sync profile:", error);
      }
    };

    syncProfile();
  }, [isLoaded, user]);
}
