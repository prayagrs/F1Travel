import type { ReactNode } from "react";

type SectionProps = {
  title: string;
  children: ReactNode;
  className?: string;
  /** Optional class for the section heading (e.g. font-heading text-white for dark theme). */
  titleClassName?: string;
};

/**
 * Section wrapper component with title and children.
 */
export function Section({ title, children, className = "", titleClassName }: SectionProps) {
  return (
    <section className={className}>
      <h2
        className={`text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100 ${titleClassName ?? ""}`}
      >
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}
