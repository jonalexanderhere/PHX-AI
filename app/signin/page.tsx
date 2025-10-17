import SignInForm from '@/components/auth/SignInForm'
import Logo from '@/components/ui/Logo'
import Link from 'next/link'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-white flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <SignInForm />
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-phoenix-blue to-phoenix-darkBlue items-center justify-center p-12">
        <div className="max-w-md text-center">
          <Logo size="lg" className="mx-auto mb-8 opacity-90" />
          <h1 className="text-4xl font-bold text-white mb-4">PHOENIX AI</h1>
          <p className="text-xl text-blue-100 mb-8">
            Asisten AI yang memahami kebutuhan Anda
          </p>
          <div className="space-y-4 text-left">
            {[
              'Akses AI terkini tanpa batas',
              'Sinkronisasi di semua perangkat',
              'Riwayat percakapan tersimpan aman',
              'Dukungan pelanggan 24/7',
            ].map((feature, index) => (
              <div key={index} className="flex items-center text-white">
                <svg
                  className="w-6 h-6 mr-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Back to Home Link */}
      <Link
        href="/"
        className="absolute top-4 left-4 flex items-center text-gray-600 hover:text-phoenix-blue transition"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Kembali ke Beranda
      </Link>
    </div>
  )
}

