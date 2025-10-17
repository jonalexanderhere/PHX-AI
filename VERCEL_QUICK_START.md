# ⚡ Quick Start - Deploy PHX-AI ke Vercel

## 🎯 Step-by-Step (5 Menit!)

### 1. Import Project ke Vercel

1. Buka: **https://vercel.com/new**
2. Login dengan GitHub
3. Import repository: **PHX-AI**
4. **JANGAN klik Deploy dulu!**

---

### 2. Set Environment Variables

**Settings → Environment Variables**

Add 4 variables berikut (copy dari `.env.local` Anda):

| Variable Name | Value | Environments |
|--------------|--------|--------------|
| `HF_TOKEN` | `hf_YourToken...` | All (Production, Preview, Development) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` | All |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` | All |

**How to add:**
- Click "Add New"
- Paste Name
- Paste Value
- Select ALL checkboxes (Production, Preview, Development)
- Click "Add"
- Repeat untuk semua 4 variables

---

### 3. Deploy!

Click **"Deploy"** button

Wait ~2-3 minutes untuk build selesai.

---

### 4. Test Deployment

#### A. Test Environment Variables
Visit: `https://your-app.vercel.app/api/test`

Expected response:
```json
{
  "hfToken": {
    "exists": true,
    "length": 45,
    "prefix": "hf_"
  },
  "supabase": {
    "urlExists": true,
    "anonKeyExists": true,
    "serviceRoleExists": true
  },
  "environment": "production"
}
```

#### B. Test Full App
1. Visit: `https://your-app.vercel.app`
2. Click "Daftar Gratis"
3. Sign up dengan email
4. Create new chat
5. Send message: "Hello!"
6. AI should respond ✅

---

## 🚨 Troubleshooting

### Error 503 - AI Not Configured

**Fix:**
1. Go to Vercel Dashboard
2. Your Project → Settings → Environment Variables
3. Check `HF_TOKEN` exists
4. Value should start with `hf_`
5. Applied to all environments? ✅
6. If not, add it
7. Go to Deployments → Click "..." → Redeploy

### Error 401 - Unauthorized

**Fix:**
1. Check Supabase credentials in Vercel env vars
2. Make sure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
3. Redeploy

### Function Timeout

**Vercel Free Plan:**
- Max timeout: 10 seconds
- DeepSeek sometimes takes 15-20 seconds

**Options:**
1. Upgrade to Vercel Pro ($20/mo) - 60s timeout
2. Or accept occasional timeouts

---

## 📊 View Logs

**When something breaks:**

1. Vercel Dashboard → Your Project
2. Click **"Deployments"**
3. Click latest deployment
4. Click **"Functions"**
5. Click **"View Function Logs"** for `/api/chat`

Look for:
```
✅ GOOD:
=== Environment Check ===
HF_TOKEN exists: true
✅ HF_TOKEN loaded successfully

❌ BAD:
HF_TOKEN exists: false
❌ HF_TOKEN is NOT configured
```

---

## ✅ Success Checklist

```
□ Project imported to Vercel
□ All 4 env vars added
□ Deployment successful (green checkmark)
□ /api/test shows all vars exist
□ Can access homepage
□ Can sign up
□ Can sign in
□ Dashboard loads
□ Can send message
□ AI responds (not 503!)
□ Messages save to database
□ Chat history persists
```

---

## 🎉 Done!

Your PHX-AI is now LIVE on Vercel!

**Share your URL:**
`https://phx-ai.vercel.app`

---

## 💡 Pro Tips

### Custom Domain
1. Vercel Dashboard → Settings → Domains
2. Add your domain
3. Update DNS records
4. Done!

### Auto Deploy
Every `git push` to `main` = auto deploy to Vercel ✅

### Preview Deployments
Every Pull Request = preview URL automatically

### Monitor Performance
Vercel Dashboard → Analytics
- Page views
- Response times
- Error rates

---

**Need help? Check `TROUBLESHOOTING.md`**

