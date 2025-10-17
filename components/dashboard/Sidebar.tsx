'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Logo from '@/components/ui/Logo'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useChatStore } from '@/lib/store/useChatStore'
import { useSidebarStore } from '@/lib/store/useSidebarStore'
import {
  Plus,
  MessageSquare,
  Trash2,
  LogOut,
  Menu,
  X,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

interface SidebarProps {
  onNewChat: () => void
  onSelectSession: (id: string) => void
  onDeleteSession: (id: string) => void
}

export default function Sidebar({
  onNewChat,
  onSelectSession,
  onDeleteSession,
}: SidebarProps) {
  const router = useRouter()
  const { user } = useAuthStore()
  const { sessions, currentSessionId } = useChatStore()
  const { isOpen, toggleSidebar } = useSidebarStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <Link href="/" className="flex items-center space-x-3 group mb-4">
          <Logo size="sm" />
          <span className="text-lg font-bold bg-gradient-to-r from-phoenix-blue to-phoenix-darkBlue bg-clip-text text-transparent">
            PHOENIX AI
          </span>
        </Link>
        <button
          onClick={() => {
            onNewChat()
            setMobileOpen(false)
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-phoenix-blue text-white rounded-lg hover:bg-phoenix-darkBlue transition"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Chat Baru</span>
        </button>
      </div>

      {/* Chat Sessions */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
          Riwayat Chat
        </h3>
        <div className="space-y-2">
          {sessions.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              Belum ada riwayat chat
            </p>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition ${
                  currentSessionId === session.id
                    ? 'bg-phoenix-blue/10 border border-phoenix-blue'
                    : 'hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <button
                  onClick={() => {
                    onSelectSession(session.id)
                    setMobileOpen(false)
                  }}
                  className="flex-1 text-left text-sm truncate"
                >
                  {session.title}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteSession(session.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
            <Settings className="w-4 h-4" />
            Pengaturan
          </button>
          <button
            onClick={handleSignOut}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="hidden lg:block fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
        title={isOpen ? 'Hide Sidebar' : 'Show Sidebar'}
      >
        {isOpen ? (
          <ChevronLeft className="w-5 h-5 text-gray-700 group-hover:text-blue-600" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-blue-600" />
        )}
      </button>

      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border-2 border-gray-200"
      >
        {mobileOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-80 bg-white border-r border-gray-200
          transform transition-all duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:${isOpen ? 'translate-x-0 w-80' : '-translate-x-80 w-0'}
        `}
      >
        <SidebarContent />
      </aside>
    </>
  )
}

