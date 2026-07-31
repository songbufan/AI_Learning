import { useEffect, useState } from 'react'
import { streamKimiChat } from './api'
import { loadChatMessages, saveChatMessages } from './chatStorage'
import { ChatInterface } from './components/ChatInterface'
import { formatChatError } from './formatChatError'
import type { Message } from './types'

function App() {
  const [messages, setMessages] = useState<Message[]>(() => loadChatMessages())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    saveChatMessages(messages)
  }, [messages])

  const handleSend = async (text: string) => {
    const userMsg: Message = {
      role: 'user',
      content: text,
      timestamp: Date.now(),
    }
    const assistantMsg: Message = {
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    }

    const historyForApi: Message[] = [...messages, userMsg]

    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setLoading(true)

    try {
      await streamKimiChat(historyForApi, {
        onDelta: (chunk) => {
          setMessages((prev) => {
            const next = [...prev]
            const last = next.length - 1
            if (last >= 0 && next[last].role === 'assistant') {
              next[last] = {
                ...next[last],
                content: next[last].content + chunk,
              }
            }
            return next
          })
        },
      })
    } catch (e) {
      const friendly = formatChatError(e)
      setMessages((prev) => {
        const next = [...prev]
        const last = next.length - 1
        if (last >= 0 && next[last].role === 'assistant') {
          const cur = next[last].content
          next[last] = {
            ...next[last],
            content: cur
              ? `${cur}\n\n---\n**未能完成回复：** ${friendly}`
              : `抱歉，${friendly}`,
          }
        }
        return next
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    if (loading) return
    setMessages([])
  }

  return (
    <ChatInterface
      messages={messages}
      onSend={handleSend}
      onClear={handleClear}
      loading={loading}
      title="AI 聊天助手"
    />
  )
}

export default App
