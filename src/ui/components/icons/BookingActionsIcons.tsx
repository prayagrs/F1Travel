/** Small icons for Edit and Remove actions on booking cards. 20x20, use in min 44px touch targets. */

export function PencilIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
      <path d="M15.5 2.5a2.12 2.12 0 0 1 3 3L11 13l-4 1 1-4 7.5-7.5z" />
    </svg>
  );
}

export function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 6h14M8 6V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2m3 0v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h12z" />
      <path d="M8 10v4M12 10v4" />
    </svg>
  );
}
