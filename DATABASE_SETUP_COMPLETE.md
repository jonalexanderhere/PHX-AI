# 🗄️ PHX-AI Database Setup Guide

Complete database setup for PHX-AI with Supabase PostgreSQL.

## 📋 Quick Start

### 1. **Automatic Setup (Recommended)**
```bash
# Run complete database setup
npm run db:setup

# Test database connection
npm run db:test
```

### 2. **Manual Setup (Supabase Dashboard)**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor**
4. Copy and paste contents from `lib/db/schema-complete.sql`
5. Click **Run**

---

## 🏗️ Database Schema

### **Core Tables**

#### 1. **chat_sessions**
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key to auth.users)
- title (TEXT, Chat session title)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- message_count (INTEGER, Auto-calculated)
- last_message_at (TIMESTAMP)
- is_archived (BOOLEAN)
```

#### 2. **messages**
```sql
- id (UUID, Primary Key)
- session_id (UUID, Foreign Key to chat_sessions)
- role (TEXT, 'user'|'assistant'|'system')
- content (TEXT, Message content)
- created_at (TIMESTAMP)
- content_hash (TEXT, SHA256 hash for duplicate detection)
- duplicate_check (BOOLEAN, Anti-duplicate flag)
- token_count (INTEGER, Message token count)
- processing_time_ms (INTEGER, AI processing time)
```

#### 3. **user_profiles**
```sql
- id (UUID, Primary Key, Foreign Key to auth.users)
- full_name (TEXT, User's full name)
- avatar_url (TEXT, Profile picture URL)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- preferences (JSONB, User preferences)
- settings (JSONB, User settings)
- last_active_at (TIMESTAMP)
```

---

## 🔒 Security Features

### **Row Level Security (RLS)**
- ✅ Users can only access their own data
- ✅ Automatic user isolation
- ✅ Secure by default

### **Anti-Duplicate System**
- ✅ Content hash-based duplicate detection
- ✅ Time-based duplicate prevention (5 minutes)
- ✅ Automatic duplicate flagging
- ✅ Cleanup functions for old duplicates

### **Performance Optimizations**
- ✅ Strategic indexes on all foreign keys
- ✅ Composite indexes for common queries
- ✅ Partial indexes for archived sessions
- ✅ Full-text search indexes

---

## 🛠️ Available Scripts

### **Database Management**
```bash
# Complete database setup
npm run db:setup

# Test database connection
npm run db:test

# Check existing database
npm run db:check

# Test environment variables
npm run test:connection
```

### **Manual SQL Execution**
```bash
# Run specific SQL file
psql -h your-db-host -U postgres -d postgres -f lib/db/schema-complete.sql
```

---

## 📊 Database Functions

### **Utility Functions**
```sql
-- Get user session statistics
SELECT * FROM get_user_session_stats('user-uuid');

-- Clean up duplicate messages
SELECT cleanup_duplicate_messages();

-- Update session message count (automatic)
-- Prevent duplicate messages (automatic)
```

### **Triggers**
- ✅ Auto-update `updated_at` timestamps
- ✅ Auto-create user profiles on signup
- ✅ Auto-update session message counts
- ✅ Auto-detect and flag duplicates

---

## 🔧 Environment Variables

### **Required Variables**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### **Optional Variables**
```env
POSTGRES_URL=postgres://...
POSTGRES_USER=postgres
POSTGRES_HOST=db.your-project.supabase.co
POSTGRES_PASSWORD=your-password
POSTGRES_DATABASE=postgres
```

---

## 🧪 Testing Database

### **1. Connection Test**
```bash
npm run db:test
```

**Expected Output:**
```
🧪 PHX-AI Database Test Suite
==============================

1️⃣ Testing Environment Variables...
NEXT_PUBLIC_SUPABASE_URL: ✅ Set
NEXT_PUBLIC_SUPABASE_ANON_KEY: ✅ Set
SUPABASE_SERVICE_ROLE_KEY: ✅ Set

2️⃣ Testing Basic Connection...
✅ Connected to Supabase successfully

3️⃣ Testing Table Existence...
✅ chat_sessions: Exists
✅ messages: Exists
✅ user_profiles: Exists

4️⃣ Testing Row Level Security...
✅ RLS policies are active

5️⃣ Testing Service Role Access...
✅ Service role access working

6️⃣ Testing Database Functions...
✅ Database functions working

7️⃣ Testing Performance...
✅ Query completed in 245ms
🚀 Performance: Excellent

📊 Test Summary
================
✅ Connection: Working
✅ Tables: Checked
✅ RLS: Active
✅ Performance: Tested

🎉 Database is ready for PHX-AI!
```

### **2. Manual Testing**
```sql
-- Test user creation
INSERT INTO auth.users (id, email) VALUES ('test-user', 'test@example.com');

-- Test session creation
INSERT INTO chat_sessions (user_id, title) VALUES ('test-user', 'Test Session');

-- Test message creation
INSERT INTO messages (session_id, role, content) 
VALUES ('session-id', 'user', 'Hello AI!');

-- Test duplicate prevention
INSERT INTO messages (session_id, role, content) 
VALUES ('session-id', 'user', 'Hello AI!'); -- Should be flagged as duplicate
```

---

## 🚨 Troubleshooting

### **Common Issues**

#### **1. Connection Failed**
```bash
❌ Connection failed: Invalid API key
```
**Solution:** Check your environment variables in `.env.local`

#### **2. Tables Not Found**
```bash
❌ chat_sessions: relation "chat_sessions" does not exist
```
**Solution:** Run `npm run db:setup` to create tables

#### **3. RLS Errors**
```bash
⚠️ RLS test failed: new row violates row-level security policy
```
**Solution:** This is normal for anonymous users. RLS is working correctly.

#### **4. Permission Denied**
```bash
❌ permission denied for table chat_sessions
```
**Solution:** Check your Supabase service role key

### **Debug Commands**
```bash
# Check environment variables
npm run test:connection

# Test database functions
npm run db:test

# Verify schema
npm run db:check
```

---

## 📈 Performance Monitoring

### **Query Performance**
```sql
-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### **Index Usage**
```sql
-- Check index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes 
ORDER BY idx_scan DESC;
```

---

## 🔄 Maintenance

### **Regular Cleanup**
```sql
-- Clean up old duplicate messages (run weekly)
SELECT cleanup_duplicate_messages();

-- Archive old sessions (run monthly)
UPDATE chat_sessions 
SET is_archived = TRUE 
WHERE updated_at < NOW() - INTERVAL '6 months';

-- Update statistics (run weekly)
ANALYZE;
```

### **Backup Strategy**
```bash
# Full database backup
pg_dump -h your-host -U postgres -d postgres > backup.sql

# Schema only backup
pg_dump -h your-host -U postgres -d postgres --schema-only > schema.sql

# Data only backup
pg_dump -h your-host -U postgres -d postgres --data-only > data.sql
```

---

## 🎯 Production Checklist

### **Before Going Live**
- [ ] ✅ All tables created
- [ ] ✅ RLS policies active
- [ ] ✅ Indexes created
- [ ] ✅ Functions working
- [ ] ✅ Triggers active
- [ ] ✅ Performance tested
- [ ] ✅ Backup strategy in place
- [ ] ✅ Monitoring configured

### **Environment Variables Set**
- [ ] ✅ `NEXT_PUBLIC_SUPABASE_URL`
- [ ] ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] ✅ `SUPABASE_SERVICE_ROLE_KEY`
- [ ] ✅ `HF_TOKEN` (for AI)

### **Security Verified**
- [ ] ✅ RLS policies working
- [ ] ✅ User isolation active
- [ ] ✅ No data leaks
- [ ] ✅ API keys secure

---

## 📞 Support

### **Database Issues**
1. Check logs: `npm run db:test`
2. Verify environment: `npm run test:connection`
3. Re-run setup: `npm run db:setup`

### **Performance Issues**
1. Check indexes: `npm run db:test`
2. Monitor queries in Supabase Dashboard
3. Run maintenance: `ANALYZE;`

### **Security Issues**
1. Verify RLS: Check Supabase Dashboard → Authentication → Policies
2. Test user isolation
3. Review API key permissions

---

## 🎉 Success!

Your PHX-AI database is now ready! 

**Next Steps:**
1. 🚀 Deploy your app: `npm run build`
2. 🔗 Test live: https://phx-ai.vercel.app
3. 👤 Create user accounts
4. 💬 Start chatting with AI!

**Database Features Active:**
- ✅ Anti-duplicate system
- ✅ User isolation
- ✅ Performance optimization
- ✅ Automatic maintenance
- ✅ Security policies

**Ready for production! 🎯**
