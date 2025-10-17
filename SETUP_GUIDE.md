# Panduan Setup PHOENIX AI - Lengkap

## 🚀 Langkah 1: Install Dependencies

Buka terminal di folder PHXAI dan jalankan:

```bash
npm install
```

Tunggu hingga semua package terinstall.

---

## 🗄️ Langkah 2: Setup Supabase (Database & Auth)

### A. Buat Akun Supabase

1. Buka https://supabase.com
2. Klik "Start your project"
3. Sign up dengan GitHub atau email
4. Verifikasi email Anda

### B. Buat Project Baru

1. Di dashboard Supabase, klik "New Project"
2. Isi form:
   - **Name**: phoenix-ai (atau nama lain)
   - **Database Password**: Buat password yang kuat (SIMPAN!)
   - **Region**: Pilih yang terdekat (Southeast Asia untuk Indonesia)
3. Klik "Create new project"
4. Tunggu 2-3 menit hingga project siap

### C. Setup Database Schema

1. Di dashboard project, klik menu **"SQL Editor"** di sidebar kiri
2. Klik "New query"
3. Buka file `lib/db/schema.sql` di project Anda
4. Copy SEMUA isi file tersebut
5. Paste di SQL Editor Supabase
6. Klik "Run" atau tekan Ctrl+Enter
7. Pastikan muncul pesan sukses

### D. Dapatkan API Keys

1. Klik menu **"Settings"** (icon gear di sidebar)
2. Klik **"API"**
3. Copy nilai berikut:
   - **Project URL** (contoh: `https://xxxxx.supabase.co`)
   - **anon public** key (panjang, dimulai dengan `eyJ...`)

---

## 🤖 Langkah 3: Setup Hugging Face (AI Model - GRATIS!)

### A. Buat Akun Hugging Face

1. Buka https://huggingface.co
2. Klik "Sign Up"
3. Daftar dengan email atau GitHub
4. Verifikasi email Anda

### B. Buat Access Token

1. Login ke Hugging Face
2. Klik avatar Anda di kanan atas
3. Pilih "Settings"
4. Klik menu **"Access Tokens"** di sidebar
5. Klik "New token"
6. Isi form:
   - **Name**: phoenix-ai-token
   - **Type**: Pilih **"Read"**
7. Klik "Generate a token"
8. **COPY TOKEN** yang muncul (hanya ditampilkan sekali!)

---

## 🔐 Langkah 4: Setup Environment Variables

### A. Buat File .env.local

1. Di root folder PHXAI, buat file baru bernama `.env.local`
2. Paste konfigurasi berikut:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=paste_project_url_anda_disini
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_anon_key_anda_disini

# Hugging Face Token
HF_TOKEN=paste_token_huggingface_anda_disini

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### B. Ganti dengan Nilai Asli

Ganti placeholder dengan nilai yang sudah Anda copy:

```bash
# Contoh setelah diganti:
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
HF_TOKEN=hf_AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**PENTING**: 
- Jangan ada spasi sebelum/sesudah tanda `=`
- Jangan tambah tanda kutip
- Pastikan tidak ada baris kosong di awal file

---

## ▶️ Langkah 5: Jalankan Aplikasi

Jalankan development server:

```bash
npm run dev
```

Tunggu hingga muncul pesan:
```
✓ Ready in X.Xs
○ Local:   http://localhost:3000
```

Buka browser dan akses: **http://localhost:3000**

---

## ✅ Langkah 6: Testing

### A. Test Landing Page
1. Buka http://localhost:3000
2. Pastikan landing page muncul dengan logo PHOENIX AI
3. Check navbar dan footer

### B. Test Sign Up
1. Klik "Daftar Gratis" atau "Daftar di sini"
2. Isi form:
   - Nama Lengkap
   - Email (gunakan email asli)
   - Password (minimal 6 karakter)
   - Konfirmasi Password
3. Klik "Daftar"
4. Check email Anda untuk verifikasi (jika perlu)

### C. Test Sign In
1. Klik "Masuk"
2. Masukkan email dan password
3. Klik "Masuk"
4. Anda akan diredirect ke Dashboard

### D. Test AI Chat
1. Di Dashboard, klik "Chat Baru"
2. Ketik pesan: "Halo, siapa kamu?"
3. Tekan Enter atau klik tombol kirim
4. Tunggu respon dari AI
5. Test beberapa pertanyaan lain

---

## 🔧 Troubleshooting

### Error: "Module not found"
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules
npm install
```

### Error: "Invalid Supabase URL"
- Check file `.env.local` ada di root folder
- Pastikan URL dimulai dengan `https://`
- Restart development server (Ctrl+C, lalu `npm run dev`)

### Error: "Unauthorized" saat chat
- Pastikan HF_TOKEN sudah benar
- Check token masih aktif di Hugging Face Settings
- Restart development server

### Database Error
- Pastikan SQL schema sudah dijalankan
- Check di Supabase > Database > Tables, harus ada:
  - chat_sessions
  - messages
  - user_profiles

### AI tidak merespons
- Check HF_TOKEN di `.env.local`
- Buka browser Console (F12) untuk lihat error
- Check koneksi internet

---

## 📱 Fitur yang Bisa Dicoba

1. **Multi-session Chat**: Buat beberapa chat berbeda
2. **Markdown Support**: Kirim pesan dengan format markdown
3. **Code Generation**: Minta AI untuk membuat kode
4. **Riwayat Chat**: Semua chat tersimpan otomatis
5. **Responsive Design**: Buka di HP/tablet

---

## 🎨 Customisasi (Opsional)

### Ganti Warna
Edit file `tailwind.config.ts`:
```typescript
phoenix: {
  blue: '#4A90E2',        // Warna utama
  darkBlue: '#2E5C8A',    // Warna gelap
  lightBlue: '#A8D0F0',   // Warna terang
  accent: '#6CB4EE',      // Warna aksen
}
```

### Ganti Model AI
Edit file `app/api/chat/route.ts`:
```typescript
model: 'deepseek-ai/DeepSeek-R1-0528:novita',
// Ganti dengan model lain dari Hugging Face
```

Model alternatif yang bisa dicoba:
- `meta-llama/Llama-3.3-70B-Instruct`
- `mistralai/Mixtral-8x7B-Instruct-v0.1`
- `google/gemma-2-27b-it`

---

## 🚀 Deploy ke Production

### Deploy ke Vercel (Gratis)

1. Push code ke GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin your-github-repo-url
git push -u origin main
```

2. Buka https://vercel.com
3. Import project dari GitHub
4. Tambahkan Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `HF_TOKEN`
   - `NEXT_PUBLIC_APP_URL` (ganti dengan URL Vercel Anda)
5. Deploy!

---

## 📞 Butuh Bantuan?

Jika ada error atau pertanyaan:
1. Check console browser (F12)
2. Check terminal untuk error message
3. Pastikan semua langkah sudah diikuti
4. Google error message untuk solusi

---

## 🎉 Selamat!

Website PHOENIX AI Anda sekarang sudah berjalan! 

Fitur yang sudah jalan:
- ✅ Authentication (Sign In/Up)
- ✅ AI Chat dengan DeepSeek-R1
- ✅ Riwayat chat tersimpan
- ✅ Desain modern dan responsive
- ✅ 100% GRATIS (Supabase + Hugging Face)

Selamat berkreasi! 🚀

