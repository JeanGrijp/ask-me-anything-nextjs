interface CreateMessageReactionRequest {
  roomId: string
  messageId: string
}

interface CreateMessageReactionResponse {
  count: number
}

export async function createMessageReaction({ messageId, roomId }: CreateMessageReactionRequest): Promise<CreateMessageReactionResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL não está configurada')
  }

  const response = await fetch(`${apiUrl}/rooms/${roomId}/messages/${messageId}/react`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error('ID da sala ou mensagem inválido')
    }
    throw new Error(`Erro ao adicionar reação: ${response.status} - ${response.statusText}`)
  }

  const data: CreateMessageReactionResponse = await response.json()
  return data
}