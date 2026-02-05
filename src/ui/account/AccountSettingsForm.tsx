"use client";

import { signOut } from "next-auth/react";

/**
 * Sign out button for Account settings. Client component for next-auth signOut.
 */
export function AccountSettingsForm() {
  return (
    <div className="pt-2 border-t border-gray-800/50">
      <button
        type="button"
        onClick={() => signOut()}
        className="rounded-md border border-gray-700 bg-transparent px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-red-600/50 hover:bg-red-600/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 min-h-[44px]"
      >
        Sign out
      </button>
    </div>
  );
}
