// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gift AI - Find Perfect Gifts",
  description: "AI-powered gift recommendations personalized for your loved ones",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: "#1c1917",
                color: "white",
                borderRadius: "12px",
                fontFamily: "'DM Sans', sans-serif",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}