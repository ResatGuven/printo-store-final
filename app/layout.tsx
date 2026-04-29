import type { Metadata } from 'next'
import { Space_Mono, DM_Sans } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600'],
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'PRINTO | 3D Yazıcı Mağazası',
  description: 'Kaliteli 3D baskı ürünleri — Dekorasyon, Otomotiv, Yedek Parça',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${spaceMono.variable} font-sans antialiased`}>
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  )
}
