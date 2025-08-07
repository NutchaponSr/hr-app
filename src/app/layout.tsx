import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { cn } from "@/lib/utils";

import "./globals.css";
import QueryProvider from "@/providers/query-provider";

const font = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HR App",
  description: "Human Resources Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(font.className, "antialiased")}>
        <QueryProvider>
          <NuqsAdapter>
            {children}
            <Toaster position="top-center" />
          </NuqsAdapter>
        </QueryProvider>
      </body>
    </html>
  );
}
