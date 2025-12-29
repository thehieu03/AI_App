"use client";

import React, { useEffect, useState } from "react";
import { getUserCredits } from "~/app/actions/tts";
import { Coins } from "lucide-react";

const Credits = () => {
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const result = await getUserCredits();
        setCredits(result.success ? result.credits : 0);
      } catch (error) {
        console.error("Error fetching credits:", error);
        setCredits(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, []);

  if (loading) {
    return (
      <div className="group flex items-center gap-2">
        <Coins className="h-4 w-4 animate-pulse text-yellow-500" />
        <span className="text-muted-foreground text-sm">Loading...</span>
      </div>
    );
  }

  return (
    <div className="group hover:bg-muted/50 flex items-center gap-2 rounded-lg p-2 transition-colors">
      <Coins className="h-4 w-4 text-yellow-500 transition-colors group-hover:text-yellow-700" />
      <span className="text-muted-foreground group-hover:text-foreground text-sm transition-colors group-hover:font-semibold">
        {credits} Credits
      </span>
    </div>
  );
};

export default Credits;
