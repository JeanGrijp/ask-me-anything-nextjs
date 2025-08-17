'use client'

import { Calendar, MessageSquare, Users } from 'lucide-react'
import { useUserRooms } from '@/hook/use-user-rooms'
import { useRouter } from 'next/navigation'
import { formatSmartDate } from '@/lib/date-utils'

export function UserRoomsList() {
  const { data: rooms, isLoading, error } = useUserRooms()
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-400">
        <p>Erro ao carregar suas salas: {error.message}</p>
      </div>
    )
  }

  if (!rooms || rooms.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-400">
        <MessageSquare className="size-12 mx-auto mb-4 opacity-50" />
        <p>Você ainda não criou nenhuma sala.</p>
        <p className="text-sm mt-2">Crie sua primeira sala para começar!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-zinc-100 mb-6">Suas Salas</h2>
      
      <div className="grid gap-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => router.push(`/room/${room.id}`)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-zinc-100 group-hover:text-orange-400 transition-colors">
                  {room.theme}
                </h3>
                
                <div className="flex items-center gap-4 mt-2 text-sm text-zinc-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="size-4" />
                    <span>Criada em {formatSmartDate(room.createdAt)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-zinc-400">
                <Users className="size-4" />
                <span className="text-sm">Sala</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
