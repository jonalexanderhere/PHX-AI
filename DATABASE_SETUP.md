# 🗄️ Database Setup - PHX-AI

## ✅ Langkah Setup Database Supabase

### 1. Akses Supabase Dashboard
1. Buka https://supabase.com/dashboard
2. Login dengan akun Anda
3. Pilih project: `hsdruiqwpzgjwdazyzbn`

### 2. Jalankan SQL Schema
1. Klik **SQL Editor** di sidebar kiri
2. Klik **+ New query** untuk membuat query baru
3. Buka file `lib/db/schema.sql` di project ini
4. **Copy SEMUA isi file** (Ctrl+A, Ctrl+C)
5. **Paste** di SQL Editor Supabase
6. Klik tombol **RUN** atau tekan **Ctrl+Enter**
7. Tunggu hingga selesai (akan muncul "Success. No rows returned")

### 3. Verifikasi Tables
Setelah schema berhasil dijalankan, verifikasi bahwa tables sudah dibuat:

1. Klik **Table Editor** di sidebar
2. Pastikan ada 3 tables:
   - ✅ `chat_sessions` - Menyimpan session chat user
   - ✅ `messages` - Menyimpan pesan chat
   - ✅ `user_profiles` - Menyimpan profil user

### 4. Test Authentication
1. Klik **Authentication** di sidebar
2. Pastikan **Email Auth** sudah enabled
3. Test dengan sign up di aplikasi

---

## 📊 Schema Overview

### Table: `chat_sessions`
Menyimpan sesi chat untuk setiap user.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key ke auth.users |
| title | TEXT | Judul chat session |
| created_at | TIMESTAMP | Waktu dibuat |
| updated_at | TIMESTAMP | Waktu terakhir diupdate |

### Table: `messages`
Menyimpan semua pesan dalam chat.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| session_id | UUID | Foreign key ke chat_sessions |
| role | TEXT | 'user', 'assistant', atau 'system' |
| content | TEXT | Isi pesan |
| created_at | TIMESTAMP | Waktu dibuat |

### Table: `user_profiles`
Menyimpan informasi tambahan user.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key, foreign key ke auth.users |
| full_name | TEXT | Nama lengkap user |
| avatar_url | TEXT | URL avatar user |
| created_at | TIMESTAMP | Waktu dibuat |
| updated_at | TIMESTAMP | Waktu terakhir diupdate |

---

## 🔒 Row Level Security (RLS)

Database sudah dikonfigurasi dengan RLS untuk keamanan:

- ✅ User hanya bisa melihat chat sessions mereka sendiri
- ✅ User hanya bisa membuat/edit/hapus chat sessions mereka sendiri
- ✅ User hanya bisa melihat messages dari sessions mereka
- ✅ User hanya bisa membuat messages di sessions mereka
- ✅ User hanya bisa melihat/edit profile mereka sendiri

---

## 🔧 Troubleshooting

### Error: "relation does not exist"
**Solusi:** Schema belum dijalankan. Ulangi langkah 2.

### Error: "permission denied"
**Solusi:** RLS policies belum dibuat dengan benar. Jalankan ulang schema lengkap.

### Error: "user_profiles insert failed"
**Solusi:** Trigger `on_auth_user_created` belum dibuat. Jalankan ulang schema.

---

## 📝 Notes

- Database sudah otomatis membuat user profile saat user sign up
- Timestamps (created_at, updated_at) otomatis dikelola oleh triggers
- Chat sessions otomatis dihapus saat user dihapus (CASCADE)
- Messages otomatis dihapus saat chat session dihapus (CASCADE)

---

## ✅ Ready!

Setelah schema berhasil dijalankan, aplikasi siap digunakan untuk:
- ✅ User sign up / sign in
- ✅ Membuat chat sessions
- ✅ Mengirim dan menerima messages
- ✅ Chat dengan AI DeepSeek-R1
- ✅ Menyimpan riwayat chat

**Note:** Aplikasi saat ini **HANYA SUPPORT TEXT CHAT**. Tidak ada fitur upload foto, dokumen, atau file lainnya.

