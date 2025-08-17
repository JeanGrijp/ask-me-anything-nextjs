export interface GetRoomResponse {
  id: string
  theme: string
  created_at: string
}

interface GetRoomRequest {
  roomId: string
}

export async function getRoom({ roomId }: GetRoomRequest): Promise<GetRoomResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL não está configurada')
  }

  const response = await fetch(`${apiUrl}/rooms/${roomId}`, {
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
    if (response.status === 404) {
      throw new Error('Sala não encontrada')
    }
    throw new Error(`Erro ao buscar sala: ${response.status} - ${response.statusText}`)
  }

  const data: GetRoomResponse = await response.json()
  return data
}
