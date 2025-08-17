export interface GetRoomsResponse {
  id: string
  theme: string
  created_at: string
}

export async function getRooms(): Promise<GetRoomsResponse[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL não está configurada')
  }

  const response = await fetch(`${apiUrl}/rooms`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Erro ao buscar salas: ${response.status} - ${response.statusText}`)
  }

  const data: GetRoomsResponse[] = await response.json()
  return data
}
