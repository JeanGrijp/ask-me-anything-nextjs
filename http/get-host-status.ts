import { getHostToken } from '@/utils/host-token'

export interface GetHostStatusResponse {
  is_host: boolean
  room_id: string
}

interface GetHostStatusRequest {
  roomId: string
}

export async function getHostStatus({ roomId }: GetHostStatusRequest): Promise<GetHostStatusResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL não está configurada')
  }

  const hostToken = getHostToken(roomId)
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (hostToken) {
    headers['X-Host-Token'] = hostToken
  }

  const response = await fetch(`${apiUrl}/rooms/${roomId}/host-status`, {
    method: 'GET',
    credentials: 'include',
    headers,
  })

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error('ID da sala inválido')
    }
    if (response.status === 401) {
      throw new Error('Nenhuma sessão ativa encontrada')
    }
    throw new Error(`Erro ao verificar status de host: ${response.status} - ${response.statusText}`)
  }

  const data: GetHostStatusResponse = await response.json()
  return data
}
