import { useState, useEffect } from "react"

interface UseUserReactionsParams {
  roomId: string
}

export function useUserReactions({ roomId }: UseUserReactionsParams) {
  const [reactedMessageIds, setReactedMessageIds] = useState<Set<string>>(new Set())

  // Carrega as reações do localStorage quando o componente monta
  useEffect(() => {
    const storageKey = `user-reactions-${roomId}`
    const storedReactions = localStorage.getItem(storageKey)
    
    if (storedReactions) {
      try {
        const reactionIds = JSON.parse(storedReactions) as string[]
        setReactedMessageIds(new Set(reactionIds))
      } catch (error) {
        console.error('Erro ao carregar reações do localStorage:', error)
      }
    }
  }, [roomId])

  // Salva as reações no localStorage sempre que elas mudam
  const saveReactionsToStorage = (newReactions: Set<string>) => {
    const storageKey = `user-reactions-${roomId}`
    const reactionIds = Array.from(newReactions)
    localStorage.setItem(storageKey, JSON.stringify(reactionIds))
  }

  const addReaction = (messageId: string) => {
    setReactedMessageIds(prev => {
      const newSet = new Set(prev)
      newSet.add(messageId)
      saveReactionsToStorage(newSet)
      return newSet
    })
  }

  const removeReaction = (messageId: string) => {
    setReactedMessageIds(prev => {
      const newSet = new Set(prev)
      newSet.delete(messageId)
      saveReactionsToStorage(newSet)
      return newSet
    })
  }

  const hasReacted = (messageId: string) => reactedMessageIds.has(messageId)

  return {
    reactedMessageIds,
    hasReacted,
    addReaction,
    removeReaction,
  }
}
