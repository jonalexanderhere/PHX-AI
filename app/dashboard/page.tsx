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

      // Load messages for this session
      const response = await fetch(`/api/sessions/${id}/messages`)
      const data = await response.json()

      if (data.messages) {
        const messages: Message[] = data.messages.map((m: any) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          timestamp: new Date(m.created_at),
        }))

        // Update session with messages
        const session = sessions.find((s) => s.id === id)
        if (session) {
          session.messages = messages
        }
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

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    addMessage(currentSessionId, userMessage)

    try {
      const currentSession = sessions.find((s) => s.id === currentSessionId)
      const messages = currentSession?.messages || []

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          sessionId: currentSessionId,
        }),
      })

      const data = await response.json()

      if (data.message) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
        }

        addMessage(currentSessionId, assistantMessage)

        // Update session title with first message
        if (messages.length === 0) {
          const title = content.slice(0, 50) + (content.length > 50 ? '...' : '')
          await fetch(`/api/sessions`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: currentSessionId, title }),
          })
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
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

