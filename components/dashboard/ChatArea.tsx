'use client'

import { useEffect, useRef, useState } from 'react'
import { useChatStore, Message } from '@/lib/store/useChatStore'
import { useSidebarStore } from '@/lib/store/useSidebarStore'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import { Sparkles, Loader2, PanelLeftClose, PanelLeft } from 'lucide-react'

interface ChatAreaProps {
  onSendMessage: (message: string) => Promise<void>
}

export default function ChatArea({ onSendMessage }: ChatAreaProps) {
  const { sessions, currentSessionId, isLoading } = useChatStore()
  const { isOpen, toggleSidebar } = useSidebarStore()
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
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl animate-pulse">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Selamat Datang di PHOENIX AI
        </h2>
        <p className="text-gray-600 max-w-md mb-8 text-lg">
          Mulai percakapan baru dengan AI atau pilih dari riwayat chat Anda
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl w-full">
          {[
            { icon: '📝', text: 'Bantu saya menulis artikel tentang...', color: 'from-blue-500 to-blue-600' },
            { icon: '💻', text: 'Jelaskan konsep programming...', color: 'from-purple-500 to-purple-600' },
            { icon: '🔢', text: 'Selesaikan persamaan matematika...', color: 'from-green-500 to-green-600' },
            { icon: '📊', text: 'Analisis data dan berikan insight...', color: 'from-orange-500 to-orange-600' },
          ].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSend(suggestion.text)}
              className="group p-6 text-left bg-white border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl group-hover:scale-110 transition-transform">{suggestion.icon}</span>
                <p className="text-sm text-gray-700 group-hover:text-gray-900 font-medium leading-relaxed">{suggestion.text}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative">
      {/* Sidebar Toggle Button (visible when sidebar is hidden) */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex fixed top-4 left-4 z-40 items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
          title="Show Sidebar"
        >
          <PanelLeft className="w-5 h-5 text-gray-700 group-hover:text-blue-600" />
          <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
            Show Sidebar
          </span>
        </button>
      )}
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mb-6 shadow-2xl animate-pulse">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Mulai Percakapan
            </h3>
            <p className="text-gray-600 text-lg">
              Kirim pesan untuk memulai chat dengan PHOENIX AI
            </p>
            <div className="mt-8 text-sm text-gray-500 max-w-md">
              <p className="mb-2">💡 <strong>Tips:</strong></p>
              <ul className="text-left space-y-1">
                <li>• Gunakan <code className="bg-purple-50 px-1 py-0.5 rounded text-purple-700">$...$</code> untuk math inline</li>
                <li>• Gunakan <code className="bg-purple-50 px-1 py-0.5 rounded text-purple-700">```python</code> untuk code blocks</li>
                <li>• AI mendukung markdown lengkap!</li>
              </ul>
            </div>
          </div>
        ) : (
          <>
            <div className="max-w-5xl mx-auto">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {sending && (
                <div className="flex gap-4 mb-8 animate-fadeIn">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-6 h-6 text-white animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <div className="inline-block bg-white border-2 border-gray-100 rounded-3xl rounded-tl-md px-6 py-4 shadow-md">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                        <span className="text-gray-600 text-sm">AI sedang berpikir...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
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

