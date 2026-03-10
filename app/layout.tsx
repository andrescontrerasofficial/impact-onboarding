import type { Metadata } from "next";
import "./globals.css";
import PostHogProvider from "./components/PostHogProvider";

export const metadata: Metadata = {
  title: "The Impact Team",
  description: "Welcome to The Impact Team — Your sales journey starts here.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
