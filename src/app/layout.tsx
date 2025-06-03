import type React from "react"
import "./globals.css"
import { AppShell } from "@/components/layouts/app-shell"
import { APP_INFO } from "@/config/app.config.server"


export const metadata = APP_INFO.metadata

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head />
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
