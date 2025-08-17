interface CreateRoomRequest {
  theme: string
}

export async function createRoom({ theme }: CreateRoomRequest) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL não está configurada')
  }

  const response = await fetch(`${apiUrl}/rooms`, {
    method: 'POST',
    credentials: 'include', // Importante: para incluir cookies de sessão
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      theme,
    })
  })

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error('Dados inválidos para criação da sala')
    }
    if (response.status === 408) {
      throw new Error('Timeout na criação da sala. Tente novamente.')
    }
    throw new Error(`Erro na API: ${response.status} - ${response.statusText}`)
  }

  const data: { id: string; host_token: string } = await response.json()

  return { 
    roomId: data.id,
    hostToken: data.host_token 
  }
}