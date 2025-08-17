
import { useMessagesWebSockets } from "@/hook/use-messages-web-sockets";
import { Message } from "./message";
import { getRoomMessages } from "@/http/get-room-messages";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useUserReactions } from "@/hook/use-user-reactions";
import { useHostStatus } from "@/hook/use-host-status";
import { useRoom } from "@/hook/use-room";

interface MessagesProps {
  roomId: string
}

export function Messages({ roomId }: MessagesProps) {
  console.log('Messages component - roomId:', roomId, typeof roomId)

  const { data } = useSuspenseQuery({
    queryKey: ['messages', roomId],
    queryFn: () => getRoomMessages({ roomId }),
  })

  const {data: hostStatus} = useHostStatus({roomId})
  const {data: roomInfos} = useRoom({roomId})
  const { hasReacted, addReaction, removeReaction } = useUserReactions({ roomId })

  useMessagesWebSockets({ roomId })

  const sortedMessages = data.messages.sort((a, b) => {
    // Primeiro critério: mensagens não respondidas vêm antes das respondidas
    if (a.answered !== b.answered) {
      return a.answered ? 1 : -1 // não respondidas (false) vêm primeiro
    }
    
    // Segundo critério: dentro do mesmo grupo (respondidas ou não), ordenar por reações
    return b.amountOfReactions - a.amountOfReactions
  })

  // Separar mensagens para adicionar divisor visual
  const unansweredMessages = sortedMessages.filter(message => !message.answered)
  const answeredMessages = sortedMessages.filter(message => message.answered)

  console.log('Messages component - hostStatus:', hostStatus)
  console.log('Messages component - roomInfos:', roomInfos)

  return (
    <div className="px-3 space-y-8">
      {/* Mensagens não respondidas */}
      {unansweredMessages.length > 0 && (
        <ol className="list-decimal list-outside space-y-8">
          {unansweredMessages.map(message => {
            return (
              <Message 
                key={message.id}
                id={message.id}
                text={message.text}
                amountOfReactions={message.amountOfReactions} 
                answered={message.answered}
                roomId={roomId}
                hasUserReacted={hasReacted(message.id)}
                onReactionAdd={() => addReaction(message.id)}
                onReactionRemove={() => removeReaction(message.id)}
                isHost={hostStatus?.is_host || false}
                isUserMessage={message.is_user_message}
              />
            )
          })}
        </ol>
      )}

      {/* Separador visual quando há mensagens respondidas */}
      {unansweredMessages.length > 0 && answeredMessages.length > 0 && (
        <div className="flex items-center gap-4 py-6">
          <div className="flex-1 h-px bg-zinc-800"></div>
          <span className="text-sm text-zinc-500 font-medium">Perguntas Respondidas</span>
          <div className="flex-1 h-px bg-zinc-800"></div>
        </div>
      )}

      {/* Mensagens respondidas */}
      {answeredMessages.length > 0 && (
        <ol className="list-decimal list-outside space-y-8" start={unansweredMessages.length + 1}>
          {answeredMessages.map(message => {
            return (
              <Message 
                key={message.id}
                id={message.id}
                text={message.text}
                amountOfReactions={message.amountOfReactions} 
                answered={message.answered}
                roomId={roomId}
                hasUserReacted={hasReacted(message.id)}
                onReactionAdd={() => addReaction(message.id)}
                onReactionRemove={() => removeReaction(message.id)}
                isHost={hostStatus?.is_host || false}
                isUserMessage={message.is_user_message}
              />
            )
          })}
        </ol>
      )}
    </div>
  )
}