import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'

// Gunakan Hugging Face API dengan DeepSeek-R1
const client = new OpenAI({
  baseURL: 'https://router.huggingface.co/v1',
  apiKey: process.env.HF_TOKEN,
})

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check auth
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { messages, sessionId } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    // Call Hugging Face API dengan DeepSeek-R1
    const completion = await client.chat.completions.create({
      model: 'deepseek-ai/DeepSeek-R1-0528:novita',
      messages: [
        {
          role: 'system',
          content: 'Anda adalah PHOENIX AI, asisten AI yang cerdas, membantu, dan ramah. Anda berbicara dalam Bahasa Indonesia dengan baik dan sopan. Berikan jawaban yang akurat, informatif, dan mudah dipahami.',
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const assistantMessage = completion.choices[0].message

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

    return NextResponse.json({
      message: assistantMessage.content,
      role: 'assistant',
    })
  } catch (error: any) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

