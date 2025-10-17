import { NextResponse } from 'next/server'

export async function GET() {
  const envCheck = {
    hfToken: {
      exists: !!process.env.HF_TOKEN,
      length: process.env.HF_TOKEN?.length || 0,
      prefix: process.env.HF_TOKEN?.substring(0, 3) || 'none',
    },
    supabase: {
      urlExists: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKeyExists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      serviceRoleExists: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    environment: process.env.NODE_ENV,
    vercel: {
      region: process.env.VERCEL_REGION || 'local',
      env: process.env.VERCEL_ENV || 'development',
    },
    allEnvKeys: Object.keys(process.env).filter(
      (k) => k.includes('HF') || k.includes('SUPABASE') || k.includes('TOKEN')
    ),
  }

  return NextResponse.json(envCheck, { status: 200 })
}

