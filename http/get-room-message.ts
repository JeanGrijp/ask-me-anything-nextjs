export interface GetRoomMessageResponse {
  id: string
  room_id: string
  message: string
  reaction_count: number
  answered: boolean
  created_at: string
}

interface GetRoomMessageRequest {
  roomId: string
  messageId: string
}

export async function getRoomMessage({ roomId, messageId }: GetRoomMessageRequest): Promise<GetRoomMessageResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL não está configurada')
  }

  const response = await fetch(`${apiUrl}/rooms/${roomId}/messages/${messageId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error('ID da sala ou mensagem inválido')
    }
    if (response.status === 404) {
      throw new Error('Mensagem não encontrada')
    }
    throw new Error(`Erro ao buscar mensagem: ${response.status} - ${response.statusText}`)
  }

  const data: GetRoomMessageResponse = await response.json()
  return data
}
