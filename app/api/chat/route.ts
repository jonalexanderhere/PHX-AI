import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { InferenceClient } from '@huggingface/inference'

// Gunakan Hugging Face Inference Client dengan DeepSeek-R1
const client = new InferenceClient(process.env.HF_TOKEN)

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

    const assistantMessage = completion.choices[0]?.message
    
    if (!assistantMessage) {
      throw new Error('No response from AI model')
    }

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

