import { ArrowUp, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

import { createMessageReaction } from "../http/create-message-reaction";
import { toast } from "sonner";
import { removeMessageReaction } from "../http/remove-message-reaction";
import { markMessageAsAnswered } from "../http/mark-message-as-answered";
import { useDeleteMessage } from "../src/hooks/use-delete-message";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

interface MessageProps {
  id: string
  text: string
  amountOfReactions: number
  answered?: boolean
  roomId: string
  hasUserReacted: boolean
  onReactionAdd: () => void
  onReactionRemove: () => void
  isHost?: boolean
  isUserMessage?: boolean // Nova prop para indicar se é mensagem do usuário
}

export function Message({ 
  id: messageId, 
  text, 
  amountOfReactions, 
  answered = false,
  roomId,
  hasUserReacted: initialHasReacted,
  onReactionAdd,
  onReactionRemove,
  isHost = false,
  isUserMessage = false,
}: MessageProps) {
  const [hasReacted, setHasReacted] = useState(initialHasReacted)
  const [openDeletePopover, setOpenDeletePopover] = useState(false)
  const deleteMessageMutation = useDeleteMessage()

  // Sincroniza o estado local com a prop quando ela mudar
  useEffect(() => {
    setHasReacted(initialHasReacted)
  }, [initialHasReacted])

  async function createMessageReactionAction() {
    try {
      await createMessageReaction({ messageId, roomId })
      setHasReacted(true)
      onReactionAdd()
    } catch {
      toast.error('Falha ao reagir mensagem, tente novamente!')
    }
  }

  async function removeMessageReactionAction() {
    try {
      await removeMessageReaction({ messageId, roomId })
      setHasReacted(false)
      onReactionRemove()
    } catch {
      toast.error('Falha ao remover reação, tente novamente!')
    }
  }

  async function handleMarkAsAnswered() {
    try {
      await markMessageAsAnswered({ messageId, roomId })
      toast.success('Mensagem marcada como respondida!')
    } catch {
      toast.error('Falha ao marcar mensagem como respondida!')
    }
  }

  function handleDeleteMessage() {
    deleteMessageMutation.mutate({ messageId, roomId })
    setOpenDeletePopover(false)
  }

  return (
    <li data-answered={answered} className="ml-4 leading-relaxed text-zinc-100 data-[answered=true]:opacity-50 data-[answered=true]:pointer-events-none">
      {text}

      {hasReacted ? (
        <button 
          type="button" 
          onClick={removeMessageReactionAction} 
          className="mt-3 flex items-center gap-2 text-orange-400 text-sm font-medium hover:text-orange-500"
        >
          <ArrowUp className="size-4" />
          Curtir pergunta ({amountOfReactions})
        </button>
      ) : (
        <button 
          type="button" 
          onClick={createMessageReactionAction} 
          className="mt-3 flex items-center gap-2 text-zinc-400 text-sm font-medium hover:text-zinc-300"
        >
          <ArrowUp className="size-4" />
          Curtir pergunta ({amountOfReactions})
        </button>
      )}
      {isHost && !answered && (
        <div className="flex items-center gap-2 mt-3">
          <Switch 
            id={`answered-${messageId}`} 
            onCheckedChange={handleMarkAsAnswered}
          />
          <Label htmlFor={`answered-${messageId}`}>Marcar como respondida</Label>
        </div>
      )}

      {/* Botão de deletar para o criador da mensagem */}
      {isUserMessage && !answered && (
        <div className="mt-3">
          <Popover open={openDeletePopover} onOpenChange={setOpenDeletePopover}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 text-red-400 text-sm font-medium hover:text-red-500 transition-colors"
                disabled={deleteMessageMutation.isPending}
              >
                <Trash2 className="size-4" />
                Deletar mensagem
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-zinc-100">Deletar mensagem</h4>
                  <p className="text-sm text-zinc-400">
                    Tem certeza que deseja deletar esta mensagem? Esta ação não pode ser desfeita.
                  </p>
                </div>
                
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setOpenDeletePopover(false)}
                    className="px-3 py-2 text-sm bg-zinc-800 text-zinc-300 rounded-md hover:bg-zinc-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteMessage}
                    disabled={deleteMessageMutation.isPending}
                    className="px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {deleteMessageMutation.isPending ? 'Deletando...' : 'Deletar'}
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </li>
  )
}