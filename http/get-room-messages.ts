interface GetRoomMessagesRequest {
  roomId: string
}

export interface GetRoomMessagesResponse {
  messages: {
    id: string;
    text: string;
    amountOfReactions: number;
    answered: boolean;
    user_reacted: boolean;
  }[]
}

export async function getRoomMessages({ roomId }: GetRoomMessagesRequest): Promise<GetRoomMessagesResponse> {
  console.log('getRoomMessages called with roomId:', roomId, typeof roomId)
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL não está configurada')
  }

  const response = await fetch(`${apiUrl}/rooms/${roomId}/messages`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error('ID da sala inválido')
    }
    throw new Error(`Erro ao buscar mensagens: ${response.status} - ${response.statusText}`)
  }

  // Verificar se a resposta tem conteúdo
  const text = await response.text()
  if (!text) {
    return { messages: [] }
  }

  let data: Array<{
    id: string
    room_id: string
    message: string
    reaction_count: number
    answered: boolean
    user_reacted: boolean
  }>

  try {
    data = JSON.parse(text)
  } catch (error) {
    console.error('Erro ao fazer parse do JSON:', text)
    throw new Error('Resposta inválida do servidor')
  }

  // Se data for null ou undefined, retornar array vazio
  if (!data || !Array.isArray(data)) {
    return { messages: [] }
  }

  return {
    messages: data.map(item => {
      return {
        id: item.id,
        text: item.message,
        amountOfReactions: item.reaction_count,
        answered: item.answered,
        user_reacted: item.user_reacted,
      }
    })
  }
}