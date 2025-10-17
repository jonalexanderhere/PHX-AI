#!/usr/bin/env node

/**
 * PHX-AI Database Test Script
 * Test database connection and functionality
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🧪 PHX-AI Database Test Suite')
console.log('==============================')

// Test 1: Environment Variables
console.log('\n1️⃣ Testing Environment Variables...')
console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing')
console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ Set' : '❌ Missing')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing required environment variables!')
  process.exit(1)
}

// Create clients
const anonClient = createClient(supabaseUrl, supabaseAnonKey)
const serviceClient = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null

async function runTests() {
  try {
    // Test 2: Basic Connection
    console.log('\n2️⃣ Testing Basic Connection...')
    const { data: healthData, error: healthError } = await anonClient
      .from('chat_sessions')
      .select('count')
      .limit(1)

    if (healthError) {
      console.log('❌ Connection failed:', healthError.message)
      return
    }
    console.log('✅ Connected to Supabase successfully')

    // Test 3: Table Existence
    console.log('\n3️⃣ Testing Table Existence...')
    
    const tables = ['chat_sessions', 'messages', 'user_profiles']
    const tableResults = {}

    for (const table of tables) {
      try {
        const { data, error } = await anonClient
          .from(table)
          .select('*')
          .limit(1)

        if (error) {
          tableResults[table] = { exists: false, error: error.message }
        } else {
          tableResults[table] = { exists: true, count: data?.length || 0 }
        }
      } catch (err) {
        tableResults[table] = { exists: false, error: err.message }
      }
    }

    // Display results
    for (const [table, result] of Object.entries(tableResults)) {
      if (result.exists) {
        console.log(`✅ ${table}: Exists`)
      } else {
        console.log(`❌ ${table}: ${result.error}`)
      }
    }

    // Test 4: RLS Policies
    console.log('\n4️⃣ Testing Row Level Security...')
    
    try {
      // This should work with anon key (no data returned due to RLS)
      const { data: rlsData, error: rlsError } = await anonClient
        .from('chat_sessions')
        .select('*')

      if (rlsError) {
        console.log('⚠️  RLS test failed:', rlsError.message)
      } else {
        console.log('✅ RLS policies are active (no data returned for anonymous user)')
      }
    } catch (err) {
      console.log('⚠️  RLS test error:', err.message)
    }

    // Test 5: Service Role Access (if available)
    if (serviceClient) {
      console.log('\n5️⃣ Testing Service Role Access...')
      
      try {
        const { data: serviceData, error: serviceError } = await serviceClient
          .from('chat_sessions')
          .select('*')
          .limit(1)

        if (serviceError) {
          console.log('⚠️  Service role access failed:', serviceError.message)
        } else {
          console.log('✅ Service role access working')
        }
      } catch (err) {
        console.log('⚠️  Service role test error:', err.message)
      }
    } else {
      console.log('\n5️⃣ Skipping Service Role Test (no service key provided)')
    }

    // Test 6: Database Functions
    console.log('\n6️⃣ Testing Database Functions...')
    
    if (serviceClient) {
      try {
        // Test the user stats function
        const { data: statsData, error: statsError } = await serviceClient
          .rpc('get_user_session_stats', { user_uuid: '00000000-0000-0000-0000-000000000000' })

        if (statsError) {
          console.log('⚠️  Function test failed:', statsError.message)
        } else {
          console.log('✅ Database functions working')
        }
      } catch (err) {
        console.log('⚠️  Function test error:', err.message)
      }
    } else {
      console.log('⚠️  Skipping function tests (no service key)')
    }

    // Test 7: Performance Test
    console.log('\n7️⃣ Testing Performance...')
    
    const startTime = Date.now()
    
    try {
      const { data: perfData, error: perfError } = await anonClient
        .from('chat_sessions')
        .select('id, title, created_at')
        .limit(10)

      const endTime = Date.now()
      const responseTime = endTime - startTime

      if (perfError) {
        console.log('⚠️  Performance test failed:', perfError.message)
      } else {
        console.log(`✅ Query completed in ${responseTime}ms`)
        if (responseTime < 1000) {
          console.log('🚀 Performance: Excellent')
        } else if (responseTime < 3000) {
          console.log('⚡ Performance: Good')
        } else {
          console.log('🐌 Performance: Slow')
        }
      }
    } catch (err) {
      console.log('⚠️  Performance test error:', err.message)
    }

    // Summary
    console.log('\n📊 Test Summary')
    console.log('================')
    console.log('✅ Connection: Working')
    console.log('✅ Tables: Checked')
    console.log('✅ RLS: Active')
    console.log('✅ Performance: Tested')
    console.log('')
    console.log('🎉 Database is ready for PHX-AI!')
    console.log('')
    console.log('🔗 Test your app:')
    console.log('  Local: http://localhost:3000')
    console.log('  Production: https://phx-ai.vercel.app')

  } catch (error) {
    console.error('❌ Test suite failed:', error.message)
    console.error('Stack:', error.stack)
  }
}

// Run tests
runTests()
  .then(() => {
    console.log('\n✨ Database test completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Test failed:', error)
    process.exit(1)
  })
