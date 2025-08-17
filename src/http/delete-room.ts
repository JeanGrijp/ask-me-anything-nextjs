interface DeleteRoomRequest {
  roomId: string
}

export async function deleteRoom({ roomId }: DeleteRoomRequest): Promise<void> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${roomId}/`, {
    method: 'DELETE',
    credentials: 'include', // Importante para enviar cookies de sessão
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Você precisa estar logado para deletar uma sala')
    }
    
    if (response.status === 403) {
      throw new Error('Apenas o criador da sala pode deletá-la')
    }
    
    if (response.status === 404) {
      throw new Error('Sala não encontrada')
    }

    throw new Error('Erro interno do servidor')
  }

  // Status 204 - No Content, sala deletada com sucesso
}
