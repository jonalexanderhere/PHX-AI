import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/components/auth/AuthProvider'
import ErrorBoundary from '@/components/ui/ErrorBoundary'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: {
    default: 'PHOENIX AI - Platform AI Terdepan',
    template: '%s | PHOENIX AI'
  },
  description: 'Tingkatkan produktivitas dan kreativitas Anda dengan kecerdasan buatan terkini. Chat dengan AI yang cerdas dan responsif.',
  keywords: ['AI', 'Artificial Intelligence', 'ChatGPT', 'Phoenix AI', 'Asisten AI', 'DeepSeek', 'Chat AI'],
  authors: [{ name: 'PHOENIX AI Team' }],
  creator: 'PHOENIX AI',
  publisher: 'PHOENIX AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://phx-ai.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://phx-ai.vercel.app',
    title: 'PHOENIX AI - Platform AI Terdepan',
    description: 'Tingkatkan produktivitas dan kreativitas Anda dengan kecerdasan buatan terkini',
    siteName: 'PHOENIX AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PHOENIX AI - Platform AI Terdepan',
    description: 'Tingkatkan produktivitas dan kreativitas Anda dengan kecerdasan buatan terkini',
    creator: '@phoenixai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
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

