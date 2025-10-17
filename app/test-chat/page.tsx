'use client'

import { useState } from 'react'

export default function TestChatPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testEnvironment = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/test')
      const data = await response.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const testChat = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Hello, test message!' }],
          sessionId: 'test-session-123',
        }),
      })
      const data = await response.json()
      setResult({ status: response.status, data })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">PHX-AI Debug Page</h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Environment Variables</h2>
          <button
            onClick={testEnvironment}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? 'Testing...' : 'Test Environment'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Chat API (Without Auth)</h2>
          <button
            onClick={testChat}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {loading ? 'Testing...' : 'Test Chat API'}
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Note: This will return 401 if not authenticated
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-semibold mb-2">Error</h3>
            <pre className="text-sm text-red-600 whitespace-pre-wrap">{error}</pre>
          </div>
        )}

        {result && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Result</h3>
            <pre className="text-sm overflow-auto bg-gray-900 text-green-400 p-4 rounded">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3">Debug Info</h3>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Environment:</strong> {process.env.NODE_ENV || 'unknown'}
            </p>
            <p>
              <strong>Build:</strong> {new Date().toISOString()}
            </p>
            <p>
              <strong>Expected Env Vars:</strong>
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>HF_TOKEN (server-side only)</li>
              <li>NEXT_PUBLIC_SUPABASE_URL</li>
              <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
              <li>SUPABASE_SERVICE_ROLE_KEY (server-side only)</li>
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <a
            href="/dashboard"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}

