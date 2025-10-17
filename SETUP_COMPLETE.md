# ✅ PHX-AI Setup Complete Guide

## 🎉 Current Status

### ✅ What's Already Done:

1. **Database Connection** ✅
   - Supabase project connected
   - Tables created: `chat_sessions`, `messages`, `user_profiles`
   - Row Level Security (RLS) enabled
   - Authentication configured

2. **Application Code** ✅
   - Next.js 14 with App Router
   - Supabase Auth integration
   - Hugging Face Inference Client integrated
   - DeepSeek-R1-0528 model configured
   - Text-only chat interface (no file upload)

3. **Environment Setup** ✅
   - `.env.local` created with Supabase credentials
   - Database credentials configured
   - Service role key set

### ⚠️ What You Need to Do:

**Only 1 Thing:** Add your Hugging Face Token

1. Go to: https://huggingface.co/settings/tokens
2. Create a new token (type: Read)
3. Copy the token (starts with `hf_...`)
4. Open `.env.local` and replace:
   ```
   HF_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   with your actual token

---

## 🚀 Quick Start Commands

```bash
# Test all connections
npm run setup

# Check database tables
npm run db:check

# Start development server
npm run dev
```

---

## 📊 Verification

Run this command to verify everything is working:

```bash
npm run setup
```

Expected output:
```
✅ All environment variables configured
✅ Database tables exist and accessible
✅ Authentication system ready
```

---

## 🎯 Usage

1. **Start the app:**
   ```bash
   npm run dev
   ```

2. **Open browser:**
   http://localhost:3000

3. **Sign Up:**
   - Click "Daftar Gratis"
   - Enter email and password
   - Verify email (check Supabase Auth logs)

4. **Start Chatting:**
   - Click "Chat Baru"
   - Type your message
   - AI will respond using DeepSeek-R1

---

## 🔧 Features

### ✅ Available Now:
- User authentication (Sign Up / Sign In)
- Multiple chat sessions
- Chat history saved in database
- AI responses using DeepSeek-R1
- Markdown rendering in responses
- Code syntax highlighting
- Indonesian language support

### ❌ Not Available (By Design):
- File upload (photo, doc, pdf, etc.)
- Image generation
- Voice input/output
- Multi-modal features

---

## 📁 Project Structure

```
PHX-AI/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # AI chat endpoint (DeepSeek-R1)
│   │   └── sessions/route.ts      # Session management
│   ├── dashboard/page.tsx         # Main chat interface
│   ├── signin/page.tsx            # Sign in page
│   └── signup/page.tsx            # Sign up page
├── components/
│   ├── auth/                      # Auth components
│   └── dashboard/
│       ├── ChatArea.tsx           # Chat display
│       ├── ChatInput.tsx          # Text input (no upload)
│       └── ChatMessage.tsx        # Message rendering
├── lib/
│   ├── db/schema.sql              # Database schema
│   ├── supabase/                  # Supabase clients
│   └── store/                     # State management (Zustand)
├── scripts/
│   ├── setup-database.js          # DB check script
│   └── test-connection.js         # Connection test
└── .env.local                     # Environment variables
```

---

## 🔐 Security Features

- Row Level Security (RLS) enabled
- Users can only access their own data
- Authentication required for all API routes
- Service role key for admin operations only

---

## 🐛 Troubleshooting

### Issue: "HF_TOKEN missing"
**Solution:** Add your Hugging Face token to `.env.local`

### Issue: "Authentication failed"
**Solution:** 
1. Check Supabase dashboard > Authentication
2. Ensure Email provider is enabled
3. Check if email confirmation is required

### Issue: "No response from AI"
**Solution:**
1. Verify HF_TOKEN is valid
2. Check browser console for errors
3. Ensure internet connection is stable

### Issue: "Database connection failed"
**Solution:**
1. Run `npm run db:check`
2. Verify Supabase credentials in `.env.local`
3. Check Supabase project is active

---

## 📝 Environment Variables

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
HF_TOKEN=hf_xxxxx

# Optional
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

---

## 🎓 How It Works

1. **User Signs Up** → Supabase Auth creates user → Trigger creates user_profile
2. **User Creates Chat** → New chat_session record created
3. **User Sends Message** → 
   - Message saved to database
   - Sent to Hugging Face API (DeepSeek-R1)
   - AI response received
   - Response saved to database
   - Displayed to user

---

## 🚢 Deployment

### Deploy to Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel Dashboard
# Same as .env.local
```

### Requirements:
- Add all environment variables
- Ensure Supabase URL is accessible from production
- HF_TOKEN must be valid

---

## 📞 Support

If you encounter issues:
1. Run `npm run setup` to check status
2. Check browser console for errors
3. Check Supabase logs in Dashboard
4. Review `DATABASE_SETUP.md` for database issues

---

## ✨ Next Steps

After setup is complete:
1. Customize branding (colors, logo)
2. Add more AI models
3. Enhance UI/UX
4. Add analytics
5. Deploy to production

---

**🎉 You're ready to go! Just add your HF_TOKEN and start chatting!**

