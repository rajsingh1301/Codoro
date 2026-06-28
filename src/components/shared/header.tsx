"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";

export default function Header() {
  const pathname = usePathname();

  const getLinkClass = (href: string) => {
    const isActive = pathname === href;
    return `text-sm font-medium transition duration-200 tracking-wide ${
      isActive ? "text-[#7C3AED]" : "text-[#4A4870] hover:text-white"
    }`;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#1E1E3A] backdrop-blur-md bg-[#08080F]/80">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 md:px-8">
        {/* Left: Logo and navigation */}
        <div className="flex items-center gap-8">
          <Link 
            href="/" 
            className="text-base font-black text-white tracking-wider uppercase hover:text-[#7C3AED] transition duration-200"
          >
            Codorö<span className="text-[#7C3AED] font-black">.</span>
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
            <div className="flex items-center gap-3">
              <Link 
                href="/dashboard"
                className="h-7 px-3 text-xs font-semibold border border-[#2D2D5E] text-[#A09DC0] rounded-md bg-transparent hover:border-[#7C3AED] hover:text-[#C4B5FD] transition-all flex items-center justify-center cursor-pointer"
              >
                Dashboard
              </Link>
              <UserButton />
            </div>
          </Show>
        </div>
      </div>
    </header>
  );
}
