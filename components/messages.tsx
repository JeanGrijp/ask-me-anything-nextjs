
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
    return b.amountOfReactions - a.amountOfReactions
  })

  console.log('Messages component - hostStatus:', hostStatus)
  console.log('Messages component - roomInfos:', roomInfos)

  return (
    <ol className="list-decimal list-outside px-3 space-y-8">
      {sortedMessages.map(message => {
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
          />
        )
      })}
    </ol>
  )
}