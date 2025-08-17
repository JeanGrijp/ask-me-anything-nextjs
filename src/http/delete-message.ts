interface DeleteMessageRequest {
  messageId: string
  roomId: string
}

export async function deleteMessage({ messageId, roomId }: DeleteMessageRequest): Promise<void> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}/messages/${messageId}`, {
    method: 'DELETE',
    credentials: 'include', // Importante para enviar cookies de sessão
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Você precisa estar logado para deletar uma mensagem')
    }
    
    if (response.status === 403) {
      throw new Error('Você só pode deletar suas próprias mensagens')
    }
    
    if (response.status === 404) {
      throw new Error('Mensagem não encontrada')
    }

    throw new Error('Erro interno do servidor')
  }

  // Status 204 - No Content, mensagem deletada com sucesso
}
