import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/components/auth/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PHOENIX AI - Platform AI Terdepan',
  description: 'Tingkatkan produktivitas dan kreativitas Anda dengan kecerdasan buatan terkini',
  keywords: ['AI', 'Artificial Intelligence', 'ChatGPT', 'Phoenix AI', 'Asisten AI'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}

