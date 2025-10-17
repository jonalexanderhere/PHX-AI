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
  cleanupDuplicates: () => void
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
              // ULTRA-AGGRESSIVE duplicate prevention with validation
              messages: (() => {
                // 0. Validate message first
                if (!message.id || !message.content || !message.role) {
                  console.log('🚫 Invalid message rejected:', message)
                  return s.messages
                }
                
                if (message.content.trim().length === 0) {
                  console.log('🚫 Empty message rejected:', message.id)
                  return s.messages
                }
                
                // 1. Check ID duplicates
                const existingIds = new Set(s.messages.map(m => m.id))
                if (existingIds.has(message.id)) {
                  console.log('🚫 ID duplicate prevented:', message.id)
                  return s.messages
                }
                
                // 2. Check content duplicates in last 10 messages (extended window)
                const recentMessages = s.messages.slice(-10)
                const isContentDuplicate = recentMessages.some(m => 
                  m.content === message.content && 
                  m.role === message.role &&
                  Math.abs(new Date(m.timestamp).getTime() - new Date(message.timestamp).getTime()) < 10000 // 10 seconds
                )
                
                if (isContentDuplicate) {
                  console.log('🚫 Content duplicate prevented:', message.content.substring(0, 30))
                  return s.messages
                }
                
                // 3. Check for rapid identical messages (same content within 3 seconds)
                const rapidDuplicate = recentMessages.some(m => 
                  m.content === message.content && 
                  m.role === message.role &&
                  Math.abs(new Date(m.timestamp).getTime() - new Date(message.timestamp).getTime()) < 3000
                )
                
                if (rapidDuplicate) {
                  console.log('🚫 Rapid duplicate prevented:', message.content.substring(0, 30))
                  return s.messages
                }
                
                // 4. Check for similar content (fuzzy matching)
                const similarContent = recentMessages.some(m => 
                  m.role === message.role &&
                  m.content.trim().toLowerCase() === message.content.trim().toLowerCase() &&
                  Math.abs(new Date(m.timestamp).getTime() - new Date(message.timestamp).getTime()) < 5000
                )
                
                if (similarContent) {
                  console.log('🚫 Similar content duplicate prevented:', message.content.substring(0, 30))
                  return s.messages
                }
                
                // 5. Check for duplicate timestamps (same second)
                const duplicateTimestamp = recentMessages.some(m => 
                  m.role === message.role &&
                  Math.abs(new Date(m.timestamp).getTime() - new Date(message.timestamp).getTime()) < 1000
                )
                
                if (duplicateTimestamp) {
                  console.log('🚫 Duplicate timestamp prevented:', message.content.substring(0, 30))
                  return s.messages
                }
                
                console.log('✅ Adding new message:', message.id, message.content.substring(0, 30))
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
          ? { 
              ...s, 
              // Deduplicate messages when loading from database
              messages: (() => {
                const uniqueMessages = new Map()
                
                // Add messages in order, keeping only unique ones
                messages.forEach(msg => {
                  const key = `${msg.id}-${msg.content.substring(0, 50)}`
                  if (!uniqueMessages.has(key)) {
                    uniqueMessages.set(key, msg)
                  } else {
                    console.log('🚫 Duplicate message removed during load:', msg.id)
                  }
                })
                
                const deduplicatedMessages = Array.from(uniqueMessages.values())
                console.log(`📥 Loaded ${deduplicatedMessages.length} unique messages for session ${sessionId}`)
                return deduplicatedMessages
              })(),
              updatedAt: new Date() 
            }
          : s
      ),
    })),
  
  clearSessions: () => set({ sessions: [], currentSessionId: null }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  // ULTRA-AGGRESSIVE cleanup duplicates in all sessions
  cleanupDuplicates: () =>
    set((state) => ({
      sessions: state.sessions.map((session) => {
        const uniqueMessages = new Map()
        const cleanedMessages: Message[] = []
        const contentMap = new Map() // Track content duplicates
        
        session.messages.forEach((msg) => {
          const idKey = `${msg.id}-${msg.content.substring(0, 50)}`
          const contentKey = `${msg.role}-${msg.content.trim().toLowerCase()}`
          
          // Check for ID duplicates
          if (uniqueMessages.has(idKey)) {
            console.log('🧹 Cleaned ID duplicate:', msg.id)
            return
          }
          
          // Check for content duplicates
          if (contentMap.has(contentKey)) {
            console.log('🧹 Cleaned content duplicate:', msg.content.substring(0, 30))
            return
          }
          
          // Check for rapid duplicates (same content within 10 seconds)
          const recentMessages = cleanedMessages.slice(-5)
          const isRapidDuplicate = recentMessages.some(m => 
            m.role === msg.role &&
            m.content.trim().toLowerCase() === msg.content.trim().toLowerCase() &&
            Math.abs(new Date(m.timestamp).getTime() - new Date(msg.timestamp).getTime()) < 10000
          )
          
          if (isRapidDuplicate) {
            console.log('🧹 Cleaned rapid duplicate:', msg.content.substring(0, 30))
            return
          }
          
          uniqueMessages.set(idKey, msg)
          contentMap.set(contentKey, msg)
          cleanedMessages.push(msg)
        })
        
        console.log(`🧹 Session ${session.id}: ${session.messages.length} → ${cleanedMessages.length} messages`)
        
        return {
          ...session,
          messages: cleanedMessages,
          updatedAt: new Date(),
        }
      }),
    })),
}))

