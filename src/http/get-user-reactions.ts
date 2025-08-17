interface GetUserReactionsRequest {
  roomId: string
}

interface GetUserReactionsResponse {
  reactions: Array<{
    id: string
    message_id: string
  }>
}

export async function getUserReactions({ roomId }: GetUserReactionsRequest): Promise<GetUserReactionsResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL não está configurada')
  }

  console.log('getUserReactions called with roomId:', roomId, typeof roomId)

  const response = await fetch(`${apiUrl}/rooms/${roomId}/messages/reactions`, {
    method: 'GET',
    credentials: 'include', // Importante: para incluir cookies de sessão
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error('ID da sala inválido')
    }
    if (response.status === 404) {
      throw new Error('Sala não encontrada')
    }
    throw new Error(`Erro ao buscar reações: ${response.status} - ${response.statusText}`)
  }

  const data = await response.json()
  return data
}
