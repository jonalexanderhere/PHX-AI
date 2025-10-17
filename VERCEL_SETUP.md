# 🚀 Vercel Deployment Guide - PHX-AI

## ⚠️ PENTING: Environment Variables di Vercel

Vercel **TIDAK** membaca file `.env.local`! Anda harus set environment variables di Vercel Dashboard.

---

## 📋 Step-by-Step Deployment

### 1️⃣ Push Code ke GitHub

```bash
git add -A
git commit -m "Ready for Vercel deployment"
git push origin main
```

✅ **DONE** - Code sudah di GitHub

---

### 2️⃣ Import Project ke Vercel

1. Go to: https://vercel.com/new
2. Import your repository: `jonalexanderhere/PHX-AI`
3. **JANGAN deploy dulu!** Klik "Configure Project"

---

### 3️⃣ Set Environment Variables di Vercel

**CRITICAL:** Add these environment variables in Vercel Dashboard:

#### A. Hugging Face Token
```
Name: HF_TOKEN
Value: (Copy from your .env.local file - starts with hf_)
Environment: Production, Preview, Development
```

#### B. Supabase URL
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: (Copy from your .env.local file - your Supabase project URL)
Environment: Production, Preview, Development
```

#### C. Supabase Anon Key
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: (Copy from your .env.local file - your Supabase anon key)
Environment: Production, Preview, Development
```

#### D. Supabase Service Role Key (Optional)
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: (Copy from your .env.local file - your Supabase service role key)
Environment: Production, Preview, Development
```

---

### 4️⃣ How to Add Environment Variables in Vercel

**Visual Guide:**

1. **Vercel Dashboard** → Your Project
2. Click **"Settings"** tab
3. Click **"Environment Variables"** in sidebar
4. For each variable:
   - Enter **Name** (e.g., `HF_TOKEN`)
   - Enter **Value** (your token)
   - Select **All environments** (Production, Preview, Development)
   - Click **"Add"**

**Screenshot guide:**
```
┌─────────────────────────────────────────┐
│ Environment Variables                   │
├─────────────────────────────────────────┤
│                                         │
│ Name:  [HF_TOKEN                    ]  │
│                                         │
│ Value: [hf_BdlGtYLvyOQd...          ]  │
│                                         │
│ Environments:                           │
│ ☑ Production                            │
│ ☑ Preview                               │
│ ☑ Development                           │
│                                         │
│           [Add]  [Cancel]               │
└─────────────────────────────────────────┘
```

---

### 5️⃣ Deploy!

After adding ALL environment variables:

1. Click **"Deploy"** button
2. Wait for build to complete (~2-3 minutes)
3. Visit your deployment URL

---

## 🔍 Verify Environment Variables

### In Vercel Dashboard

**Settings → Environment Variables**

You should see:
```
✅ HF_TOKEN                          Production, Preview, Development
✅ NEXT_PUBLIC_SUPABASE_URL         Production, Preview, Development
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY    Production, Preview, Development
✅ SUPABASE_SERVICE_ROLE_KEY        Production, Preview, Development
```

### Test After Deployment

1. Open your Vercel URL
2. Sign up / Sign in
3. Send a test message
4. Check if AI responds

**If 503 error:**
1. Go to Vercel Dashboard
2. Your Project → **Deployments**
3. Click latest deployment
4. Click **"View Function Logs"**
5. Look for errors in `/api/chat`

---

## 🐛 Debugging on Vercel

### View Runtime Logs

1. Vercel Dashboard → Your Project
2. Click **"Deployments"** tab
3. Click your latest deployment
4. Click **"Functions"** tab
5. Click **"View Function Logs"** for `/api/chat`

**Look for:**
```
✅ GOOD:
=== Environment Check ===
HF_TOKEN exists: true
HF_TOKEN length: 45
✅ HF_TOKEN loaded successfully

❌ BAD:
HF_TOKEN exists: false
❌ HF_TOKEN is NOT configured
```

### If Still 503

**Check 1: Environment Variables Set?**
- Settings → Environment Variables
- All 4 variables present?
- Applied to all environments?

**Check 2: Redeploy**
```bash
# Trigger new deployment
git commit --allow-empty -m "Trigger Vercel redeploy"
git push origin main
```

**Check 3: Function Timeout**
- Vercel free tier: 10s timeout
- DeepSeek might take longer
- Upgrade to Pro if needed

---

## ⚙️ Vercel-Specific Configuration

### vercel.json (Optional)

Create `vercel.json` in root:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "regions": ["sin1"]
}
```

