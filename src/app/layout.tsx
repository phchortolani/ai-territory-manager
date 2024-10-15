import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/navbar'
import { Toaster } from "@/components/ui/toaster"
import ReactQueryProvider from '@/contexts/ReactQueryProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI TAB',
  description: 'Territórios Alto do Baeta',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <Navbar>
            {children}
          </Navbar>
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  )
}
