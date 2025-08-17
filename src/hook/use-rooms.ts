'use client'

import { useQuery } from '@tanstack/react-query'
import { getRooms } from '@/src/http/get-rooms'

export function useRooms() {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: getRooms,
    staleTime: 2 * 60 * 1000, // 2 minutos
  })
}
