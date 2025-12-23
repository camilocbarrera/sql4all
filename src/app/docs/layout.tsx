import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Documentación - SQL4All',
  description: 'Guía completa de SQL y uso de la plataforma SQL4All',
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {children}
    </div>
  )
}

