import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { Header } from "@/components/layout";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "SQL4All - Aprende SQL Interactivamente",
  description:
    "Domina SQL paso a paso con ejercicios prácticos y retroalimentación inmediata",
  openGraph: {
    title: "SQL4All - Aprende SQL Interactivamente",
    description:
      "Domina SQL paso a paso con ejercicios prácticos y retroalimentación inmediata",
    url: "https://www.sql4all.org",
    siteName: "SQL4All",
    images: [
      {
        url: "https://www.sql4all.org/og.png",
        width: 1200,
        height: 630,
        alt: "SQL4All - Interactive SQL Learning Platform",
      },
    ],
    locale: "es",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SQL4All - Aprende SQL Interactivamente",
    description:
      "Domina SQL paso a paso con ejercicios prácticos y retroalimentación inmediata",
    images: ["https://www.sql4all.org/og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "oklch(0.62 0.10 205)",
          colorTextOnPrimaryBackground: "oklch(0.98 0.01 205)",
          colorBackground: "oklch(0.25 0.003 197)",
          colorInputBackground: "oklch(0.30 0.005 197)",
          colorInputText: "oklch(0.95 0.005 197)",
          colorText: "oklch(0.95 0.005 197)",
          colorTextSecondary: "oklch(0.71 0.002 197)",
          colorDanger: "oklch(0.73 0.11 55)",
          colorSuccess: "oklch(0.70 0.15 145)",
          colorWarning: "oklch(0.80 0.15 85)",
          borderRadius: "0.75rem",
          fontFamily: "var(--font-sans), Inter, system-ui, sans-serif",
          fontFamilyButtons: "var(--font-sans), Inter, system-ui, sans-serif",
        },
        elements: {
          rootBox: "font-sans",
          card: "bg-card shadow-xl backdrop-blur-sm",
          headerTitle: "text-foreground font-semibold tracking-tight",
          headerSubtitle: "text-muted-foreground",
          socialButtonsBlockButton:
            "bg-secondary hover:bg-secondary/80 text-foreground transition-colors",
          socialButtonsBlockButtonText: "text-foreground font-medium",
          dividerLine: "bg-muted",
          dividerText: "text-muted-foreground",
          formFieldLabel: "text-foreground font-medium",
          formFieldInput:
            "bg-input text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring transition-all",
          formButtonPrimary:
            "bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-md hover:shadow-lg transition-all",
          formButtonReset: "text-primary hover:text-primary/80",
          footerActionLink: "text-primary hover:text-primary/80 font-medium",
          identityPreviewText: "text-foreground",
          identityPreviewEditButton: "text-primary hover:text-primary/80",
          formFieldSuccessText: "text-emerald-500",
          formFieldErrorText: "text-destructive",
          alert: "bg-destructive/10 text-destructive",
          alertText: "text-destructive",
          userButtonPopoverCard: "bg-card shadow-xl",
          userButtonPopoverActionButton:
            "hover:bg-accent text-foreground transition-colors",
          userButtonPopoverActionButtonText: "text-foreground",
          userButtonPopoverActionButtonIcon: "text-muted-foreground",
          userButtonPopoverFooter: "",
          userPreviewMainIdentifier: "text-foreground font-medium",
          userPreviewSecondaryIdentifier: "text-muted-foreground",
          avatarBox: "ring-2 ring-primary/20",
          badge: "bg-primary/10 text-primary",
          modalBackdrop: "bg-background/80 backdrop-blur-sm",
          modalContent: "bg-card shadow-2xl",
        },
      }}
    >
      <html lang="es" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        >
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
                  toast:
                    "group flex items-center gap-3 w-full p-4 rounded-lg border shadow-lg bg-card",
                  title: "text-sm font-medium",
                  description: "text-sm opacity-90",
                  success:
                    "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200",
                  error:
                    "bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200",
                  warning:
                    "bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200",
                  info: "bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200",
                },
              }}
            />
            <Analytics />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
