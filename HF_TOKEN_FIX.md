# 🔑 Fix Hugging Face Token Permissions

## ❌ Current Problem

```
Error: This authentication method does not have sufficient permissions 
to call Inference Providers on behalf of user
Status: 403
```

**Your HF_TOKEN does NOT have permission to use Inference Providers!**

---

## ✅ SOLUTION: Generate New Token with Correct Permissions

### Step 1: Go to Hugging Face Settings
```
https://huggingface.co/settings/tokens
```

### Step 2: Create New Token

1. Click **"Create new token"**
2. **Name:** PHX-AI-Production
3. **Type:** Select **"Write"** or **"Fine-grained"**
4. **Permissions:** Make sure to enable:
   - ✅ **"Read access to contents of all repos"**
   - ✅ **"Make calls to Inference API"**
   - ✅ **"Make calls to Inference Providers"** ← **THIS IS CRITICAL!**

5. Click **"Generate token"**
6. **COPY THE NEW TOKEN** (starts with `hf_`)

---

### Step 3: Update Token in Vercel

```bash
# Method 1: Via CLI (Recommended)
cd C:\Users\User\Downloads\PHX-AI

# Remove old token
vercel env rm HF_TOKEN production
vercel env rm HF_TOKEN preview  
vercel env rm HF_TOKEN development

# Add new token
echo "YOUR_NEW_TOKEN" | vercel env add HF_TOKEN production
echo "YOUR_NEW_TOKEN" | vercel env add HF_TOKEN preview
echo "YOUR_NEW_TOKEN" | vercel env add HF_TOKEN development

# Deploy
vercel --prod
```

**Method 2: Via Vercel Dashboard**
```
1. Go to: https://vercel.com/dashboard
2. Select project: phx-ai
3. Settings → Environment Variables
4. Find HF_TOKEN
5. Click "Edit"
6. Paste NEW token
7. Save
8. Go to Deployments → Click "..." → Redeploy
```

---

### Step 4: Update Local .env.local

```bash
# Edit .env.local
HF_TOKEN=YOUR_NEW_TOKEN_HERE
```

---

### Step 5: Test New Token

```bash
# Test locally
node scripts/test-hf-token.js

# Expected output:
# ✅ SUCCESS!
# Response: Hello! ...
# ✅ HF_TOKEN is valid and working!
```

---

## 🎯 Alternative: Use Different AI Provider

If you can't get Inference Providers permission, we can switch to:

### Option A: Hugging Face Serverless API (Free tier)
- Uses different models (GPT-2, Llama, etc.)
- No special permissions needed
- Slower but works

### Option B: OpenAI API
- Requires OpenAI API key
- Fast and reliable
- Costs ~$0.002 per request

### Option C: Local Model via Ollama
- Completely free
- Runs on your machine
- No API keys needed

Let me know which option you prefer!

---

## 📊 Current Status

```
❌ HF_TOKEN: Invalid permissions (403)
✅ Environment: Configured
✅ Database: Working  
✅ Auth: Working
⚠️ AI Service: Blocked by token permissions
```

---

## 🔄 Quick Fix Command

```bash
# After getting new token from HuggingFace:

cd C:\Users\User\Downloads\PHX-AI

# Update Vercel env vars
vercel env rm HF_TOKEN production
echo "NEW_TOKEN_HERE" | vercel env add HF_TOKEN production
echo "NEW_TOKEN_HERE" | vercel env add HF_TOKEN preview
echo "NEW_TOKEN_HERE" | vercel env add HF_TOKEN development

# Update local
# Edit .env.local and change HF_TOKEN=NEW_TOKEN_HERE

# Test
node scripts/test-hf-token.js

# Deploy
vercel --prod

# Test online
# Visit: https://phx-ai.vercel.app
# Send message - should work! ✅
```

---

## ✅ After Fix

You should see:
```
Console: Sending to AI with context: 1 messages
✅ AI responds successfully!
No 500 errors ✅
```

---

**IMPORTANT:** The token needs **"Make calls to Inference Providers"** permission!

Without this, you get 403 error when trying to use DeepSeek model.

