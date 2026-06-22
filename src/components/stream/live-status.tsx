"use client";

import { useEffect, useState } from "react";


type Props = {
  streamId: string;
};

export default function LiveStatus({
  streamId,
}: Props) {
  const [status, setStatus] = useState<
    "LIVE" | "OFFLINE"
  >("OFFLINE");

  useEffect(() => {
    async function fetchStatus() {
      try {
        const response = await fetch(
          `/api/test-status/${streamId}`
        );

        const data = await response.json();

        setStatus(data.status);
      } catch (error) {
        console.error(
          "Failed to fetch stream status:",
          error
        );
      }
    }

    // Initial fetch
    fetchStatus();

    // Poll every 5 seconds
    const interval = setInterval(
      fetchStatus,
      5000
    );

    return () => clearInterval(interval);
  }, [streamId]);

  return (
    <div className="mt-8 border rounded p-8">
      {status === "LIVE" ? (
        <div className="text-red-500 font-bold">
          🔴 LIVE NOW
        </div>
      ) : (
        <div className="text-gray-500 font-bold">
          ⚫ OFFLINE
        </div>
      )}
    </div>
  );
}