import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Glance — Context-Aware AI That Sees What You Need",
  description: "Drop any image. Glance understands the context and tells you what you need before you even ask. Built for the Second Nature Hackathon.",
  keywords: ["Glance", "context-aware AI", "vision AI", "Meta AI Glasses", "Second Nature", "hackathon"],
  authors: [{ name: "Cubiczan" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Glance — Context-Aware AI",
    description: "AI that understands the moment. Drop an image, get contextual help.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Glance — Context-Aware AI",
    description: "AI that understands the moment. Drop an image, get contextual help.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
