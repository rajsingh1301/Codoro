import type { Metadata } from "next";
import { Poppins, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Header } from "@/src/components/shared";
import { AppBackground } from "@/src/components/ui/app-background";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeLive",
  description: "Developer-first live coding stream workspace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#070707] text-txt-primary font-sans antialiased relative">
        <ClerkProvider>
          <div className="relative z-10 flex flex-col flex-1">
            <Header />
            {children}
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}

