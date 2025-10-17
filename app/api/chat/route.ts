import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { InferenceClient } from '@huggingface/inference'

// Validate HF_TOKEN
const HF_TOKEN = process.env.HF_TOKEN || process.env.NEXT_PUBLIC_HF_TOKEN

if (!HF_TOKEN) {
  console.error('HF_TOKEN is not configured in environment variables')
  console.error('Available env keys:', Object.keys(process.env).filter(k => k.includes('HF') || k.includes('TOKEN')))
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
          content: `Anda adalah PHOENIX AI, asisten AI yang cerdas, membantu, dan ramah. 

PENTING - Format Khusus:
1. Untuk Matematika: Gunakan LaTeX dengan $...$ untuk inline dan $$...$$ untuk block equations
2. Untuk Code: Selalu gunakan code blocks dengan bahasa yang sesuai
3. Gunakan markdown dengan baik untuk formatting
4. Berikan penjelasan yang detail dan terstruktur

Contoh matematika:
- Inline: Rumus $x^2 + y^2 = r^2$ adalah persamaan lingkaran
- Block: $$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$

Contoh code:
\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
\`\`\`

Berikan jawaban dalam Bahasa Indonesia yang sopan dan mudah dipahami.`,
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 3000,
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

