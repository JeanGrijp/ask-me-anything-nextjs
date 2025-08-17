interface CreateMessageRequest {
  roomId: string
  message: string
}

export async function createMessage({ roomId, message }: CreateMessageRequest) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL não está configurada')
  }

  const response = await fetch(`${apiUrl}/rooms/${roomId}/messages`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
    })
  })

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error('Dados inválidos para criação da mensagem')
    }
    throw new Error(`Erro ao criar mensagem: ${response.status} - ${response.statusText}`)
  }

  const data: { id: string } = await response.json()

  return { messageId: data.id }
}