import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import fs from "fs";
import path from "path";

// Programmatically copy public/1.png to app favicon destinations and clean up default favicon
try {
  const publicIconPath = path.join(process.cwd(), "public", "1.png");
  const appFaviconPath = path.join(process.cwd(), "src", "app", "favicon.ico");
  const appIconPngPath = path.join(process.cwd(), "src", "app", "icon.png");

  if (fs.existsSync(publicIconPath)) {
    fs.copyFileSync(publicIconPath, appIconPngPath);
    if (fs.existsSync(appFaviconPath)) {
      fs.unlinkSync(appFaviconPath);
    }
  }
} catch (error) {
  console.error("Failed to automatically setup favicon:", error);
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Masterstroke Academy | Professional Blockchain Developer Program",
    template: "%s | Masterstroke Academy",
  },
  description:
    "Master blockchain development with 21 comprehensive modules across 4 phases. Learn Solidity, DeFi, NFTs, DAOs, and more with interactive assessments and live coding.",
  keywords: [
    "blockchain",
    "solidity",
    "web3",
    "defi",
    "nft",
    "dao",
    "smart contracts",
    "cryptocurrency",
    "ethereum",
    "developer course",
    "masterstroke",
    "MST blockchain",
  ],
  authors: [{ name: "Masterstroke Academy" }],
  creator: "MST Blockchain",
  icons: {
    icon: "/1.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Masterstroke Academy",
    title: "Masterstroke Academy | Professional Blockchain Developer Program",
    description:
      "21 modules, 4 phases, 122+ lessons. The most comprehensive blockchain developer program with interactive assessments and live code execution.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Masterstroke Academy",
    description: "Professional Blockchain Developer Program — Learn. Build. Launch.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} h-full`} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/1.png" type="image/png" />
        <meta name="theme-color" content="#e31e24" />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
