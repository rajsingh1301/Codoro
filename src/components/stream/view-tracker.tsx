"use client";

import { useEffect } from "react";

export default function ViewTracker({
  streamId,
}: {
  streamId: string;
}) {
  useEffect(() => {
    fetch(
      `/api/viewer/${streamId}`,
      {
        method: "POST",
      }
    );
  }, [streamId]);

  return null;
}