'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { markMessageAsAnswered } from '@/src/http/mark-message-as-answered'
import type { GetRoomMessagesResponse } from '@/src/http/get-room-messages'

interface UseMarkMessageAsAnsweredProps {
  roomId: string
}

export function useMarkMessageAsAnswered({ roomId }: UseMarkMessageAsAnsweredProps) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ messageId }: { messageId: string }) => 
      markMessageAsAnswered({ roomId, messageId }),
    
    onSuccess: (_, { messageId }) => {
      toast.success('Mensagem marcada como respondida!')
      
      // Atualiza o cache local imediatamente
      queryClient.setQueryData<GetRoomMessagesResponse>(
        ['messages', roomId], 
        (old) => {
          if (!old) return old
          
          return {
            messages: old.messages.map(message => 
              message.id === messageId 
                ? { ...message, answered: true }
                : message
            )
          }
        }
      )
    },
    
    onError: (error: Error) => {
      toast.error(`Erro ao marcar mensagem: ${error.message}`)
    },
  })
}