**Benefits:**
- Increase function timeout to 30s
- Deploy to Singapore region (faster for Asia)

---

## 🔐 Security Best Practices

### Supabase RLS Policies

Ensure these are enabled in Supabase:

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Should show rowsecurity = true for all tables
```

### Environment Variables

- ✅ `NEXT_PUBLIC_*` = Client-side (safe to expose)
- ⚠️ `HF_TOKEN` = Server-only (never expose)
- ⚠️ `SUPABASE_SERVICE_ROLE_KEY` = Server-only (never expose)

---

## 📊 Vercel Limits (Free Tier)

```
✅ Bandwidth: 100 GB/month
✅ Build time: Unlimited
✅ Function execution: 100 GB-hours
⚠️ Function timeout: 10 seconds
⚠️ Edge Functions: Not available
```

**For PHX-AI:**
- Most requests < 10s ✅
- DeepSeek might timeout occasionally ⚠️
- Consider Vercel Pro if needed

---

## 🚀 Post-Deployment Checklist

```
□ All environment variables added in Vercel
□ Deployment successful (green checkmark)
□ Can access homepage
□ Can sign up new user
□ Can sign in
□ Dashboard loads
□ Can create new chat
□ Can send message
□ AI responds (not 503)
□ Messages save to database
□ Can see chat history
□ Sidebar works
□ Markdown renders
□ LaTeX math works
□ Code blocks with syntax highlighting
```

---

## 📝 Common Vercel Errors

### Error: "HF_TOKEN is not defined"

**Fix:**
1. Vercel Dashboard → Settings → Environment Variables
2. Add `HF_TOKEN` with your token
3. Apply to all environments
4. Redeploy

### Error: "Failed to connect to Supabase"

**Fix:**
1. Check `NEXT_PUBLIC_SUPABASE_URL`
2. Check `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Both should be in Vercel env vars
4. Both should have `NEXT_PUBLIC_` prefix

### Error: "Function exceeded timeout"

**Options:**
1. Upgrade to Vercel Pro ($20/mo)
2. Or optimize AI requests
3. Or use different AI provider

### Error: "Build failed"

**Check:**
1. Deployment logs in Vercel
2. Look for TypeScript errors
3. Fix in code and push again

---

## 🔄 Update Environment Variables

**After changing env vars in Vercel:**

1. Settings → Environment Variables
2. Edit the variable
3. **MUST redeploy** for changes to take effect

**Trigger redeploy:**
```bash
git commit --allow-empty -m "Update environment variables"
git push origin main
```

Or click **"Redeploy"** button in Vercel Dashboard.

---

## 🎯 Quick Troubleshooting

### Test Environment Variables Loaded

Add this to `app/api/test/route.ts`:

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hfTokenExists: !!process.env.HF_TOKEN,
    hfTokenLength: process.env.HF_TOKEN?.length || 0,
    supabaseUrlExists: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    nodeEnv: process.env.NODE_ENV,
  })
}
```

Visit: `https://your-app.vercel.app/api/test`

Expected:
```json
{
  "hfTokenExists": true,
  "hfTokenLength": 45,
  "supabaseUrlExists": true,
  "nodeEnv": "production"
}
```

---

## ✅ Success!

Your PHX-AI should now be live on Vercel!

**Share your app:**
- URL: `https://phx-ai.vercel.app` (or your custom domain)
- Users can sign up and chat with AI
- Full memory and chat history
- Beautiful modern UI

---

## 📞 Still Having Issues?

### Check in order:

1. ✅ Environment variables set in Vercel Dashboard?
2. ✅ All 4 variables present?
3. ✅ Applied to all environments?
4. ✅ Redeployed after adding env vars?
5. ✅ Function logs show HF_TOKEN loaded?
6. ✅ Supabase tables created?
7. ✅ RLS policies enabled?

### Get Function Logs:

1. Vercel Dashboard
2. Deployments → Latest
3. Functions → /api/chat
4. View Logs

**Copy logs and check for errors.**

---

**Deployment complete! 🚀**

