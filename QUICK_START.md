# 🚀 Quick Start - PHOENIX AI

## Error: "NEXT_PUBLIC_SUPABASE_URL env variables required"?

Ikuti langkah ini untuk mengatasi error tersebut:

## ✅ Langkah 1: Setup Supabase (5 menit)

### A. Buat Akun Supabase
1. Buka https://supabase.com
2. Klik "Start your project"
3. Sign up dengan GitHub (paling mudah)

### B. Buat Project
1. Klik "New Project"
2. Pilih organization atau buat baru
3. Isi:
   - **Name**: `phoenix-ai`
   - **Database Password**: Buat password kuat (simpan!)
   - **Region**: `Southeast Asia (Singapore)` untuk pengguna Indonesia
4. Klik "Create new project"
5. **Tunggu 2-3 menit** hingga project siap

### C. Ambil API Keys
1. Setelah project siap, di dashboard project
2. Klik icon **Settings** (gear) di sidebar kiri bawah
3. Klik **API** di menu Settings
4. Copy 2 nilai ini:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public key: eyJhbGc... (panjang sekali)
```

### D. Setup Database
1. Klik **SQL Editor** di sidebar kiri
2. Klik "+ New query"
3. Buka file `lib/db/schema.sql` di VS Code
4. Copy SEMUA isinya (Ctrl+A, Ctrl+C)
5. Paste di SQL Editor Supabase
6. Klik **Run** atau tekan Ctrl+Enter
7. Tunggu hingga selesai (muncul "Success")

---

## ✅ Langkah 2: Setup Hugging Face (2 menit)

### A. Buat Akun
1. Buka https://huggingface.co
2. Klik "Sign Up"
3. Daftar dengan email atau GitHub

### B. Buat Token
1. Setelah login, klik avatar Anda (kanan atas)
2. Pilih **Settings**
3. Klik **Access Tokens** di sidebar
4. Klik **"New token"**
5. Isi:
   - **Name**: `phoenix-ai`
   - **Type**: **Read** (penting!)
6. Klik **Generate a token**
7. **COPY token** yang muncul (contoh: `hf_xxxxx...`)

---

## ✅ Langkah 3: Konfigurasi Project (1 menit)

### A. Edit File .env.local

1. Buka file `.env.local` di root folder project
2. Ganti nilai placeholder dengan nilai asli Anda:

```bash
# Ganti nilai ini dengan yang Anda copy dari Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...

# Ganti dengan token dari Hugging Face
HF_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxx

# Ini biarkan apa adanya
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**PENTING:**
- Tidak ada spasi sebelum/sesudah `=`
- Tidak perlu tanda kutip
- Copy paste langsung nilai yang asli

### B. Save File
- Tekan **Ctrl+S** untuk save
- Pastikan file tersimpan

---

## ✅ Langkah 4: Restart Server

**PENTING**: Setiap kali edit `.env.local`, HARUS restart server!

1. Di terminal, tekan **Ctrl+C** untuk stop server
2. Jalankan lagi:
```bash
npm run dev
```

3. Tunggu hingga muncul:
```
✓ Ready in X.Xs
○ Local: http://localhost:3000
```

4. Buka browser: http://localhost:3000

---

## ✅ Langkah 5: Test!

### Test 1: Landing Page
- Buka http://localhost:3000
- Harus muncul halaman dengan logo PHOENIX AI
- ✅ Berhasil!

### Test 2: Sign Up
1. Klik "Daftar Gratis"
2. Isi form dengan email ASLI Anda
3. Password minimal 6 karakter
4. Klik "Daftar"
5. ✅ Jika muncul dashboard atau pesan sukses, berhasil!

### Test 3: Chat dengan AI
1. Di dashboard, klik "Chat Baru"
2. Ketik: "Halo, siapa kamu?"
3. Tekan Enter
4. ✅ Tunggu beberapa detik, AI akan menjawab!

---

## 🔧 Masih Error?

### Error: "Invalid Supabase URL"
```bash
# Check file .env.local:
# 1. Pastikan ada di root folder (sejajar dengan package.json)
# 2. Pastikan nama file TEPAT: .env.local (bukan .env atau .env.txt)
# 3. Pastikan URL dimulai dengan https://
# 4. RESTART server setelah edit
```

### Error: "Failed to fetch" saat chat
```bash
# Check HF_TOKEN:
# 1. Buka https://huggingface.co/settings/tokens
# 2. Pastikan token masih aktif
# 3. Pastikan type token adalah "Read"
# 4. Copy ulang token dan paste di .env.local
# 5. RESTART server
```

### Error: "Database error"
```bash
# Check database schema:
# 1. Buka Supabase > SQL Editor
# 2. Jalankan ulang schema dari lib/db/schema.sql
# 3. Check di Database > Tables, harus ada:
#    - chat_sessions
#    - messages  
#    - user_profiles
```

### Error: Port 3000 sudah digunakan
```bash
# Gunakan port lain:
npm run dev -- -p 3001

# Atau kill process di port 3000:
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill
```

---

## 📋 Checklist

Pastikan semua ini sudah dilakukan:

- [ ] Supabase project sudah dibuat
- [ ] SQL schema sudah dijalankan
- [ ] Hugging Face token sudah dibuat
- [ ] File `.env.local` sudah diedit dengan nilai asli
- [ ] Server sudah di-restart setelah edit `.env.local`
- [ ] Bisa akses http://localhost:3000
- [ ] Bisa sign up dengan email
- [ ] Bisa masuk ke dashboard
- [ ] AI bisa merespons chat

---

## 🎉 Sukses!

Jika semua checklist ✅, selamat! Website PHOENIX AI Anda sudah berjalan!

### Apa yang bisa dilakukan sekarang:

1. **Chat dengan AI** - Coba berbagai pertanyaan
2. **Multi-chat** - Buat beberapa sesi chat berbeda
3. **Test fitur** - Coba markdown, code generation, dll
4. **Customize** - Edit warna, model AI, dll (lihat README.md)

---

## 🚀 Next Steps

1. **Baca README.md** untuk dokumentasi lengkap
2. **Baca SETUP_GUIDE.md** untuk panduan detail
3. **Deploy ke Vercel** untuk production (gratis!)

Selamat berkreasi! 🎊

