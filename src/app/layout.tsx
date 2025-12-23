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
            <Toaster position="top-center" richColors />
            <Analytics />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
