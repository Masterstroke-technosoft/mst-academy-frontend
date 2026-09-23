import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import orgSchema from "@/lib/schema/organization.json";
import ChatBotWidget from "@/components/chatbotWidget/chatbotWidget";

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://masterstroke.academy'),

  title: {
    default: 'Online Blockchain Course in India | Masterstroke Academy',
    template: '%s | Masterstroke Academy',
  },

  description:
    'Live blockchain course in India: 21 modules, on-chain certificate, internship and grant path. Deploy real contracts on MST Chain. See plans.',

  applicationName: 'Masterstroke Academy',
  authors: [{ name: 'Masterstroke Academy' }],
  creator: 'Masterstroke Technosoft Pvt. Ltd.',
  publisher: 'Masterstroke Technosoft Pvt. Ltd.',

  manifest: '/manifest.json',

  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MST Academy',
  },

  alternates: { canonical: '/' },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },

  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://masterstroke.academy/',
    siteName: 'Masterstroke Academy',
    title: 'Online Blockchain Course in India | Masterstroke Academy',
    description:
      'Live blockchain course in India: 21 modules, on-chain certificate, internship and grant path. Deploy real contracts on MST Chain.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Masterstroke Academy — online blockchain course in India',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Online Blockchain Course in India | Masterstroke Academy',
    description: 'Live blockchain course: 21 modules, on-chain certificate, internship and grant path.',
    images: ['/og-image.png'],
  },

  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} h-full`} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/1.png" type="image/png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0BTDN5EMY4"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0BTDN5EMY4');
          `}
        </Script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(function(err) {
                    console.log('PWA Service Worker registration note:', err);
                  });
                });
              }
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('copy', function(e) {
                const target = e.target;
                if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
                  return;
                }
                e.preventDefault();
              });
              document.addEventListener('cut', function(e) {
                const target = e.target;
                if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
                  return;
                }
                e.preventDefault();
              });
              document.addEventListener('dragstart', function(e) {
                const target = e.target;
                if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
                  return;
                }
                e.preventDefault();
              });
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased max-w-full overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
        <ChatBotWidget />
      </body>
    </html>
  );
}
