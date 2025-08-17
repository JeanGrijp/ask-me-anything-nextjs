'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createMessageReaction } from '@/src/http/create-message-reaction'
import type { GetRoomMessagesResponse } from '@/src/http/get-room-messages'

interface UseCreateMessageReactionProps {
  roomId: string
}

export function useCreateMessageReaction({ roomId }: UseCreateMessageReactionProps) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ messageId }: { messageId: string }) => 
      createMessageReaction({ roomId, messageId }),
    
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
      toast.error(`Erro ao adicionar reação: ${error.message}`)
    },
  })
}
