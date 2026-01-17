"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

/**
 * Header component with navigation (Home, Trip, Account, Sign in/out).
 */
export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-lg font-semibold text-gray-900 hover:text-gray-700 dark:text-gray-100 dark:hover:text-gray-300"
          >
            F1 Travel
          </Link>
          <div className="flex gap-4">
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Home
            </Link>
            <Link
              href="/trip"
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              Trip
            </Link>
            {session && (
              <Link
                href="/account"
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                Account
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center">
          {status === "loading" ? (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Loading...
            </span>
          ) : session ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {session.user?.email}
              </span>
              <button
                onClick={() => signOut()}
                className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Sign in
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
