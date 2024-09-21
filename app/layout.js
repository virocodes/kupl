import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "kupl.me",
  description: "AI Relationship Analyzer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/kupl.png" type="image/svg+xml" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
