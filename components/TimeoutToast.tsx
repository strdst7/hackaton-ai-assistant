"use client";

import { useState, useEffect } from "react";
import { Clock, XCircle, RefreshCw } from "lucide-react";

interface TimeoutToastProps {
  isLoading: boolean;
  onAbort: () => void;
  onResume: () => void;
}

const WARNING_DELAY_MS = 8000;
const CRITICAL_DELAY_MS = 9500;

export function TimeoutToast({ isLoading, onAbort, onResume }: TimeoutToastProps) {
  const [showWarning, setShowWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShowWarning(false);
      setIsCritical(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) return;

    const warningTimer = setTimeout(() => setShowWarning(true), WARNING_DELAY_MS);
    const criticalTimer = setTimeout(() => setIsCritical(true), CRITICAL_DELAY_MS);

    return () => {
      clearTimeout(warningTimer);
      clearTimeout(criticalTimer);
    };
  }, [isLoading]);

  if (!showWarning) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
          isCritical
            ? "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
            : "bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800"
        }`}
      >
        <Clock className={`h-4 w-4 ${isCritical ? "text-red-500" : "text-amber-500"}`} />
        <div className="flex-1">
          <p className={`text-sm font-medium ${isCritical ? "text-red-700 dark:text-red-300" : "text-amber-700 dark:text-amber-300"}`}>
            {isCritical ? "Response is taking very long..." : "Taking longer than expected..."}
          </p>
          <p className="text-xs text-muted-foreground">
            {isCritical
              ? "The request may time out soon. Try aborting and retrying."
              : "You can wait, abort, or resume with a different approach."}
          </p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onAbort}
            className="p-1.5 rounded hover:bg-muted transition-colors"
            aria-label="Abort request"
            title="Stop and discard current response"
          >
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            onClick={onResume}
            className="p-1.5 rounded hover:bg-muted transition-colors"
            aria-label="Retry request"
            title="Retry with current message"
          >
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}