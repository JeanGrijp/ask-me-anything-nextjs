import { Skeleton } from "@/components/ui/skeleton"

export function CreateRoomFormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Logo */}
      <div className="text-center">
        <Skeleton className="h-10 w-24 mx-auto bg-zinc-800" />
      </div>

      {/* Título */}
      <div className="text-center space-y-2">
        <Skeleton className="h-8 w-48 mx-auto bg-zinc-800" />
        <Skeleton className="h-5 w-64 mx-auto bg-zinc-800" />
      </div>

      {/* Formulário */}
      <div className="space-y-4">
        {/* Label do input */}
        <Skeleton className="h-4 w-32 bg-zinc-800" />
        
        {/* Input */}
        <Skeleton className="h-12 w-full bg-zinc-800" />
        
        {/* Botão */}
        <Skeleton className="h-12 w-full bg-zinc-800" />
      </div>
    </div>
  )
}
