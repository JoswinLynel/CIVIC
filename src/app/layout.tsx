import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CIVIC - Global Political Intelligence",
  description: "POWER. MONEY. POLITICS. Public-data intelligence platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-civic-bg text-civic-ivory antialiased`}>
        <div className="flex flex-col min-h-screen">
          <header className="border-b border-civic-elevated/50 bg-civic-surface/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <Link href="/" className="text-xl font-bold tracking-widest uppercase">CIVIC</Link>
                <nav className="hidden md:flex space-x-6 text-sm text-civic-grey">
                  <Link href="/countries/india" className="hover:text-civic-ivory transition-colors">India</Link>
                  <Link href="/news" className="hover:text-civic-ivory transition-colors">News</Link>
                  <Link href="/ask" className="hover:text-civic-ivory transition-colors">Ask CIVIC</Link>
                </nav>
              </div>
              <div>
                <span className="text-xs text-civic-grey px-3 py-1 border border-civic-elevated rounded-full">Phase 1 Foundation</span>
              </div>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t border-civic-elevated/50 py-8 text-center text-sm text-civic-grey">
            <p>© {new Date().getFullYear()} CIVIC Intelligence. Data from public sources.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
