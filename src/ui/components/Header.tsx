"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { Spinner } from "./Spinner";

/**
 * Header component with navigation (Home, Trip, Account, Sign in/out).
 */
export function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#14171C]/95 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-lg font-semibold text-white hover:text-gray-300"
          >
            F1 Travel
          </Link>
          <div className="flex gap-6">
            <Link
              href="/"
              className={`relative flex items-center gap-1.5 text-sm transition-opacity hover:opacity-80 ${
                isActive("/")
                  ? "font-medium text-white"
                  : "text-gray-400"
              }`}
            >
              {isActive("/") && (
                <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
              )}
              <span>Home</span>
              {isActive("/") && (
                <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-red-600" />
              )}
            </Link>
            <Link
              href="/trip"
              className={`relative flex items-center gap-1.5 text-sm transition-opacity hover:opacity-80 ${
                isActive("/trip")
                  ? "font-medium text-white"
                  : "text-gray-400"
              }`}
            >
              {isActive("/trip") && (
                <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
              )}
              <span>Trip</span>
              {isActive("/trip") && (
                <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-red-600" />
              )}
            </Link>
            {session && (
              <Link
                href="/account"
                className={`relative flex items-center gap-1.5 text-sm transition-opacity hover:opacity-80 ${
                  isActive("/account")
                    ? "font-medium text-white"
                    : "text-gray-400"
                }`}
              >
                {isActive("/account") && (
                  <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                )}
                <span>Account</span>
                {isActive("/account") && (
                  <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-red-600" />
                )}
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center">
          {status === "loading" ? (
            <div className="flex items-center gap-2">
              <Spinner size="sm" />
              <span className="sr-only">Loading authentication status</span>
            </div>
          ) : session ? (
            <div className="flex items-center gap-4">
              <span className="hidden text-sm text-gray-400 sm:inline">
                {session.user?.email}
              </span>
              <button
                onClick={() => signOut()}
                className="rounded-md border border-gray-700 bg-transparent px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:border-red-600/50 hover:bg-red-600/10 hover:text-white"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              Sign in
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
