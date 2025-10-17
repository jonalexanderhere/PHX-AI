'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useChatStore, ChatSession, Message } from '@/lib/store/useChatStore'
import Sidebar from '@/components/dashboard/Sidebar'
import ChatArea from '@/components/dashboard/ChatArea'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuthStore()
  const {
    sessions,
    currentSessionId,
    addSession,
    setCurrentSession,
    deleteSession,
    addMessage,
    setMessages,
    updateSessionTitle,
    isLoading,
    setLoading,
  } = useChatStore()
  const [loadingSessions, setLoadingSessions] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadSessions()
    }
  }, [user])

  const loadSessions = async () => {
    try {
      const response = await fetch('/api/sessions')
      const data = await response.json()

      if (data.sessions) {
        // Transform sessions data
        const transformedSessions: ChatSession[] = data.sessions.map((s: any) => ({
          id: s.id,
          title: s.title,
          messages: [],
          createdAt: new Date(s.created_at),
          updatedAt: new Date(s.updated_at),
        }))

        // Load sessions into store
        transformedSessions.forEach((session) => {
          addSession(session)
        })
      }
    } catch (error) {
      console.error('Error loading sessions:', error)
    } finally {
      setLoadingSessions(false)
    }
  }

  const handleNewChat = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Chat' }),
      })

      const data = await response.json()

      if (data.session) {
        const newSession: ChatSession = {
          id: data.session.id,
          title: data.session.title,
          messages: [],
          createdAt: new Date(data.session.created_at),
          updatedAt: new Date(data.session.updated_at),
        }

        addSession(newSession)
        setCurrentSession(newSession.id)
      }
    } catch (error) {
      console.error('Error creating new chat:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectSession = async (id: string) => {
    try {
      setLoading(true)
      setCurrentSession(id)

      // Load messages for this session from database
      const response = await fetch(`/api/sessions/${id}/messages`)
      const data = await response.json()

      if (data.messages) {
        const messages: Message[] = data.messages.map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: new Date(m.created_at),
        }))

        // Update session messages in store
        setMessages(id, messages)
        console.log('Loaded', messages.length, 'messages for session', id)
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSession = async (id: string) => {
    try {
      const response = await fetch(`/api/sessions?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        deleteSession(id)
      }
    } catch (error) {
      console.error('Error deleting session:', error)
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!currentSessionId) return

    // Prevent duplicate submissions
    if (isLoading) {
      console.log('Already processing message, ignoring duplicate')
      return
    }

    // Additional check: prevent rapid identical messages
    const currentSession = sessions.find((s) => s.id === currentSessionId)
    const lastMessage = currentSession?.messages[currentSession.messages.length - 1]
    if (lastMessage && 
        lastMessage.content === content && 
        lastMessage.role === 'user' &&
        Date.now() - new Date(lastMessage.timestamp).getTime() < 3000) {
      console.log('Identical message too recent, ignoring')
      return
    }

    // Generate unique ID with better collision avoidance
    const messageId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const userMessage: Message = {
      id: messageId,
      role: 'user',
      content,
      timestamp: new Date(),
    }

    // Add user message immediately
    addMessage(currentSessionId, userMessage)
    setLoading(true)

    try {
      const currentSession = sessions.find((s) => s.id === currentSessionId)
      const allMessages = currentSession?.messages || []
      
      // Include ALL previous messages for context (AI memory)
      const messagesWithContext = [...allMessages, userMessage].map((m) => ({ 
        role: m.role, 
        content: m.content 
      }))

      console.log('Sending to AI with context:', messagesWithContext.length, 'messages')

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messagesWithContext,
          sessionId: currentSessionId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle error response with unique ID
        const errorId = `${Date.now() + 1}-${Math.random().toString(36).substr(2, 9)}`
        const errorMessage: Message = {
          id: errorId,
          role: 'assistant',
          content: `❌ **Error**: ${data.error || 'Terjadi kesalahan saat menghubungi AI'}${data.details ? `\n\nDetail: ${data.details}` : ''}\n\nSilakan coba lagi atau hubungi administrator jika masalah berlanjut.`,
          timestamp: new Date(),
        }
        addMessage(currentSessionId, errorMessage)
      } else if (data.message) {
        // Generate unique ID for assistant message
        const assistantId = `${Date.now() + 2}-${Math.random().toString(36).substr(2, 9)}`
        const assistantMessage: Message = {
          id: assistantId,
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
        }

        addMessage(currentSessionId, assistantMessage)

        // Update session title with first user message only
        if (allMessages.length === 0) {
          const title = content.slice(0, 50) + (content.length > 50 ? '...' : '')
          
          const updateResponse = await fetch(`/api/sessions`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: currentSessionId, title }),
          })

          if (updateResponse.ok) {
            // Update local session title in store
            updateSessionTitle(currentSessionId, title)
            console.log('Updated session title:', title)
          }
        }
      }
    } catch (error: any) {
      console.error('Error sending message:', error)
      
      // Add error message to chat with unique ID
      const errorId = `${Date.now() + 3}-${Math.random().toString(36).substr(2, 9)}`
      const errorMessage: Message = {
        id: errorId,
        role: 'assistant',
        content: `❌ **Koneksi Error**: Tidak dapat menghubungi server.\n\n${error.message || 'Unknown error'}\n\nPastikan koneksi internet Anda stabil dan coba lagi.`,
        timestamp: new Date(),
      }
      addMessage(currentSessionId, errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loadingSessions) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50/30 to-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-phoenix-blue animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
      />
      <ChatArea onSendMessage={handleSendMessage} />
    </div>
  )
}

