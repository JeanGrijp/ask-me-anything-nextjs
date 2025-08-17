'use client'

import { useState, useEffect } from 'react'
import { Calendar, MessageSquare, Users, Trash2 } from 'lucide-react'
import { useUserRooms } from '@/hook/use-user-rooms'
import { useDeleteRoom } from '../src/hooks/use-delete-room'
import { useRouter } from 'next/navigation'
import { formatContextualDate, formatSmartDate } from '@/lib/date-utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function UserRoomsList() {
  const { data: rooms, isLoading, error } = useUserRooms()
  const deleteRoomMutation = useDeleteRoom()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [openPopover, setOpenPopover] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleDeleteRoom = async (e: React.MouseEvent, roomId: string) => {
    e.stopPropagation() // Impede que o clique abra a sala
    setOpenPopover(roomId) // Abre o popover para esta sala
  }

  const confirmDelete = (roomId: string) => {
    deleteRoomMutation.mutate({ roomId })
    setOpenPopover(null) // Fecha o popover
  }

  const cancelDelete = () => {
    setOpenPopover(null) // Fecha o popover
  }

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

               <span onClick={() => router.push(`/room/${room.id}`)} className="text-sm text-zinc-500 truncate">
                {
                  room.id
                }
               </span>

                <div className="flex items-center gap-4 mt-2 text-sm text-zinc-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="size-4" />
                    <span>
                      Criada em {isClient && room.created_at 
                        ? formatContextualDate(room.created_at) 
                        : 'Carregando...'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Users className="size-4" />
                  <span className="text-sm">Sala</span>
                </div>
                
                {/* Botão de deletar com Popover */}
                <Popover 
                  open={openPopover === room.id} 
                  onOpenChange={(open) => !open && setOpenPopover(null)}
                >
                  <PopoverTrigger asChild>
                    <button
                      onClick={(e) => handleDeleteRoom(e, room.id)}
                      disabled={deleteRoomMutation.isPending}
                      className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50"
                      title="Deletar sala"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-80 p-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <h4 className="font-medium text-zinc-100">Deletar sala</h4>
                        <p className="text-sm text-zinc-400">
                          Tem certeza que deseja deletar a sala "{room.theme}"? 
                          Esta ação não pode ser desfeita.
                        </p>
                      </div>
                      
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={cancelDelete}
                          className="px-3 py-2 text-sm bg-zinc-800 text-zinc-300 rounded-md hover:bg-zinc-700 transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => confirmDelete(room.id)}
                          disabled={deleteRoomMutation.isPending}
                          className="px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          {deleteRoomMutation.isPending ? 'Deletando...' : 'Deletar'}
                        </button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
