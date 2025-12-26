import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/react'
import { Toaster } from 'sonner'
import { Providers } from './providers'
import { Header } from '@/components/layout'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'SQL4All - Aprende SQL Interactivamente',
  description: 'Domina SQL paso a paso con ejercicios prácticos y retroalimentación inmediata',
  openGraph: {
    title: 'SQL4All - Aprende SQL Interactivamente',
    description: 'Domina SQL paso a paso con ejercicios prácticos y retroalimentación inmediata',
    url: 'https://www.sql4all.org',
    siteName: 'SQL4All',
    images: [
      {
        url: 'https://www.sql4all.org/og.png',
        width: 1200,
        height: 630,
        alt: 'SQL4All - Interactive SQL Learning Platform',
      },
    ],
    locale: 'es',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SQL4All - Aprende SQL Interactivamente',
    description: 'Domina SQL paso a paso con ejercicios prácticos y retroalimentación inmediata',
    images: ['https://www.sql4all.org/og.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="es" suppressHydrationWarning>
        <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
          <Providers>
            <div className="relative min-h-screen bg-background">
              <Header />
              <main>{children}</main>
            </div>
            <Toaster 
              position="top-center"
              toastOptions={{
                unstyled: true,
                classNames: {
                  toast: 'group flex items-center gap-3 w-full p-4 rounded-lg border shadow-lg bg-card',
                  title: 'text-sm font-medium',
                  description: 'text-sm opacity-90',
                  success: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
                  error: 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
                  warning: 'bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
                  info: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
                },
              }}
            />
            <Analytics />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
