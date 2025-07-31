import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'World Trade Indices Monitor',
  description: 'Real-time monitoring of major global stock market indices including S&P 500, NASDAQ, Dow Jones, FTSE 100, Nikkei 225, and more.',
  keywords: 'stock market, indices, real-time, trading, finance, S&P 500, NASDAQ, Dow Jones',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
