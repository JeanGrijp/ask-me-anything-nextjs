import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteRoom } from '../http/delete-room'
import { toast } from 'sonner'

export function useDeleteRoom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteRoom,
    onMutate: async ({ roomId }) => {
      // Cancelar qualquer query em andamento para evitar conflitos
      await queryClient.cancelQueries({ queryKey: ['user-rooms'] })

      // Snapshot do estado anterior para rollback em caso de erro
      const previousRooms = queryClient.getQueryData(['user-rooms'])

      // Atualização otimista: remover a sala da lista imediatamente
      queryClient.setQueryData(['user-rooms'], (old: any) => {
        if (!Array.isArray(old)) return old
        return old.filter((room: any) => room.id !== roomId)
      })

      // Retornar contexto para possível rollback
      return { previousRooms }
    },
    onSuccess: () => {
      // Invalidar as queries das salas para garantir sincronização
      queryClient.invalidateQueries({
        queryKey: ['user-rooms']
      })
      
      toast.success('Sala deletada com sucesso!')
    },
    onError: (error: Error, variables, context) => {
      // Rollback em caso de erro
      if (context?.previousRooms) {
        queryClient.setQueryData(['user-rooms'], context.previousRooms)
      }
      
      toast.error(error.message)
    },
    onSettled: () => {
      // Sempre invalidar no final para garantir consistência
      queryClient.invalidateQueries({ queryKey: ['user-rooms'] })
    }
  })
}
