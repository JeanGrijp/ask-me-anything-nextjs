import { Skeleton } from "@/components/ui/skeleton"

export function RoomCardSkeleton() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          {/* Título da sala */}
          <Skeleton className="h-5 w-3/4 bg-zinc-800" />
          
          {/* ID da sala */}
          <Skeleton className="h-4 w-1/2 bg-zinc-800" />
          
          {/* Data de criação */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 bg-zinc-800" />
            <Skeleton className="h-4 w-32 bg-zinc-800" />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Ícone e texto "Sala" */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 bg-zinc-800" />
            <Skeleton className="h-4 w-8 bg-zinc-800" />
          </div>
          
          {/* Botão de deletar */}
          <Skeleton className="h-8 w-8 bg-zinc-800" />
        </div>
      </div>
    </div>
  )
}

export function RoomListSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-7 w-32 bg-zinc-800" /> {/* Título "Suas Salas" */}
      
      <div className="grid gap-4">
        {/* Renderizar 3 skeletons de salas */}
        {Array.from({ length: 3 }).map((_, index) => (
          <RoomCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}
