import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { GetRoomMessagesResponse } from "../http/get-room-messages"

interface useMessagesWebSocketsParams {
  roomId: string
}

type WebhookMessage =
  | { kind: "message_created"; value: { id: string, message: string } }
  | { kind: "message_answered"; value: { id: string } }
  | { kind: "message_reaction_increased"; value: { id: string; count: number } }
  | { kind: "message_reaction_decreased"; value: { id: string; count: number } }
  | { kind: "room_deleted"; value: { id: string; reason: string } };

export function useMessagesWebSockets({
  roomId,
}: useMessagesWebSocketsParams) {
  const queryClient = useQueryClient()
  const router = useRouter()

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
                  user_reacted: false,
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
              messages: state.messages.map((item: { id: string; text: string; amountOfReactions: number; answered: boolean, user_reacted: boolean }) => {
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
              messages: state.messages.map((item: { id: string; text: string; amountOfReactions: number; answered: boolean, user_reacted: boolean }) => {
                if (item.id === data.value.id) {
                  return { ...item, amountOfReactions: data.value.count }
                }

                return item
              }),
            }
          })

          break;
        case 'room_deleted':
          // Sala foi deletada pelo criador
          toast.error('Esta sala foi deletada pelo criador')
          
          // Invalidar queries relacionadas à sala
          queryClient.removeQueries({ queryKey: ['messages', roomId] })
          queryClient.invalidateQueries({ queryKey: ['rooms'] })
          
          // Redirecionar para a página de salas
          router.push('/')
          
          break;
      }
    }

    return () => {
      ws.close()
    }
  }, [roomId, queryClient, router])
}