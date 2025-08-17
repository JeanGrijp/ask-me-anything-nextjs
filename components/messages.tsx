
import { useMessagesWebSockets } from "@/hook/use-messages-web-sockets";
import { Message } from "./message";
import { getRoomMessages } from "@/http/get-room-messages";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useParams } from "next/navigation";

export function Messages() {
  const { roomId } = useParams()

  if (!roomId || Array.isArray(roomId)) {
    throw new Error('Messages components must be used within room page')
  }

  const { data } = useSuspenseQuery({
    queryKey: ['messages', roomId],
    queryFn: () => getRoomMessages({ roomId }),
  })

  useMessagesWebSockets({ roomId })

  const sortedMessages = data.messages.sort((a, b) => {
    return b.amountOfReactions - a.amountOfReactions
  })

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
          />
        )
      })}
    </ol>
  )
}