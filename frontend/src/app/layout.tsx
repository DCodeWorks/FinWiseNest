import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarNav } from "@/components/SideNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinWiseNest",
  description: "Personal Investment and Wealth Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 2. CREATE THE MAIN LAYOUT STRUCTURE */}
        <div className="flex h-screen bg-gray-50">
          <SidebarNav />
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* We can add a top header here later if needed */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto">
              {/* The page content will be rendered here */}
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
