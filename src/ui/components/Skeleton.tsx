import type { ReactNode } from "react";

type SkeletonProps = {
  className?: string;
  children?: ReactNode;
};

/**
 * Skeleton loader component for improved perceived performance.
 * Provides visual placeholder while content loads.
 */
export function Skeleton({ className = "", children }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse animate-shimmer rounded bg-gray-200 dark:bg-gray-800 ${className}`}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

/**
 * Skeleton text line - for text content placeholders
 */
export function SkeletonText({ 
  lines = 1, 
  className = "" 
}: { 
  lines?: number; 
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${
            i === lines - 1 ? "w-3/4" : "w-full"
          }`}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton input - for form input placeholders
 */
export function SkeletonInput({ className = "" }: { className?: string }) {
  return (
    <Skeleton
      className={`h-10 w-full ${className}`}
    />
  );
}

/**
 * Skeleton select - for dropdown placeholders
 */
export function SkeletonSelect({ className = "" }: { className?: string }) {
  return (
    <Skeleton
      className={`h-10 w-full ${className}`}
    />
  );
}

/**
 * Skeleton button - for button placeholders
 */
export function SkeletonButton({ className = "" }: { className?: string }) {
  return (
    <Skeleton
      className={`h-10 w-full ${className}`}
    />
  );
}
