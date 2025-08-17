import { ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";

import { createMessageReaction } from "../http/create-message-reaction";
import { toast } from "sonner";
import { removeMessageReaction } from "../http/remove-message-reaction";
import { markMessageAsAnswered } from "../http/mark-message-as-answered";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

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
}: MessageProps) {
  const [hasReacted, setHasReacted] = useState(initialHasReacted)

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
    </li>
  )
}