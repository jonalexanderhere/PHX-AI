# 🔧 Troubleshooting Guide - PHX-AI

## 🚨 Common Issues & Solutions

---

## ❌ Error: "AI service not configured" (503)

### Symptoms
```
❌ Error: AI service not configured. Please check server configuration.
Status: 503
```

### Causes & Solutions

#### 1. **HF_TOKEN Not Loaded**

**Check:**
```bash
# PowerShell
Get-Content .env.local | Select-String "HF_TOKEN"

# Output should show:
# HF_TOKEN=hf_YourActualTokenHere...
```

**Fix:**
1. Ensure `.env.local` exists in root directory
2. Make sure `HF_TOKEN=your_token_here` is present
3. **RESTART the dev server** (environment variables only load on startup)

```bash
# Stop all node processes
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# Start fresh
npm run dev
```

#### 2. **next.config.js Not Configured**

**Check `next.config.js`:**
```javascript
const nextConfig = {
  env: {
    HF_TOKEN: process.env.HF_TOKEN,  // ← Must be present
  },
}
```

**If missing, add it and restart server.**

#### 3. **Invalid Token**

**Check token format:**
- Must start with `hf_`
- Length: ~40-50 characters
- Get new token from: https://huggingface.co/settings/tokens

**Test token:**
```bash
curl https://huggingface.co/api/whoami-v2 \
  -H "Authorization: Bearer hf_YOUR_TOKEN"
```

#### 4. **Server Logs Check**

Look for these logs when server starts:

```
✅ GOOD:
=== Environment Check ===
HF_TOKEN exists: true
HF_TOKEN length: 45
HF_TOKEN prefix: hf_BdlGtYL
NODE_ENV: development
✅ HF_TOKEN loaded successfully

❌ BAD:
HF_TOKEN exists: false
HF_TOKEN length: 0
HF_TOKEN prefix: undefined
❌ HF_TOKEN is NOT configured
```

---

## 🔴 404 Errors (about, features, pricing)

### Symptoms
```
Failed to load resource: the server responded with a status of 404 ()
about?_rsc=19zvn:1
features?_rsc=19zvn:1
pricing?_rsc=19zvn:1
```

### Cause
Links in Navbar pointing to non-existent pages.

### Solution ✅ FIXED
Updated `components/layout/Navbar.tsx`:
```typescript
const navLinks = [
  { href: '/', label: 'Beranda' },
  { href: '/dashboard', label: 'Dashboard' },
  // Removed: features, pricing, about
]
```

**No action needed - already fixed!**

---

## 🔵 Sidebar Not Showing

### Symptoms
- Sidebar is hidden on desktop
- Cannot see chat history
- Toggle button doesn't work

### Solution ✅ FIXED
Updated `components/dashboard/Sidebar.tsx` with proper CSS classes.

**Check:**
1. Look for toggle button on left side
2. Click to show/hide sidebar
3. Should animate smoothly

**If still broken:**
```bash
# Clear cache and restart
rm -rf .next
npm run dev
```

---

## 🟡 Messages Not Saving to Database

### Symptoms
- Messages disappear on page refresh
- Chat history empty
- "Failed to load messages" error

### Diagnosis

**1. Check Supabase Connection:**
```bash
npm run test:connection
```

Should show:
```
✅ Supabase client initialized
✅ Connected to Supabase successfully
```

**2. Check Environment Variables:**
```bash
Get-Content .env.local | Select-String "SUPABASE"
```

Should show:
```
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

**3. Check Database Tables:**
```bash
npm run db:check
```

Should show:
```
✅ chat_sessions table exists
✅ messages table exists
✅ user_profiles table exists
```

### Fix

**If tables don't exist:**
1. Go to Supabase Dashboard
2. Open SQL Editor
3. Run `lib/db/schema.sql`
4. Verify with `npm run db:check`

**If connection fails:**
1. Check `.env.local` credentials
2. Verify Supabase project is active
3. Check network/firewall settings

---

## 🟠 AI Not Remembering Context

### Symptoms
- AI asks for info you already provided
- No continuity in conversation
- Behaves like each message is new

### Diagnosis

**Check Console Logs:**
```
Sending to AI with context: 1 messages  ← BAD (should be > 1 after first message)
Sending to AI with context: 5 messages  ← GOOD
```

**Check Network Tab:**
Look at `/api/chat` request payload:
```json
{
  "messages": [
    { "role": "user", "content": "Jelaskan OOP" },
    { "role": "assistant", "content": "OOP adalah..." },
    { "role": "user", "content": "Berikan contoh" }  ← Should include previous
  ]
}
```

### Solution

**If only 1 message sent:**
1. Check `app/dashboard/page.tsx` - `handleSendMessage`
2. Should have:
```typescript
const allMessages = currentSession?.messages || []
const messagesWithContext = [...allMessages, userMessage]
```

**If messages not loading from DB:**
1. Check `handleSelectSession` function
2. Should call: `GET /api/sessions/${id}/messages`
3. Should populate: `setMessages(id, messages)`

---

## 🟣 Session Title Not Updating

### Symptoms
- All sessions show "New Chat"
- Title doesn't change after first message

### Solution ✅ FIXED

**Check API Route:**
- `app/api/sessions/route.ts` should have `PATCH` handler
- `app/dashboard/page.tsx` should call PATCH on first message

**Manual Fix if needed:**
```typescript
// After AI responds to first message
const title = content.slice(0, 50) + (content.length > 50 ? '...' : '')

