"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";

export default function Header() {
  const pathname = usePathname();

  const getLinkClass = (href: string) => {
    const isActive = pathname === href;
    return `text-xs font-semibold transition duration-200 tracking-wide ${
      isActive ? "text-brand font-bold" : "text-txt-secondary hover:text-txt-primary"
    }`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-main bg-bg-main/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 sm:px-6 md:px-8">
        {/* Left: Logo and navigation */}
        <div className="flex items-center gap-10">
          <Link 
            href="/" 
            className="text-base font-black text-txt-primary tracking-wider uppercase hover:text-brand transition duration-200"
          >
            Codorö<span className="text-brand font-black">.</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/dashboard" 
              className={getLinkClass("/dashboard")}
            >
              Dashboard
            </Link>
            <Link 
              href="/streams" 
              className={getLinkClass("/streams")}
            >
              Streams
            </Link>
            <Link 
              href="/communities" 
              className={getLinkClass("/communities")}
            >
              Communities
            </Link>
          </nav>
        </div>

        {/* Right: Auth Controls */}
        <div className="flex items-center gap-4">
          <Show when="signed-out">
            <div className="flex items-center gap-3">
              <SignInButton mode="modal">
                <button className="px-4 py-1.5 rounded-xl border border-border-main bg-card-bg hover:bg-hover-bg text-xs font-bold text-txt-secondary hover:text-txt-primary transition duration-200 cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-1.5 rounded-xl bg-brand hover:bg-brand-hover shadow-sm text-xs font-bold text-white transition duration-200 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </Show>

          <Show when="signed-in">
            <UserButton showName appearance={{
              elements: {
                userButtonOuterIdentifier: "text-txt-secondary font-bold text-xs mr-1 uppercase tracking-wider"
              }
            }} />
          </Show>
        </div>
      </div>
    </header>
  );
}
