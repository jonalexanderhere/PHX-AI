'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Logo from '@/components/ui/Logo'
import { Sparkles, Zap, Shield, Brain, MessageSquare, Code, AlertCircle } from 'lucide-react'

export default function HomePage() {
  const [envConfigured, setEnvConfigured] = useState(true)

  useEffect(() => {
    // Check if environment variables are configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl.includes('your-project')) {
      setEnvConfigured(false)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white">
      <Navbar />

      {/* Environment Warning */}
      {!envConfigured && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-2xl w-full mx-4">
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-yellow-900 mb-1">
                  ⚠️ Konfigurasi Belum Lengkap
                </h3>
                <p className="text-sm text-yellow-800 mb-2">
                  File <code className="bg-yellow-100 px-1 py-0.5 rounded">.env.local</code> belum dikonfigurasi dengan benar.
                </p>
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Langkah cepat:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Buat akun di <a href="https://supabase.com" target="_blank" className="underline font-semibold">Supabase.com</a></li>
                    <li>Buat project baru dan copy API keys</li>
                    <li>Buat akun di <a href="https://huggingface.co" target="_blank" className="underline font-semibold">HuggingFace.co</a></li>
                    <li>Edit file <code className="bg-yellow-100 px-1 py-0.5 rounded">.env.local</code> dengan keys Anda</li>
                    <li>Restart server dengan <code className="bg-yellow-100 px-1 py-0.5 rounded">npm run dev</code></li>
                  </ol>
                  <p className="mt-2 font-semibold">
                    📖 Baca file <code className="bg-yellow-100 px-1 py-0.5 rounded">QUICK_START.md</code> untuk panduan lengkap!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6 animate-fade-in">
              <Logo size="lg" />
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up">
              Selamat Datang di{' '}
              <span className="bg-gradient-to-r from-phoenix-blue via-phoenix-accent to-phoenix-darkBlue bg-clip-text text-transparent animate-gradient">
                PHOENIX AI
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 animate-slide-up">
              Platform AI yang membantu Anda bekerja lebih cerdas, lebih cepat, dan lebih kreatif
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link
                href="/signup"
                className="px-8 py-4 bg-phoenix-blue text-white text-lg font-semibold rounded-lg hover:bg-phoenix-darkBlue transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Mulai Gratis
              </Link>
              <Link
                href="/signin"
                className="px-8 py-4 bg-white text-phoenix-blue text-lg font-semibold rounded-lg border-2 border-phoenix-blue hover:bg-phoenix-blue hover:text-white transition"
              >
                Masuk
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-xl text-gray-600">
              Teknologi AI terkini untuk memaksimalkan potensi Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-8 h-8" />,
                title: 'AI Cerdas',
                description: 'Model AI terbaru yang memahami konteks dan memberikan respons yang akurat',
              },
              {
                icon: <MessageSquare className="w-8 h-8" />,
                title: 'Chat Interaktif',
                description: 'Percakapan natural dengan AI yang responsif dan mudah dipahami',
              },
              {
                icon: <Code className="w-8 h-8" />,
                title: 'Coding Assistant',
                description: 'Bantuan coding dengan syntax highlighting dan penjelasan kode',
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Respons Cepat',
                description: 'Dapatkan jawaban instan dengan teknologi processing terkini',
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Aman & Privat',
                description: 'Data Anda terenkripsi dan dilindungi dengan standar keamanan tertinggi',
              },
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: 'Multifungsi',
                description: 'Dari menulis artikel hingga analisis data, semua bisa dilakukan',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl border border-gray-200 hover:border-phoenix-blue hover:shadow-lg transition group"
              >
                <div className="w-14 h-14 bg-phoenix-blue/10 rounded-lg flex items-center justify-center text-phoenix-blue mb-4 group-hover:bg-phoenix-blue group-hover:text-white transition">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-phoenix-blue to-phoenix-darkBlue rounded-2xl p-12 shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-4">
              Siap Meningkatkan Produktivitas?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Bergabunglah dengan ribuan pengguna yang telah merasakan manfaat AI
            </p>
            <Link
              href="/signup"
              className="inline-block px-8 py-4 bg-white text-phoenix-blue text-lg font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg"
            >
              Daftar Sekarang - Gratis!
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
