# PHOENIX AI

Platform AI modern yang dibangun dengan Next.js, TypeScript, Tailwind CSS, dan Supabase.

## Fitur

- ✨ AI Chat Interface dengan UI modern
- 🔐 Autentikasi lengkap (Sign In/Sign Up) dengan Supabase
- 💬 Riwayat percakapan tersimpan
- 🎨 Desain putih dengan aksen biru yang nyaman di mata
- 📱 Responsive untuk semua perangkat
- 🚀 Integrasi dengan OpenAI atau Groq API
- 💾 Database dengan Supabase (PostgreSQL)
- 🔒 Row Level Security (RLS) untuk keamanan data

## Setup & Instalasi

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Supabase

1. Buat akun di [Supabase](https://supabase.com)
2. Buat project baru
3. Jalankan SQL schema di Supabase SQL Editor:
   - Buka file `lib/db/schema.sql`
   - Copy semua isi file
   - Paste dan jalankan di Supabase SQL Editor
4. Enable Google OAuth Provider (opsional):
   - Pergi ke Authentication > Providers
   - Enable Google provider
   - Masukkan Client ID dan Secret dari Google Cloud Console

### 3. Setup Environment Variables

Buat file `.env.local` di root folder:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Hugging Face Token (Gratis!)
HF_TOKEN=your_huggingface_token

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Cara mendapatkan keys:**

- **Supabase**: Settings > API > Project URL dan anon key
- **Hugging Face Token** (GRATIS): 
  1. Buat akun di https://huggingface.co
  2. Pergi ke https://huggingface.co/settings/tokens
  3. Buat token baru dengan tipe "Read"
  4. Copy token tersebut

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Struktur Folder

```
PHXAI/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── chat/            # Chat endpoint
│   │   └── sessions/        # Session management
│   ├── auth/                # Auth callback
│   ├── dashboard/           # Dashboard page
│   ├── signin/              # Sign in page
│   ├── signup/              # Sign up page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   └── globals.css          # Global styles
├── components/              # React Components
│   ├── auth/                # Auth components
│   ├── dashboard/           # Dashboard components
│   ├── layout/              # Layout components
│   └── ui/                  # UI components
├── lib/                     # Libraries & Utilities
│   ├── db/                  # Database schema
│   ├── store/               # Zustand stores
│   ├── supabase/            # Supabase clients
│   └── utils/               # Utility functions
├── .env.local               # Environment variables (buat sendiri)
├── next.config.js           # Next.js config
├── tailwind.config.ts       # Tailwind config
└── package.json             # Dependencies
```

## Teknologi yang Digunakan

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI API**: Hugging Face (DeepSeek-R1 Model) - GRATIS!
- **State Management**: Zustand
- **UI Components**: Custom dengan Lucide Icons
- **Markdown**: react-markdown
- **Code Highlighting**: react-syntax-highlighter

## Deployment

### Deploy ke Vercel

1. Push code ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Tambahkan environment variables
4. Deploy

### Deploy ke Platform Lain

Pastikan mengatur environment variables sesuai dengan file `.env.local`.

## Fitur Keamanan

- Row Level Security (RLS) di Supabase
- Autentikasi dengan Supabase Auth
- Protected routes dengan middleware
- Session management
- Secure API endpoints

## Troubleshooting

### Error: "Invalid API Key"
- Pastikan API key sudah benar di `.env.local`
- Restart development server setelah menambah env variables

### Error: "User not authenticated"
- Clear browser cache dan cookies
- Sign out dan sign in kembali

### Database Error
- Pastikan SQL schema sudah dijalankan di Supabase
- Check RLS policies sudah aktif

## Support

Jika ada masalah atau pertanyaan, silakan buat issue di repository ini.

## License

MIT License - bebas digunakan untuk personal dan komersial.

