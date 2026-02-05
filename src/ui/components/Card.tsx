import type { CSSProperties, ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/**
 * Card component wrapper.
 */
export function Card({ children, className = "", style }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
