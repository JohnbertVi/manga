import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./catchy-effects.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Manga Hinog - Your Premium Manga Experience",
  description: "Discover, read, and enjoy your favorite manga in a beautifully designed reading experience. Track progress, discover new series, and build your collection.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
