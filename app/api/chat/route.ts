import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { InferenceClient } from '@huggingface/inference'

// Get HF_TOKEN from multiple sources with priority
function getHFToken(): string | undefined {
  // Priority order:
  // 1. Direct HF_TOKEN
  // 2. NEXT_PUBLIC_HF_TOKEN
  // 3. Runtime env (for Vercel)
  return (
    process.env.HF_TOKEN ||
    process.env.NEXT_PUBLIC_HF_TOKEN ||
    (typeof globalThis !== 'undefined' && (globalThis as any).HF_TOKEN)
  )
}

const HF_TOKEN = getHFToken()

console.log('=== Environment Check (Enhanced) ===')
console.log('HF_TOKEN exists:', !!HF_TOKEN)
console.log('HF_TOKEN length:', HF_TOKEN?.length || 0)
console.log('HF_TOKEN prefix:', HF_TOKEN?.substring(0, 10) || 'undefined')
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('VERCEL_ENV:', process.env.VERCEL_ENV || 'not-vercel')
console.log('All HF/TOKEN env keys:', Object.keys(process.env).filter(k => 
  k.toUpperCase().includes('HF') || k.toUpperCase().includes('TOKEN')
))

if (!HF_TOKEN) {
  console.error('❌ HF_TOKEN is NOT configured')
  console.error('Checked sources: HF_TOKEN, NEXT_PUBLIC_HF_TOKEN, globalThis.HF_TOKEN')
} else {
  console.log('✅ HF_TOKEN loaded successfully')
}

// Gunakan Hugging Face Inference Client dengan DeepSeek-R1
// Initialize with token or undefined (will check later)
const client = HF_TOKEN ? new InferenceClient(HF_TOKEN) : null

