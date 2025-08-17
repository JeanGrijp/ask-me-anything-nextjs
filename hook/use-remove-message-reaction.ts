'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { removeMessageReaction } from '@/http/remove-message-reaction'
import type { GetRoomMessagesResponse } from '@/http/get-room-messages'

interface UseRemoveMessageReactionProps {
  roomId: string
}

export function useRemoveMessageReaction({ roomId }: UseRemoveMessageReactionProps) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ messageId }: { messageId: string }) => 
      removeMessageReaction({ roomId, messageId }),
    
    onSuccess: (data, { messageId }) => {
      // Atualiza o cache local com o count real do servidor
      queryClient.setQueryData<GetRoomMessagesResponse>(
        ['messages', roomId], 
        (old) => {
          if (!old) return old
          
          return {
            messages: old.messages.map(message => 
              message.id === messageId 
                ? { ...message, amountOfReactions: data.count }
                : message
            )
          }
        }
      )
    },
    
    onError: (error: Error) => {
      toast.error(`Erro ao remover reação: ${error.message}`)
    },
  })
}
