interface RemoveMessageReactionRequest {
  roomId: string
  messageId: string
}

interface RemoveMessageReactionResponse {
  count: number
}

export async function removeMessageReaction({ messageId, roomId }: RemoveMessageReactionRequest): Promise<RemoveMessageReactionResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL não está configurada')
  }

  const response = await fetch(`${apiUrl}/rooms/${roomId}/messages/${messageId}/react`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error('ID da sala ou mensagem inválido')
    }
    throw new Error(`Erro ao remover reação: ${response.status} - ${response.statusText}`)
  }

  const data: RemoveMessageReactionResponse = await response.json()
  return data
}