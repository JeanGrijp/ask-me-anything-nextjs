interface MarkMessageAsAnsweredRequest {
  roomId: string
  messageId: string
}

export async function markMessageAsAnswered({ roomId, messageId }: MarkMessageAsAnsweredRequest): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL não está configurada')
  }

  const response = await fetch(`${apiUrl}/rooms/${roomId}/messages/${messageId}/answer`, {
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
    if (response.status === 401) {
      throw new Error('Você não tem permissão para marcar mensagens como respondidas')
    }
    if (response.status === 403) {
      throw new Error('Apenas o host da sala pode marcar mensagens como respondidas')
    }
    if (response.status === 404) {
      throw new Error('Sala ou mensagem não encontrada')
    }
    throw new Error(`Erro ao marcar mensagem como respondida: ${response.status} - ${response.statusText}`)
  }

  // PATCH retorna 200 OK em caso de sucesso (não 204)
}
