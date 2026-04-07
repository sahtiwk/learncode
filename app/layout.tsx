import type { Metadata } from "next";
import { Geist, Geist_Mono, Jersey_10, Inter } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "./_components/Header";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const GameFont = Jersey_10({ subsets: ["latin"], variable: "--font-game", weight: ["400"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "LearnCode",
  description: "Learning Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/sign-in"
    >
      <html lang="en" suppressHydrationWarning className="dark">
        <body className={`${geistSans.variable} ${geistMono.variable} ${GameFont.variable} ${inter.variable} antialiased`}>
          <Provider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <Header />
            {children}
            <Toaster />
            <div id="clerk-captcha" />
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}