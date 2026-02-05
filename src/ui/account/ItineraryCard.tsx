"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/ui/components/Card";
import { Spinner } from "@/ui/components/Spinner";
export type ItineraryCardDisplay = {
  id: string;
  raceName: string;
  countryFlag: string;
  raceDate: string;
  subtitle: string;
  createdDate: string;
};

type ItineraryCardProps = {
  itinerary: ItineraryCardDisplay;
  /** Delay in ms for staggered list fade-in */
  staggerDelay?: number;
};

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

/**
 * Itinerary card with view link, duplicate, and delete actions.
 * Primary tap opens itinerary; secondary actions in a button group.
 */
export function ItineraryCard({ itinerary, staggerDelay }: ItineraryCardProps) {
  const router = useRouter();
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (showDeleteModal) {
      cancelButtonRef.current?.focus();
    }
  }, [showDeleteModal]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setShowDeleteModal(false);
    }
    if (showDeleteModal) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [showDeleteModal]);

  async function handleDuplicate(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (isDuplicating || isDeleting) return;
    setIsDuplicating(true);
    try {
      const res = await fetch(`/api/itineraries/${itinerary.id}/duplicate`, { method: "POST" });
      const data = await res.json();
      if (res.ok && data.id) {
        router.push(`/itinerary/${data.id}`);
      } else {
        router.refresh();
      }
    } catch {
      router.refresh();
    } finally {
      setIsDuplicating(false);
    }
  }

  function openDeleteModal(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (isDuplicating || isDeleting) return;
    setShowDeleteModal(true);
  }

  const performDelete = useCallback(async () => {
    setIsDeleting(true);
    setShowDeleteModal(false);
    try {
      const res = await fetch(`/api/itineraries/${itinerary.id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        setIsDeleting(false);
      }
    } catch {
      setIsDeleting(false);
    }
  }, [itinerary.id, router]);

  function handleCancelDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(false);
  }

  return (
    <Card
      className="animate-fade-in cursor-pointer border-gray-800/50 bg-gray-900/30 backdrop-blur-sm transition-all duration-200 hover:scale-[1.01] hover:border-red-600/50 hover:shadow-md hover:shadow-red-600/10"
      style={staggerDelay != null ? { animationDelay: `${staggerDelay}ms` } : undefined}
    >
      <div className="flex items-start justify-between gap-4">
        <Link
          href={`/itinerary/${itinerary.id}`}
          className="min-w-0 flex-1"
        >
          <div>
            <h3 className="text-lg font-semibold text-white">
              <span className="mr-2" aria-hidden="true">
                {itinerary.countryFlag}
              </span>
              {itinerary.raceName}
            </h3>
            <p className="mt-1 text-sm text-gray-300">
              {itinerary.raceDate && (
                <>
                  {itinerary.raceDate}
                  {" · "}
                </>
              )}
              {itinerary.subtitle}
            </p>
          </div>
        </Link>
        <div className="flex shrink-0 items-center gap-1">
          <div className="text-sm text-gray-400">
            {itinerary.createdDate}
          </div>
          <div
            className="ml-2 flex gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleDuplicate}
              disabled={isDuplicating || isDeleting}
              aria-label="Duplicate itinerary"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-gray-400 transition-transform hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 active:scale-95 disabled:opacity-50"
            >
              {isDuplicating ? (
                <Spinner size="sm" />
              ) : (
                <CopyIcon className="h-5 w-5" />
              )}
            </button>
            <button
              type="button"
              onClick={openDeleteModal}
              disabled={isDuplicating || isDeleting}
              aria-label="Delete itinerary"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-gray-400 transition-transform hover:bg-red-600/20 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 active:scale-95 disabled:opacity-50"
            >
              {isDeleting ? (
                <Spinner size="sm" />
              ) : (
                <TrashIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          onClick={(e) => e.target === e.currentTarget && setShowDeleteModal(false)}
        >
          <div
            className="absolute inset-0 bg-black/70"
            aria-hidden
          />
          <div
            className="relative z-10 w-full max-w-sm rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="delete-dialog-title" className="font-heading text-lg font-semibold text-white">
              Are you sure?
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              This cannot be undone.
            </p>
            <div className="mt-6 flex gap-3 justify-end">
              <button
                ref={cancelButtonRef}
                type="button"
                onClick={handleCancelDelete}
                className="rounded-md border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 transition-transform hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 active:scale-95 min-h-[44px]"
              >
                No
              </button>
              <button
                type="button"
                onClick={performDelete}
                disabled={isDeleting}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-transform hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 active:scale-95 disabled:opacity-50 min-h-[44px]"
              >
                {isDeleting ? <Spinner size="sm" /> : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