await fetch(`/api/sessions`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id: currentSessionId, title }),
})
```

---

## 🔴 Build Errors / TypeScript Errors

### Common Error 1: "Binding element implicitly has 'any' type"

**Fix:** Add explicit type annotations
```typescript
// BAD
supabase.auth.getSession().then(({ data }) => { ... })

// GOOD
supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => { ... })
```

### Common Error 2: "Property 'inline' does not exist"

**Fix:** Use `any` type for ReactMarkdown component props
```typescript
code({ node, className, children, ...props }: any) {
  const match = /language-(\w+)/.exec(className || '')
  const inline = !className
  // ...
}
```

### Common Error 3: Module not found

**Fix:**
```bash
npm install
rm -rf .next
npm run dev
```

---

## ⚙️ Development Server Issues

### Server Won't Start

**Check port 3000:**
```bash
# PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Start again
npm run dev
```

### Hot Reload Not Working

**Fix:**
```bash
# Clear Next.js cache
rm -rf .next

# Restart server
npm run dev
```

### Environment Variables Not Updating

**Important:** Environment variables are loaded ONCE at startup!

**Fix:**
```bash
# 1. Stop server (Ctrl+C or kill process)
Get-Process -Name node | Stop-Process -Force

# 2. Update .env.local

# 3. Start fresh
npm run dev

# 4. Check logs for "Environment Check"
```

---

## 🧪 Testing Checklist

### ✅ Basic Functionality
```
□ Server starts without errors
□ Can access http://localhost:3000
□ Can sign up new user
□ Can sign in existing user
□ Dashboard loads after login
□ Can create new chat session
□ Can send message
□ AI responds within 10 seconds
□ Message appears in chat
□ Can see chat history in sidebar
□ Sidebar can hide/show
```

### ✅ AI Memory
```
□ Send message 1: "My name is John"
□ AI acknowledges
□ Send message 2: "What is my name?"
□ AI responds: "Your name is John" ✅
□ Create new session
□ Send message: "What is my name?"
□ AI responds: "You haven't told me" ✅
```

### ✅ Database Persistence
```
□ Send several messages
□ Refresh page
□ Messages still visible ✅
□ Click different session
□ Original session messages persist ✅
```

### ✅ Markdown & LaTeX
```
□ Send: "Show me $x^2 + y^2 = r^2$"
□ Math renders correctly ✅
□ Send: "Show Python code for fibonacci"
□ Code block with syntax highlighting ✅
□ Copy button works ✅
```

---

## 📊 Debug Mode

### Enable Verbose Logging

**In `app/api/chat/route.ts`:**
```typescript
console.log('=== Request Debug ===')
console.log('Messages count:', messages.length)
console.log('First message:', messages[0])
console.log('Last message:', messages[messages.length - 1])
console.log('Session ID:', sessionId)
```

**In `app/dashboard/page.tsx`:**
```typescript
console.log('Current session:', currentSession)
console.log('All sessions:', sessions)
console.log('Loading state:', loading)
```

### Monitor Network Requests

**Chrome DevTools → Network tab:**
1. Filter: `Fetch/XHR`
2. Look for:
   - `/api/chat` - POST
   - `/api/sessions` - GET, POST, PATCH, DELETE
   - `/api/sessions/[id]/messages` - GET

**Check request/response:**
- Status should be `200` or `201`
- Response should contain expected data
- Check `Preview` tab for JSON structure

---

## 🆘 Last Resort Solutions

### Nuclear Option 1: Fresh Install
```bash
# Backup .env.local
cp .env.local .env.local.backup

# Delete everything
rm -rf node_modules
rm -rf .next
rm package-lock.json

# Fresh install
npm install
npm run dev
```

### Nuclear Option 2: Fresh Database
```bash
# Go to Supabase Dashboard → SQL Editor
# Run:
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

# Then run full schema from lib/db/schema.sql
```

### Nuclear Option 3: New Supabase Project
1. Create new project on Supabase
2. Get new credentials
3. Update `.env.local`
4. Run `lib/db/schema.sql`
5. Restart server

---

## 📞 Getting Help

### Check Logs First
**Always include these when asking for help:**
```
1. Server console output (terminal logs)
2. Browser console (F12 → Console)
3. Network tab errors (F12 → Network)
4. Screenshot of error message
5. What you were trying to do
```

### Useful Commands
```bash
# Check environment
npm run test:connection

# Check database
npm run db:check

# Check all processes
Get-Process -Name node

# View logs
npm run dev 2>&1 | tee logs.txt
```

---

## ✅ Everything Working?

### You should see:
```
✅ Server: http://localhost:3000
✅ HF_TOKEN loaded
✅ Supabase connected
✅ Tables exist
✅ Messages saving
✅ AI responding
✅ Memory working
✅ Sidebar functional
✅ No 404 errors
✅ No console errors
```

### Congrats! 🎉

**Your PHX-AI is fully operational!**

---

**Need more help? Check:**
- `SCHEMA_FULL.md` - Database structure
- `FEATURES.md` - Feature documentation
- `README.md` - General overview
- `SETUP_COMPLETE.md` - Setup guide

