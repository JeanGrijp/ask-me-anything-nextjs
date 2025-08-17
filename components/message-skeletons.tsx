import { Skeleton } from "@/components/ui/skeleton"

export function MessageCardSkeleton() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-3">
      {/* Conteúdo da mensagem */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full bg-zinc-800" />
        <Skeleton className="h-4 w-3/4 bg-zinc-800" />
      </div>
      
      {/* Footer com reações e status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Botão de reação */}
          <div className="flex items-center gap-1">
            <Skeleton className="h-5 w-5 bg-zinc-800" />
            <Skeleton className="h-4 w-6 bg-zinc-800" />
          </div>
        </div>
        
        {/* Status/Badge */}
        <Skeleton className="h-6 w-20 bg-zinc-800" />
      </div>
    </div>
  )
}

export function MessageListSkeleton() {
  return (
    <div className="space-y-4">
      {/* Cabeçalho da lista */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32 bg-zinc-800" />
        <Skeleton className="h-8 w-8 bg-zinc-800" />
      </div>
      
      {/* Lista de mensagens */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <MessageCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}

export function CreateMessageFormSkeleton() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-4">
      {/* Título */}
      <Skeleton className="h-5 w-40 bg-zinc-800" />
      
      {/* Textarea */}
      <Skeleton className="h-24 w-full bg-zinc-800" />
      
      {/* Botão */}
      <Skeleton className="h-10 w-32 bg-zinc-800" />
    </div>
  )
}
