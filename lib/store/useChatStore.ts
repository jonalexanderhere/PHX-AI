import { create } from 'zustand'

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

interface ChatState {
  sessions: ChatSession[]
  currentSessionId: string | null
  isLoading: boolean
  addSession: (session: ChatSession) => void
  updateSession: (id: string, session: Partial<ChatSession>) => void
  updateSessionTitle: (id: string, title: string) => void
  deleteSession: (id: string) => void
  setCurrentSession: (id: string) => void
  addMessage: (sessionId: string, message: Message) => void
  setMessages: (sessionId: string, messages: Message[]) => void
  clearSessions: () => void
  setLoading: (loading: boolean) => void
}

export const useChatStore = create<ChatState>((set) => ({
  sessions: [],
  currentSessionId: null,
  isLoading: false,
  
  addSession: (session) =>
    set((state) => ({
      sessions: [session, ...state.sessions],
      currentSessionId: session.id,
    })),
  
  updateSession: (id, updatedSession) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === id ? { ...s, ...updatedSession, updatedAt: new Date() } : s
      ),
    })),
  
  updateSessionTitle: (id, title) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === id ? { ...s, title, updatedAt: new Date() } : s
      ),
    })),
  
  deleteSession: (id) =>
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== id),
      currentSessionId:
        state.currentSessionId === id ? null : state.currentSessionId,
    })),
  
  setCurrentSession: (id) => set({ currentSessionId: id }),
  
  addMessage: (sessionId, message) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              // Aggressive duplicate prevention
              messages: (() => {
                const existingIds = new Set(s.messages.map(m => m.id))
                if (existingIds.has(message.id)) {
                  console.log('Duplicate message prevented:', message.id)
                  return s.messages
                }
                
                // Also check for content duplicates within last 5 messages
                const recentMessages = s.messages.slice(-5)
                const isContentDuplicate = recentMessages.some(m => 
                  m.content === message.content && 
                  m.role === message.role &&
                  Math.abs(new Date(m.timestamp).getTime() - new Date(message.timestamp).getTime()) < 5000
                )
                
                if (isContentDuplicate) {
                  console.log('Content duplicate prevented:', message.content.substring(0, 20))
                  return s.messages
                }
                
                console.log('Adding new message:', message.id, message.content.substring(0, 20))
                return [...s.messages, message]
              })(),
              updatedAt: new Date(),
            }
          : s
      ),
    })),
  
  setMessages: (sessionId, messages) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === sessionId
          ? { ...s, messages, updatedAt: new Date() }
          : s
      ),
    })),
  
  clearSessions: () => set({ sessions: [], currentSessionId: null }),
  
  setLoading: (loading) => set({ isLoading: loading }),
}))

