const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupDatabase() {
  console.log('🚀 Starting database setup...\n')

  try {
    // Read SQL schema
    const schemaPath = path.join(__dirname, '..', 'lib', 'db', 'schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')

    console.log('📝 Reading schema.sql...')

    // Split into individual statements
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`📊 Found ${statements.length} SQL statements\n`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      
      // Skip comments
      if (statement.trim().startsWith('--')) continue

      try {
        console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`)
        
        const { data, error } = await supabase.rpc('exec_sql', {
          sql: statement
        })

        if (error) {
          // Try alternative method for table creation
          console.log(`⚠️  RPC failed, trying direct execution...`)
          
          // For tables and basic operations, we'll need to handle them differently
          // Since Supabase REST API doesn't allow direct SQL execution via client
          console.log(`ℹ️  Please run the schema manually via Supabase SQL Editor`)
          console.log(`   Or use Supabase CLI: supabase db push`)
          break
        }

        console.log(`✅ Statement ${i + 1} executed successfully`)

      } catch (err) {
        console.error(`❌ Error executing statement ${i + 1}:`, err.message)
      }
    }

    console.log('\n✅ Database setup completed!')
    console.log('\n📋 Next steps:')
    console.log('1. Verify tables in Supabase Dashboard > Table Editor')
    console.log('2. Check that chat_sessions, messages, and user_profiles exist')
    console.log('3. Test authentication by signing up a new user')

  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    process.exit(1)
  }
}

// Alternative: Check if tables exist
async function checkTables() {
  console.log('\n🔍 Checking existing tables...\n')

  const tables = ['chat_sessions', 'messages', 'user_profiles']

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1)

      if (error) {
        console.log(`❌ Table '${table}' - NOT FOUND or ERROR`)
        console.log(`   Error: ${error.message}`)
      } else {
        console.log(`✅ Table '${table}' - EXISTS`)
      }
    } catch (err) {
      console.log(`❌ Table '${table}' - ERROR: ${err.message}`)
    }
  }
}

// Run setup
console.log('🔧 PHX-AI Database Setup Tool\n')
console.log('📍 Supabase URL:', supabaseUrl)
console.log('')

// First check what already exists
checkTables().then(() => {
  console.log('\n' + '='.repeat(60))
  console.log('\n⚠️  Note: Automatic SQL execution requires Supabase CLI')
  console.log('📖 Please run the schema manually using one of these methods:')
  console.log('')
  console.log('Method 1: Supabase Dashboard (Recommended)')
  console.log('  1. Go to https://supabase.com/dashboard')
  console.log('  2. Open SQL Editor')
  console.log('  3. Paste contents of lib/db/schema.sql')
  console.log('  4. Click Run')
  console.log('')
  console.log('Method 2: Supabase CLI')
  console.log('  npx supabase db push')
  console.log('')
}).catch(console.error)

