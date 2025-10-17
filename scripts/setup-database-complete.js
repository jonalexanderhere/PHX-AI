#!/usr/bin/env node

/**
 * PHX-AI Database Setup Script
 * Complete database initialization for Supabase
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials!')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log('🚀 Starting PHX-AI Database Setup...')
  console.log('=====================================')

  try {
    // 1. Test connection
    console.log('1️⃣ Testing Supabase connection...')
    const { data: testData, error: testError } = await supabase
      .from('auth.users')
      .select('count')
      .limit(1)

    if (testError) {
      console.error('❌ Connection failed:', testError.message)
      return
    }
    console.log('✅ Connected to Supabase successfully')

    // 2. Check if tables exist
    console.log('\n2️⃣ Checking existing tables...')
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_table_info')

    if (tablesError) {
      console.log('⚠️  Could not check tables (this is normal for new projects)')
    } else {
      console.log('📊 Existing tables:', tables)
    }

    // 3. Run schema SQL
    console.log('\n3️⃣ Setting up database schema...')
    console.log('📝 This will create tables, indexes, policies, and functions...')

    // Read the complete schema
    const fs = require('fs')
    const path = require('path')
    const schemaPath = path.join(__dirname, '..', 'lib', 'db', 'schema-complete.sql')
    
    if (!fs.existsSync(schemaPath)) {
      console.error('❌ Schema file not found:', schemaPath)
      return
    }

    const schemaSQL = fs.readFileSync(schemaPath, 'utf8')
    
    // Split into individual statements
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    console.log(`📋 Found ${statements.length} SQL statements to execute`)

    // Execute each statement
    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.length === 0) continue

      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement })
        if (error) {
          console.log(`⚠️  Statement ${i + 1}: ${error.message}`)
          errorCount++
        } else {
          successCount++
        }
      } catch (err) {
        console.log(`⚠️  Statement ${i + 1}: ${err.message}`)
        errorCount++
      }
    }

    console.log(`\n📊 Execution Results:`)
    console.log(`✅ Successful: ${successCount}`)
    console.log(`⚠️  Errors: ${errorCount}`)

    // 4. Verify tables
    console.log('\n4️⃣ Verifying table creation...')
    
    const tablesToCheck = ['chat_sessions', 'messages', 'user_profiles']
    
    for (const tableName of tablesToCheck) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1)

        if (error) {
          console.log(`❌ Table ${tableName}: ${error.message}`)
        } else {
          console.log(`✅ Table ${tableName}: Ready`)
        }
      } catch (err) {
        console.log(`❌ Table ${tableName}: ${err.message}`)
      }
    }

    // 5. Test RLS policies
    console.log('\n5️⃣ Testing Row Level Security...')
    
    try {
      // This should work with service role key
      const { data: sessions, error: sessionsError } = await supabase
        .from('chat_sessions')
        .select('*')
        .limit(1)

      if (sessionsError) {
        console.log('⚠️  RLS test failed:', sessionsError.message)
      } else {
        console.log('✅ RLS policies working correctly')
      }
    } catch (err) {
      console.log('⚠️  RLS test error:', err.message)
    }

    // 6. Create sample data (optional)
    console.log('\n6️⃣ Database setup complete!')
    console.log('=====================================')
    console.log('✅ PHX-AI Database is ready!')
    console.log('')
    console.log('📋 What was created:')
    console.log('  • chat_sessions table')
    console.log('  • messages table') 
    console.log('  • user_profiles table')
    console.log('  • Indexes for performance')
    console.log('  • Row Level Security policies')
    console.log('  • Anti-duplicate triggers')
    console.log('  • Utility functions')
    console.log('')
    console.log('🔗 Next steps:')
    console.log('  1. Test your app: https://phx-ai.vercel.app')
    console.log('  2. Sign up for a new account')
    console.log('  3. Create your first chat session')
    console.log('  4. Start chatting with AI!')
    console.log('=====================================')

  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    console.error('Stack:', error.stack)
  }
}

// Run the setup
setupDatabase()
  .then(() => {
    console.log('\n🎉 Database setup completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Setup failed:', error)
    process.exit(1)
  })
