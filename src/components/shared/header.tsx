"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";

export default function Header() {
  const pathname = usePathname();

  const getLinkClass = (href: string) => {
    const isActive = pathname === href;
    return `text-xs font-semibold transition duration-200 tracking-wide ${
      isActive ? "text-[#6366F1]" : "text-[#9E9E9E] hover:text-white"
    }`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[rgba(255,255,255,0.08)] bg-[#070707]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 md:px-8">
        {/* Left: Logo and navigation */}
        <div className="flex items-center gap-10">
          <Link 
            href="/" 
            className="text-base font-black text-white tracking-wider uppercase hover:text-[#6366F1] transition duration-200"
          >
            Codorö<span className="text-[#6366F1] font-black">.</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className={getLinkClass("/")}
            >
              Discover
            </Link>
            <Link 
              href="/streams" 
              className={getLinkClass("/streams")}
            >
              Browse streams
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
                <button className="px-4 py-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[#111111] hover:bg-[#171717] text-xs font-semibold text-[#9E9E9E] hover:text-white transition duration-200 cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-1.5 rounded-lg bg-[#6366F1] hover:bg-[#5053E4] shadow-sm text-xs font-semibold text-white transition duration-200 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </Show>

          <Show when="signed-in">
            <UserButton showName appearance={{
              elements: {
                userButtonOuterIdentifier: "text-[#9E9E9E] font-bold text-xs mr-1 uppercase tracking-wider"
              }
            }} />
          </Show>
        </div>
      </div>
    </header>
  );
}
