'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { logoutUser } from '@/src/http/logout-user'

export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      toast.success('Logout realizado com sucesso!')
      
      // Limpa todas as queries relacionadas ao usuário
      queryClient.removeQueries({ queryKey: ['user-rooms'] })
      queryClient.removeQueries({ queryKey: ['messages'] })
      
      // Redireciona para a página inicial ou login
      router.push('/')
      // Força refresh para limpar qualquer estado local
      router.refresh()
    },
    onError: (error: Error) => {
      toast.error(`Erro ao fazer logout: ${error.message}`)
    },
  })
}
