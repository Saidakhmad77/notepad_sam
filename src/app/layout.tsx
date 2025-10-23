import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Notepad",
  description: "Notes with auth",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b bg-white">
          <nav className="mx-auto flex max-w-5xl items-center justify-between p-4">
            <Link href="/" className="font-semibold">Notepad</Link>
            <div className="space-x-4">
              <Link href="/notes" className="hover:underline">Notes</Link>
              <Link href="/signin" className="hover:underline">Sign in</Link>
              <Link href="/signup" className="hover:underline">Sign up</Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl p-4">{children}</main>
      </body>
    </html>
  );
}
