import type React from "react"
import { AppShell } from "@/components/layouts/app-shell"
import "./globals.css"

export const metadata = {
  title: "Blending 2.0 - TASA",
  description: "Sistema de gestión de homogenización TASA",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body suppressHydrationWarning>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
