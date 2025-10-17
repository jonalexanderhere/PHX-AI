'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from '@/components/ui/Logo'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/dashboard', label: 'Dashboard' },
  ]

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <Logo size="sm" />
            <span className="text-xl font-bold bg-gradient-to-r from-phoenix-blue to-phoenix-darkBlue bg-clip-text text-transparent">
              PHOENIX AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition ${
                  pathname === link.href
                    ? 'text-phoenix-blue'
                    : 'text-gray-700 hover:text-phoenix-blue'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/signin"
              className="text-sm font-medium text-gray-700 hover:text-phoenix-blue transition"
            >
              Masuk
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-phoenix-blue text-white text-sm font-medium rounded-lg hover:bg-phoenix-darkBlue transition"
            >
              Daftar Gratis
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium transition ${
                  pathname === link.href
                    ? 'bg-phoenix-blue/10 text-phoenix-blue'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              <Link
                href="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100 transition"
              >
                Masuk
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 bg-phoenix-blue text-white text-base font-medium rounded-lg text-center hover:bg-phoenix-darkBlue transition"
              >
                Daftar Gratis
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

