'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2 } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  loading?: boolean
}

export default function ChatInput({ onSend, disabled, loading }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lastSubmitTime = useRef(0)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [message])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // ULTRA-AGGRESSIVE debounce (3 seconds)
    const now = Date.now()
    if (now - lastSubmitTime.current < 3000) {
      console.log('🚫 Submission too fast, ignoring (3s debounce)')
      return
    }
    
    if (message.trim() && !disabled && !loading) {
      lastSubmitTime.current = now
      console.log('✅ Sending message:', message.trim().substring(0, 30))
      onSend(message.trim())
      setMessage('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ketik pesan Anda... Mendukung markdown, code blocks, dan LaTeX untuk matematika..."
        disabled={disabled || loading}
        rows={1}
        className="w-full px-6 py-4 pr-14 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none max-h-32 custom-scrollbar disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all text-base"
      />
      <button
        type="submit"
        disabled={!message.trim() || disabled || loading}
        className="absolute right-3 bottom-3 p-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md transform hover:scale-105 active:scale-95"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </button>
    </form>
  )
}

