import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";
import { Providers } from './providers'
import { Header } from '@/components/header'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "SQL 4 All",
  description: "Aprende SQL con ejercicios interactivos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen`}>
        <Providers>
          <ProtectedRoute>
            <div className="min-h-screen bg-background text-foreground bg-gradient-to-b from-background to-secondary/20">
              <Header />
              {children}
            </div>
          </ProtectedRoute>
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
