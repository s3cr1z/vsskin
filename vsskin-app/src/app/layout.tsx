import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import "../styles/carbon.scss";
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AppThemeProvider } from '@/contexts/AppThemeContext';

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "vsskin - VS Code Theme Studio",
  description: "Browse, preview, and install branded VS Code themes from popular tech brands",
  keywords: ["VS Code", "themes", "development", "coding", "IDE", "customization"],
  authors: [{ name: "vsskin Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <AppThemeProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
}
