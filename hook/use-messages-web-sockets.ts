import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import type { GetRoomMessagesResponse } from "../http/get-room-messages"

interface useMessagesWebSocketsParams {
  roomId: string
}

type WebhookMessage =
  | { kind: "message_created"; value: { id: string, message: string } }
  | { kind: "message_answered"; value: { id: string } }
  | { kind: "message_reaction_increased"; value: { id: string; count: number } }
  | { kind: "message_reaction_decreased"; value: { id: string; count: number } };

export function useMessagesWebSockets({
  roomId,
}: useMessagesWebSocketsParams) {
  const queryClient = useQueryClient()

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL
    
    if (!wsUrl) {
      console.error('NEXT_PUBLIC_WS_URL não está configurada')
      return
    }

    const ws = new WebSocket(`${wsUrl}/subscribe/${roomId}`)

    ws.onopen = () => {
      console.log('Websocket connected!')
    }

    ws.onclose = () => {
      console.log('Websocket connection closed!')
    }

    ws.onmessage = (event) => {
      const data: WebhookMessage = JSON.parse(event.data)

      switch(data.kind) {
        case 'message_created':
          queryClient.setQueryData<GetRoomMessagesResponse>(['messages', roomId], (state: GetRoomMessagesResponse | undefined) => {
            return {
              messages: [
                ...(state?.messages ?? []),
                {
                  id: data.value.id,
                  text: data.value.message,
                  amountOfReactions: 0,
                  answered: false,
                }
              ],
            }
          })

          break;
        case 'message_answered':
          queryClient.setQueryData<GetRoomMessagesResponse>(['messages', roomId], (state: GetRoomMessagesResponse | undefined) => {
            if (!state) {
              return undefined
            }

            return {
              messages: state.messages.map((item: { id: string; text: string; amountOfReactions: number; answered: boolean }) => {
                if (item.id === data.value.id) {
                  return { ...item, answered: true }
                }

                return item
              }),
            }
          })

          break;
        case 'message_reaction_increased':
        case 'message_reaction_decreased':
          queryClient.setQueryData<GetRoomMessagesResponse>(['messages', roomId], (state: GetRoomMessagesResponse | undefined) => {
            if (!state) {
              return undefined
            }

            return {
              messages: state.messages.map((item: { id: string; text: string; amountOfReactions: number; answered: boolean }) => {
                if (item.id === data.value.id) {
                  return { ...item, amountOfReactions: data.value.count }
                }

                return item
              }),
            }
          })

          break;
      }
    }

    return () => {
      ws.close()
    }
  }, [roomId, queryClient])
}