export async function POST(request: Request) {
  console.log('Chat API called')
  
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check auth
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      console.log('No session found')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Robust JSON parsing with error handling
    let body
    try {
      body = await request.json()
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError)
      return NextResponse.json({ 
        error: 'Invalid request format. Please check your input.',
        details: 'Request body is not valid JSON'
      }, { status: 400 })
    }
    
    const { messages, sessionId } = body
    
    console.log('Request body:', { messagesCount: messages?.length, sessionId })

    if (!messages || !Array.isArray(messages)) {
      console.log('Invalid messages format')
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    // Re-check token at runtime (for Vercel)
    const runtimeToken = getHFToken()
    
    if (!runtimeToken || !client) {
      console.error('❌ HF_TOKEN not configured at runtime')
      console.error('Environment:', process.env.VERCEL_ENV || 'local')
      console.error('All env keys:', Object.keys(process.env).slice(0, 20))
      
      return NextResponse.json(
        { 
          error: 'AI service not configured. Please add HF_TOKEN to Vercel environment variables.',
          help: 'Go to: Vercel Dashboard → Settings → Environment Variables → Add HF_TOKEN',
          debug: process.env.NODE_ENV === 'development' ? {
            tokenExists: false,
            vercelEnv: process.env.VERCEL_ENV,
            envKeys: Object.keys(process.env).filter(k => k.includes('HF') || k.includes('TOKEN'))
          } : undefined
        },
        { status: 503 }
      )
    }

    console.log('✅ Token verified, calling Hugging Face API...')

    // Re-initialize client with runtime token if needed
    const activeClient = client || new InferenceClient(runtimeToken)

    let completion
    try {
      // Call Hugging Face Inference API dengan DeepSeek-R1 (Local/Direct)
      completion = await activeClient.chatCompletion({
        model: "deepseek-ai/DeepSeek-R1-0528",
        messages: [
          {
            role: 'system',
            content: `Anda adalah PHOENIX AI, asisten AI yang cerdas, membantu, dan ramah dengan kemampuan MEMORY LENGKAP.

KEMAMPUAN ANDA:
- Anda MENGINGAT semua percakapan sebelumnya dalam session ini
- Anda dapat merujuk kembali ke informasi yang sudah dibahas
- Jangan minta user mengulang informasi yang sudah mereka berikan
- Gunakan konteks dari pesan sebelumnya untuk memberikan jawaban yang lebih relevan

FORMAT KHUSUS UNTUK MATEMATIKA:
1. **Inline Math** (untuk rumus pendek): 
   - Gunakan $rumus$ untuk inline: $x^2 + y^2 = r^2$
   - Contoh: Bunga majemuk $A = P(1 + r)^n$

2. **Block Math** (untuk rumus panjang):
   - Gunakan $$rumus$$ untuk block:
   $$A = P \\times (1 + r)^n$$
   $$P = \\frac{A}{(1 + r)^n}$$

3. **Langkah-langkah perhitungan**:
   - Selalu jelaskan setiap langkah dengan jelas
   - Gunakan format yang mudah dibaca
   - Berikan penjelasan untuk setiap operasi

4. **Code**: Selalu gunakan code blocks dengan bahasa
   \`\`\`python
   def fibonacci(n):
       if n <= 1:
           return n
       return fibonacci(n-1) + fibonacci(n-2)
   \`\`\`

5. **Markdown**: Gunakan heading, lists, bold, italic, blockquotes
6. **Tables**: Gunakan table markdown untuk data terstruktur

CARA MERESPONS MATEMATIKA:
- **Selalu gunakan LaTeX untuk rumus matematika**
- **Jelaskan setiap langkah perhitungan dengan detail**
- **Gunakan format yang mudah dibaca dan dipahami**
- **Berikan contoh konkret jika memungkinkan**
- **Verifikasi jawaban dengan perhitungan ulang**

CARA MERESPONS UMUM:
- Referensikan percakapan sebelumnya jika relevan
- Berikan jawaban yang konsisten dengan informasi yang sudah diberikan
- Jika user menanyakan "seperti tadi" atau "yang tadi", gunakan konteks sebelumnya
- Berikan penjelasan detail dan terstruktur dalam Bahasa Indonesia

Ingat: Anda punya akses ke SELURUH riwayat chat dalam session ini!`,
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 4000,
      })
      
      console.log('✅ AI response received successfully')
      
    } catch (aiError: any) {
      console.error('❌ Hugging Face API Error:', {
        message: aiError.message,
        status: aiError.status,
        statusText: aiError.statusText,
        type: aiError.type,
        name: aiError.name,
      })
      
      // Provide specific error based on HF API response
      let errorMsg = 'AI service temporarily unavailable. Please try again.'
      
      if (aiError.status === 401) {
        errorMsg = 'AI authentication failed. Invalid HF_TOKEN.'
      } else if (aiError.status === 403) {
        errorMsg = 'Access to AI model denied. Check HF_TOKEN permissions.'
      } else if (aiError.status === 429) {
        errorMsg = 'AI rate limit exceeded. Please wait a moment and try again.'
      } else if (aiError.status === 503 || aiError.status === 504) {
        errorMsg = 'AI service is busy. Please try again in a few moments.'
      } else if (aiError.message?.includes('timeout')) {
        errorMsg = 'AI response timeout. Please try with a shorter message.'
      }
      
      return NextResponse.json(
        { 
          error: errorMsg,
          details: process.env.NODE_ENV === 'development' ? aiError.message : undefined,
          debug: {
            status: aiError.status,
            message: aiError.message?.substring(0, 200)
          }
        },
        { status: 500 }
      )
    }

    const assistantMessage = completion.choices[0]?.message
    
    if (!assistantMessage || !assistantMessage.content) {
      console.error('No valid response from AI')
      throw new Error('No response from AI model')
    }

    console.log('Assistant message:', assistantMessage.content.substring(0, 100))

    // Save messages to Supabase
    if (sessionId) {
      // Save user message
      const userMessage = messages[messages.length - 1]
      await supabase.from('messages').insert({
        session_id: sessionId,
        role: 'user',
        content: userMessage.content,
      })

      // Save assistant message
      await supabase.from('messages').insert({
        session_id: sessionId,
        role: 'assistant',
        content: assistantMessage.content,
      })

      // Update session timestamp
      await supabase
        .from('chat_sessions')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', sessionId)
    }

    console.log('Returning response to client')
    
    return NextResponse.json({
      message: assistantMessage.content,
      role: 'assistant',
    })
  } catch (error: any) {
    console.error('Chat API Error:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack?.substring(0, 200),
      name: error.name
    })
    
    // Provide more specific error messages
    let errorMessage = 'Internal server error'
    let statusCode = 500
    
    if (error.message?.includes('API') || error.message?.includes('fetch')) {
      errorMessage = 'Failed to connect to AI service. Please try again.'
      statusCode = 503
    } else if (error.message?.includes('timeout')) {
      errorMessage = 'Request timeout. Please try again with a shorter message.'
      statusCode = 504
    } else if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      errorMessage = 'Service temporarily unavailable. Please try again in a moment.'
      statusCode = 429
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: statusCode }
    )
  }
}

