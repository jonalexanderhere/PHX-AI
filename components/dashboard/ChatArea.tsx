'use client'

import { useEffect, useRef, useState } from 'react'
import { useChatStore, Message } from '@/lib/store/useChatStore'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import { Sparkles, Loader2 } from 'lucide-react'

interface ChatAreaProps {
  onSendMessage: (message: string) => Promise<void>
}

export default function ChatArea({ onSendMessage }: ChatAreaProps) {
  const { sessions, currentSessionId, isLoading } = useChatStore()
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentSession = sessions.find((s) => s.id === currentSessionId)
  const messages = currentSession?.messages || []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (message: string) => {
    setSending(true)
    try {
      await onSendMessage(message)
    } finally {
      setSending(false)
    }
  }

  if (!currentSessionId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-phoenix-blue to-phoenix-darkBlue rounded-full flex items-center justify-center mb-6">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Selamat Datang di PHOENIX AI
        </h2>
        <p className="text-gray-600 max-w-md mb-6">
          Mulai percakapan baru dengan AI atau pilih dari riwayat chat Anda
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          {[
            'Bantu saya menulis artikel tentang...',
            'Jelaskan konsep programming...',
            'Berikan ide untuk project...',
            'Analisis data dan berikan insight...',
          ].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSend(suggestion)}
              className="p-4 text-left bg-white border border-gray-200 rounded-lg hover:border-phoenix-blue hover:shadow-md transition"
            >
              <p className="text-sm text-gray-700">{suggestion}</p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-phoenix-blue to-phoenix-darkBlue rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Mulai Percakapan
            </h3>
            <p className="text-gray-600">
              Kirim pesan untuk memulai chat dengan PHOENIX AI
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {sending && (
              <div className="flex gap-4 mb-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-phoenix-blue to-phoenix-darkBlue flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="inline-block bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3">
                    <Loader2 className="w-5 h-5 text-phoenix-blue animate-spin" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <ChatInput
            onSend={handleSend}
            disabled={!currentSessionId}
            loading={sending || isLoading}
          />
          <p className="mt-2 text-xs text-gray-500 text-center">
            PHOENIX AI dapat membuat kesalahan. Mohon verifikasi informasi penting.
          </p>
        </div>
      </div>
    </div>
  )
}

