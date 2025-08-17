


export async function logoutUser() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL não está configurada')
  }

  const response = await fetch(`${apiUrl}/user/logout`, {
    method: 'DELETE',
    credentials: 'include', // Importante: inclui cookies automaticamente
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // O backend retorna 204 (No Content) em caso de sucesso
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Nenhuma sessão ativa encontrada')
    }
    throw new Error(`Erro ao fazer logout: ${response.status} - ${response.statusText}`)
  }

  // Sucesso - sessão removida do servidor e cookie limpo
  return true
}