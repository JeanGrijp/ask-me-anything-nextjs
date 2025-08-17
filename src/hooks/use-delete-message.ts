import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteMessage } from '../../http/delete-message'
import { toast } from 'sonner'
import type { GetRoomMessagesResponse } from '../../http/get-room-messages'

interface DeleteMessageVariables {
  messageId: string
  roomId: string
}

export function useDeleteMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteMessage,
    onMutate: async ({ messageId, roomId }: DeleteMessageVariables) => {
      // Cancelar qualquer query em andamento para evitar conflitos
      await queryClient.cancelQueries({ queryKey: ['messages', roomId] })

      // Snapshot do estado anterior para rollback em caso de erro
      const previousMessages = queryClient.getQueryData(['messages', roomId])

      // Atualização otimista: remover a mensagem da lista imediatamente
      queryClient.setQueryData<GetRoomMessagesResponse>(['messages', roomId], (old: GetRoomMessagesResponse | undefined) => {
        if (!old) return old
        return {
          messages: old.messages.filter((message: any) => message.id !== messageId)
        }
      })

      // Mostrar toast de início da operação
      toast.loading('Deletando mensagem...', { id: `delete-message-${messageId}` })

      // Retornar contexto para possível rollback
      return { previousMessages, messageId, roomId }
    },
    onSuccess: (_, { messageId }: DeleteMessageVariables) => {
      // Dismiss do toast de loading e mostrar sucesso
      toast.dismiss(`delete-message-${messageId}`)
      toast.success('Mensagem deletada com sucesso!')
    },
    onError: (error: Error, { messageId, roomId }: DeleteMessageVariables, context: any) => {
      // Dismiss do toast de loading
      toast.dismiss(`delete-message-${messageId}`)
      
      // Rollback em caso de erro
      if (context?.previousMessages) {
        queryClient.setQueryData(['messages', roomId], context.previousMessages)
      }
      
      toast.error(error.message)
    },
    onSettled: (_, __, { roomId }: DeleteMessageVariables) => {
      // Sempre invalidar no final para garantir consistência
      queryClient.invalidateQueries({ queryKey: ['messages', roomId] })
    }
  })
}
