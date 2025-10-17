import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { InferenceClient } from '@huggingface/inference'

// Validate HF_TOKEN
const HF_TOKEN = process.env.HF_TOKEN || process.env.NEXT_PUBLIC_HF_TOKEN

console.log('=== Environment Check ===')
console.log('HF_TOKEN exists:', !!HF_TOKEN)
console.log('HF_TOKEN length:', HF_TOKEN?.length || 0)
console.log('HF_TOKEN prefix:', HF_TOKEN?.substring(0, 10) || 'undefined')
console.log('NODE_ENV:', process.env.NODE_ENV)

if (!HF_TOKEN) {
  console.error('❌ HF_TOKEN is NOT configured')
  console.error('Available env keys:', Object.keys(process.env).filter(k => k.includes('HF') || k.includes('TOKEN')))
} else {
  console.log('✅ HF_TOKEN loaded successfully')
}

// Gunakan Hugging Face Inference Client dengan DeepSeek-R1
const client = new InferenceClient(HF_TOKEN)

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

    const body = await request.json()
    const { messages, sessionId } = body
    
    console.log('Request body:', { messagesCount: messages?.length, sessionId })

    if (!messages || !Array.isArray(messages)) {
      console.log('Invalid messages format')
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    if (!HF_TOKEN) {
      console.error('HF_TOKEN not configured in request')
      return NextResponse.json(
        { error: 'AI service not configured. Please check server configuration.' },
        { status: 503 }
      )
    }

    console.log('Calling Hugging Face API...')

    // Call Hugging Face Inference API dengan DeepSeek-R1 (Local/Direct)
    const completion = await client.chatCompletion({
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

FORMAT KHUSUS:
1. Matematika: 
   - Inline: $x^2 + y^2 = r^2$
   - Block: $$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$

2. Code: Selalu gunakan code blocks dengan bahasa
   \`\`\`python
   def fibonacci(n):
       if n <= 1:
           return n
       return fibonacci(n-1) + fibonacci(n-2)
   \`\`\`

3. Markdown: Gunakan heading, lists, bold, italic, blockquotes
4. Tables: Gunakan table markdown untuk data terstruktur

CARA MERESPONS:
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

    console.log('AI response received')

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

