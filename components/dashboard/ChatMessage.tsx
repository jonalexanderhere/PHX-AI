'use client'

import { Message } from '@/lib/store/useChatStore'
import { User, Sparkles, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

interface ChatMessageProps {
  message: Message
  key?: string | number
}

// Code Block Component with Copy Button
function CodeBlock({ language, children }: { language: string; children: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group my-4">
      <div className="absolute right-2 top-2 z-10">
        <button
          onClick={copyToClipboard}
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          title="Copy code"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-gray-300" />
          )}
        </button>
      </div>
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={language}
        PreTag="div"
        className="rounded-xl !bg-gray-900"
        showLineNumbers
        customStyle={{
          margin: 0,
          padding: '1.5rem',
          fontSize: '0.875rem',
          lineHeight: '1.5',
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  )
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-4 mb-8 ${isUser ? 'flex-row-reverse' : ''} animate-fadeIn`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
          isUser
            ? 'bg-gradient-to-br from-gray-100 to-gray-200'
            : 'bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600'
        }`}
      >
        {isUser ? (
          <User className="w-6 h-6 text-gray-700" />
        ) : (
          <Sparkles className="w-6 h-6 text-white animate-pulse" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 ${isUser ? 'flex justify-end' : ''}`}>
        <div
          className={`inline-block max-w-[85%] ${
            isUser
              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-3xl rounded-tr-md px-6 py-4 shadow-lg'
              : 'bg-white border-2 border-gray-100 rounded-3xl rounded-tl-md px-6 py-4 shadow-md hover:shadow-lg transition-shadow'
          }`}
        >
          {isUser ? (
            <p className="text-base leading-relaxed">{message.content}</p>
          ) : (
            <div className="prose prose-base max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-code:text-purple-600 prose-pre:bg-transparent prose-pre:p-0">
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  // Enhanced math rendering
                  math: ({ children }) => (
                    <span className="math-inline bg-blue-50 px-2 py-1 rounded-md border border-blue-200 text-blue-800 font-mono text-sm">
                      {children}
                    </span>
                  ),
                  inlineMath: ({ children }) => (
                    <span className="math-inline bg-blue-50 px-2 py-1 rounded-md border border-blue-200 text-blue-800 font-mono text-sm">
                      {children}
                    </span>
                  ),
                  code({ node, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '')
                    const inline = !className
                    const codeString = String(children).replace(/\n$/, '')
                    
                    return !inline && match ? (
                      <CodeBlock language={match[1]}>
                        {codeString}
                      </CodeBlock>
                    ) : (
                      <code
                        className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md text-sm font-mono border border-purple-200"
                        {...props}
                      >
                        {children}
                      </code>
                    )
                  },
                  p: ({ children }) => <p className="mb-4 last:mb-0 leading-relaxed text-gray-800">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-800">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2 text-gray-800">{children}</ol>,
                  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                  h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-6 text-gray-900 border-b-2 border-blue-500 pb-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-bold mb-3 mt-5 text-gray-900">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-semibold mb-2 mt-4 text-gray-900">{children}</h3>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 rounded-r-lg">
                      {children}
                    </blockquote>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="min-w-full divide-y divide-gray-300 border border-gray-300 rounded-lg">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="px-4 py-2 bg-gray-100 text-left text-sm font-semibold text-gray-900">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-4 py-2 border-t border-gray-200 text-sm text-gray-800">
                      {children}
                    </td>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
        <div className="mt-1 px-2">
          <span className="text-xs text-gray-500">
            {new Date(message.timestamp).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
    </div>
  )
}

