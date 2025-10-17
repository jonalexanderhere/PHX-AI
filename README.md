# 🔥 PHOENIX AI

> **AI Chat Platform dengan DeepSeek-R1** - Platform AI modern yang dibangun dengan Next.js, TypeScript, Tailwind CSS, dan Supabase.

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Fitur Utama

- 🤖 **AI Chat dengan DeepSeek-R1** - Model AI terbaru via Hugging Face
- 💬 **Text-Only Chat** - Focus pada percakapan teks berkualitas
- 🔐 **Autentikasi Lengkap** - Sign Up/Sign In dengan Supabase Auth
- 💾 **Database Persistent** - Semua chat history tersimpan
- 🎨 **UI Modern & Clean** - Desain minimalis dengan aksen biru
- 📱 **Fully Responsive** - Sempurna di semua perangkat
- 🚀 **Fast & Lightweight** - Next.js 14 dengan App Router
- 🔒 **Row Level Security** - Data user terlindungi dengan RLS
- 📝 **Markdown Support** - Render markdown di AI responses
- 💻 **Code Highlighting** - Syntax highlighting untuk code blocks

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/jonalexanderhere/PHX-AI.git
cd PHX-AI
npm install
```

### 2. Setup Environment

Copy `.env.local.example` ke `.env.local` dan isi dengan credentials Anda:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
HF_TOKEN=your_huggingface_token
```

**Cara mendapatkan credentials:**

1. **Supabase** (Database & Auth):
   - Buat akun di [Supabase](https://supabase.com)
   - Create new project
   - Get URL & Keys: Settings > API
   - Run SQL schema: `lib/db/schema.sql` via SQL Editor

2. **Hugging Face** (AI Model - GRATIS):
   - Buat akun di [Hugging Face](https://huggingface.co)
   - Get token: https://huggingface.co/settings/tokens
   - Create token dengan type "Read"

### 3. Verify Setup

```bash
npm run setup
```

Output harus menunjukkan semua ✅:
```
✅ All environment variables configured
✅ Database tables exist and accessible
✅ Authentication system ready
🚀 Application Status: READY
```

### 4. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### 5. Test Application

1. Sign up dengan email Anda
2. Create new chat session
3. Start chatting dengan AI!

---

## 📋 NPM Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run setup            # Test all connections
npm run db:check         # Check database tables
npm run test:connection  # Test Supabase & HF connections
```

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

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth |
| **AI Model** | DeepSeek-R1-0528 via Hugging Face Inference API |
| **State Management** | Zustand |
| **Icons** | Lucide React |
| **Markdown** | react-markdown |
| **Code Highlighting** | react-syntax-highlighter |
| **Animation** | Framer Motion |

## ⚠️ Important Notes

### Text-Only Chat
This application is designed for **text-only conversations**. It does NOT support:
- ❌ File uploads (images, documents, PDFs)
- ❌ Voice input/output
- ❌ Image generation
- ❌ Multi-modal features

This is intentional to keep the app focused, fast, and simple.

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

