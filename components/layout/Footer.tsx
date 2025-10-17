import Link from 'next/link'
import Logo from '@/components/ui/Logo'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Logo size="sm" />
              <span className="text-xl font-bold bg-gradient-to-r from-phoenix-blue to-phoenix-darkBlue bg-clip-text text-transparent">
                PHOENIX AI
              </span>
            </div>
            <p className="text-gray-600 text-sm max-w-md">
              Platform AI terdepan yang membantu Anda meningkatkan produktivitas dan kreativitas dengan teknologi kecerdasan buatan terkini.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Produk</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className="text-gray-600 hover:text-phoenix-blue text-sm transition">
                  Fitur
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-600 hover:text-phoenix-blue text-sm transition">
                  Harga
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-phoenix-blue text-sm transition">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Perusahaan</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-phoenix-blue text-sm transition">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-phoenix-blue text-sm transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-phoenix-blue text-sm transition">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            © {currentYear} PHOENIX AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

