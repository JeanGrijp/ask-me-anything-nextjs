'use client'

import { useQuery } from '@tanstack/react-query'
import { getUserRooms } from '@/http/get-user-rooms'

export function useUserRooms() {
  return useQuery({
    queryKey: ['user-rooms'],
    queryFn: getUserRooms,
    retry: (failureCount, error) => {
      // Não tenta novamente se for erro 401 (não autenticado)
      if (error.message.includes('Nenhuma sessão ativa')) {
        return false
      }
      return failureCount < 3
    },
  })
}
