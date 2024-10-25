import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from 'next/font/google'
import "./globals.css";
import { Providers } from './providers'
import { SQLErrorWrapper } from "@/components/sql-error-wrapper";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <Providers>
          <SQLErrorWrapper>
            {children}
          </SQLErrorWrapper>
        </Providers>
      </body>
    </html>
  );
}
