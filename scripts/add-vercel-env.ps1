# Script to add all environment variables to Vercel
# Run this from PowerShell

Write-Host "Adding environment variables to Vercel..." -ForegroundColor Green

# Read from .env.local
$envFile = Get-Content .env.local

# Extract values
$HF_TOKEN = ($envFile | Select-String "^HF_TOKEN=").ToString().Split("=")[1]
$SUPABASE_URL = ($envFile | Select-String "^NEXT_PUBLIC_SUPABASE_URL=").ToString().Split("=")[1]
$SUPABASE_ANON = ($envFile | Select-String "^NEXT_PUBLIC_SUPABASE_ANON_KEY=").ToString().Split("=")[1]
$SUPABASE_SERVICE = ($envFile | Select-String "^SUPABASE_SERVICE_ROLE_KEY=").ToString().Split("=")[1]

Write-Host "Found HF_TOKEN: $($HF_TOKEN.Substring(0,10))..." -ForegroundColor Cyan
Write-Host "Found SUPABASE_URL: $SUPABASE_URL" -ForegroundColor Cyan
Write-Host "Found keys..." -ForegroundColor Cyan

# Add to Vercel (production, preview, development)
Write-Host "`nAdding HF_TOKEN..." -ForegroundColor Yellow
echo $HF_TOKEN | vercel env add HF_TOKEN production
echo $HF_TOKEN | vercel env add HF_TOKEN preview
echo $HF_TOKEN | vercel env add HF_TOKEN development

Write-Host "`nAdding NEXT_PUBLIC_SUPABASE_URL..." -ForegroundColor Yellow
echo $SUPABASE_URL | vercel env add NEXT_PUBLIC_SUPABASE_URL production
echo $SUPABASE_URL | vercel env add NEXT_PUBLIC_SUPABASE_URL preview
echo $SUPABASE_URL | vercel env add NEXT_PUBLIC_SUPABASE_URL development

Write-Host "`nAdding NEXT_PUBLIC_SUPABASE_ANON_KEY..." -ForegroundColor Yellow
echo $SUPABASE_ANON | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
echo $SUPABASE_ANON | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
echo $SUPABASE_ANON | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development

Write-Host "`nAdding SUPABASE_SERVICE_ROLE_KEY..." -ForegroundColor Yellow
echo $SUPABASE_SERVICE | vercel env add SUPABASE_SERVICE_ROLE_KEY production
echo $SUPABASE_SERVICE | vercel env add SUPABASE_SERVICE_ROLE_KEY preview
echo $SUPABASE_SERVICE | vercel env add SUPABASE_SERVICE_ROLE_KEY development

Write-Host "`n✅ All environment variables added!" -ForegroundColor Green
Write-Host "Now deploying to Vercel..." -ForegroundColor Green

# Deploy
vercel --prod

Write-Host "`n🚀 Deployment complete!" -ForegroundColor Green
Write-Host "Test at: https://phx-ai.vercel.app/api/test" -ForegroundColor Cyan

