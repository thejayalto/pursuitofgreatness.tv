import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://pursuitofgreatness.tv'),
  title: 'Pursuit of Greatness',
  description: 'Shows for those in the pursuit of greatness.',
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-serif antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
