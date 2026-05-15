// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Regala — The AI Gift Advisor",
  description: "Answer a few questions about her and get curated gift recommendations with explanations of why each one works.",
  metadataBase: new URL("https://regala.ai"),
  other: {
    "p:domain_verify": "fd5e51a014c5ea35530cf90aabbdd3e1",
  },
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