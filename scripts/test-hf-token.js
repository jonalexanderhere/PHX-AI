// Test Hugging Face Token validity
const { InferenceClient } = require('@huggingface/inference')

// Load token from environment
const HF_TOKEN = process.env.HF_TOKEN

if (!HF_TOKEN) {
  console.error('❌ HF_TOKEN not found in environment!')
  console.error('Please set HF_TOKEN in .env.local or run: $env:HF_TOKEN="your_token"')
  process.exit(1)
}

console.log('Testing Hugging Face Token...')
console.log('Token:', HF_TOKEN.substring(0, 10) + '...')

const client = new InferenceClient(HF_TOKEN)

async function testToken() {
  try {
    console.log('\n1. Testing simple chat completion...')
    
    const completion = await client.chatCompletion({
      model: 'deepseek-ai/DeepSeek-R1-0528',
      messages: [
        { role: 'user', content: 'Hello! Just testing.' }
      ],
      max_tokens: 50,
    })
    
    console.log('✅ SUCCESS!')
    console.log('Response:', completion.choices[0]?.message?.content)
    console.log('\n✅ HF_TOKEN is valid and working!')
    
  } catch (error) {
    console.error('\n❌ ERROR!')
    console.error('Status:', error.status)
    console.error('Message:', error.message)
    console.error('Type:', error.type)
    
    if (error.status === 401) {
      console.error('\n❌ Token is INVALID or EXPIRED')
      console.error('Solution: Generate new token at https://huggingface.co/settings/tokens')
    } else if (error.status === 403) {
      console.error('\n❌ Token does NOT have access to this model')
      console.error('Solution: Check model permissions or use different model')
    } else if (error.status === 404) {
      console.error('\n❌ Model NOT FOUND')
      console.error('Solution: Check model name: deepseek-ai/DeepSeek-R1-0528')
    } else if (error.status === 429) {
      console.error('\n❌ RATE LIMIT exceeded')
      console.error('Solution: Wait a moment or upgrade HF plan')
    } else {
      console.error('\n❌ Unknown error')
      console.error('Full error:', error)
    }
  }
}

testToken()

