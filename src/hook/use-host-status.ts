'use client'

import { useQuery } from '@tanstack/react-query'
import { getHostStatus } from '@/src/http/get-host-status'

interface UseHostStatusProps {
  roomId: string
  enabled?: boolean
}

export function useHostStatus({ roomId, enabled = true }: UseHostStatusProps) {
  return useQuery({
    queryKey: ['host-status', roomId],
    queryFn: () => getHostStatus({ roomId }),
    enabled: !!roomId && enabled,
    staleTime: 30 * 1000, // 30 segundos (status pode mudar)
    retry: (failureCount, error) => {
      // Não tenta novamente se for erro 401 (não autenticado)
      if (error.message.includes('Nenhuma sessão ativa')) {
        return false
      }
      return failureCount < 2
    },
  })
}
