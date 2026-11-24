
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Context providers
import UserLocationProvider from "./context/UserLocationProvider";
import SelectedBusinessProvider from "./context/SelectedBusinessProvider";
import { FavoriteProvider } from "./context/FavoriteContext";

// Load main application font
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Load monospace font
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Website metadata and application logo
export const metadata: Metadata = {
  title: "Find Near Place",
  description: "Find places near you",
  icons: {
    icon: "/Logo.png",
    shortcut: "/Logo.png",
    apple: "/Logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-full`}>
        <UserLocationProvider>
          <SelectedBusinessProvider>
            <FavoriteProvider>
              {children}
            </FavoriteProvider>
          </SelectedBusinessProvider>
        </UserLocationProvider>
      </body>
    </html>
  );
}
