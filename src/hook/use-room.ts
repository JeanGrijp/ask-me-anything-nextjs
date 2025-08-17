'use client'

import { useQuery } from '@tanstack/react-query'
import { getRoom } from '@/src/http/get-room'

interface UseRoomProps {
  roomId: string
}

export function useRoom({ roomId }: UseRoomProps) {
  return useQuery({
    queryKey: ['room', roomId],
    queryFn: () => getRoom({ roomId }),
    enabled: !!roomId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}
