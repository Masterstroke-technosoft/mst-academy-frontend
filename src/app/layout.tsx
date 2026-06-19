import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";

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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#e31e24" />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
