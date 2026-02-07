"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { Spinner } from "./Spinner";

/** F1-style logo mark: chequered flag motif in brand red */
function F1TravelLogo() {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center" aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
        <path d="M2 2h10v10H2V2zm10 10h10v10H12V12z" fill="#dc2626" />
        <path d="M12 2h10v10H12V2zM2 12h10v10H2V12z" fill="#374151" />
      </svg>
    </span>
  );
}

/** User avatar: Google profile image when available, else initials from name or email (min 44px for touch) */
function UserAvatar({ user }: { user: { name?: string | null; email?: string | null; image?: string | null } }) {
  const name = user.name ?? "";
  const email = user.email ?? "";
  const image = user.image;

  const initials = (() => {
    if (name.trim()) {
      return name
        .split(/\s+/)
        .filter(Boolean)
        .map((s) => s[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      const local = email.split("@")[0] ?? "";
      return (local.slice(0, 2) || "?").toUpperCase();
    }
    return "?";
  })();

  return (
    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-gray-800 ring-2 ring-transparent transition-[box-shadow] hover:ring-red-600/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 min-h-[44px] min-w-[44px]">
      {image ? (
        <Image
          src={image}
          alt={(name || email) ? `${name || email} profile` : "Profile"}
          width={40}
          height={40}
          className="object-cover"
          unoptimized
        />
      ) : (
        <span className="text-sm font-medium text-gray-300" aria-hidden>
          {initials || "?"}
        </span>
      )}
    </span>
  );
}

/**
 * Header: logo + nav (with icons) + user avatar / Sign in.
 * Airbnb-style: icon per tab, product logo, avatar instead of email.
 */
export function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;
  const isAccountActive =
    pathname === "/account" || pathname.startsWith("/account/");

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#14171C]/95 backdrop-blur-sm">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3 sm:px-8 sm:py-3.5 lg:px-10 lg:gap-8"
        aria-label="Main navigation"
      >
        <div className="flex items-center gap-8 lg:gap-12">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5 text-lg font-semibold text-white transition-colors hover:text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#14171C]"
          >
            <F1TravelLogo />
            <span>F1 Travel</span>
          </Link>
          {/* Nav link padding: px-4 py-2.5 (16px/10px) — standard for header and tab-style links */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className={`relative flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-white/5 sm:min-h-0 sm:min-w-0 sm:flex-row sm:gap-1.5 sm:rounded-md sm:px-4 sm:py-2.5 ${
                isActive("/") ? "font-medium text-white" : "text-gray-400"
              }`}
              aria-current={isActive("/") ? "page" : undefined}
            >
              {isActive("/") && (
                <span className="absolute -top-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-red-600 sm:left-2 sm:translate-x-0" />
              )}
              <span className="material-symbols-outlined text-xl shrink-0 sm:text-base" aria-hidden>home</span>
              <span>Home</span>
              {isActive("/") && (
                <span className="absolute -bottom-0.5 left-0 h-0.5 w-full bg-red-600" />
              )}
            </Link>
            <Link
              href="/trip"
              className={`relative flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-white/5 sm:min-h-0 sm:min-w-0 sm:flex-row sm:gap-1.5 sm:rounded-md sm:px-4 sm:py-2.5 ${
                isActive("/trip") ? "font-medium text-white" : "text-gray-400"
              }`}
              aria-current={isActive("/trip") ? "page" : undefined}
            >
              {isActive("/trip") && (
                <span className="absolute -top-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-red-600 sm:left-2 sm:translate-x-0" />
              )}
              <span className="material-symbols-outlined text-xl shrink-0 sm:text-base" aria-hidden>location_on</span>
              <span>Trip</span>
              {isActive("/trip") && (
                <span className="absolute -bottom-0.5 left-0 h-0.5 w-full bg-red-600" />
              )}
            </Link>
            {session && (
              <Link
                href="/account"
                className={`relative flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-white/5 sm:min-h-0 sm:min-w-0 sm:flex-row sm:gap-1.5 sm:rounded-md sm:px-4 sm:py-2.5 ${
                  isAccountActive ? "font-medium text-white" : "text-gray-400"
                }`}
                aria-current={isAccountActive ? "page" : undefined}
              >
                {isAccountActive && (
                  <span className="absolute -top-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-red-600 sm:left-2 sm:translate-x-0" />
                )}
                <span className="material-symbols-outlined text-xl shrink-0 sm:text-base" aria-hidden>person</span>
                <span>Account</span>
                {isAccountActive && (
                  <span className="absolute -bottom-0.5 left-0 h-0.5 w-full bg-red-600" />
                )}
              </Link>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {status === "loading" ? (
            <div className="flex min-h-[44px] items-center gap-2">
              <Spinner size="sm" />
              <span className="sr-only">Loading authentication status</span>
            </div>
          ) : session ? (
            <div className="flex items-center gap-3">
              <Link
                href="/account"
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#14171C] rounded-full"
                aria-label="Account"
              >
                <UserAvatar user={session.user} />
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                className="rounded-md border border-gray-700 bg-transparent px-4 py-2 text-sm font-medium text-gray-300 transition-transform hover:border-red-600/50 hover:bg-red-600/10 hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#14171C] min-h-[44px]"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => signIn("google")}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-transform hover:bg-red-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#14171C] min-h-[44px]"
            >
              Sign in
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
