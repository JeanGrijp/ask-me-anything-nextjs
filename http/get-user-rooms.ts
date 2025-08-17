export interface GetUserRoomsResponse {
  id: string
  theme: string
  created_at: string // API retorna em snake_case
}

export async function getUserRooms(): Promise<GetUserRoomsResponse[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL não está configurada')
  }

  const response = await fetch(`${apiUrl}/user/rooms`, {
    method: 'GET',
    credentials: 'include', // Importante: inclui cookies para autenticação
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Nenhuma sessão ativa encontrada')
    }
    throw new Error(`Erro ao buscar salas do usuário: ${response.status} - ${response.statusText}`)
  }

  const data: GetUserRoomsResponse[] = await response.json()
  return data
}
