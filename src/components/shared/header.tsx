"use client";

import Link from "next/link";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-955/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-8">
        {/* Left: Logo and navigation */}
        <div className="flex items-center gap-8">
          <Link 
            href="/" 
            className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-wide"
          >
            Codorö
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/dashboard" 
              className="text-sm font-medium text-slate-300 hover:text-white transition duration-200"
            >
              Dashboard
            </Link>
            <Link 
              href="/streams" 
              className="text-sm font-medium text-slate-300 hover:text-white transition duration-200"
            >
              Streams
            </Link>
            <Link 
              href="/communities" 
              className="text-sm font-medium text-slate-300 hover:text-white transition duration-200"
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
                <button className="px-4 py-1.5 rounded-lg border border-white/10 hover:border-white/20 text-xs font-medium text-white transition duration-200 cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white transition duration-200 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </Show>

          <Show when="signed-in">
            <UserButton showName appearance={{
              elements: {
                userButtonOuterIdentifier: "text-slate-300 font-medium text-xs mr-1"
              }
            }} />
          </Show>
        </div>
      </div>
    </header>
  );
}
