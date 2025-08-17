/**
 * Obtém o host token armazenado no localStorage para uma sala específica
 */
export function getHostToken(roomId: string): string | null {
  if (typeof window === 'undefined') {
    return null // SSR - não há localStorage no servidor
  }
  
  return localStorage.getItem(`host-token-${roomId}`)
}

/**
 * Armazena o host token no localStorage para uma sala específica
 */
export function setHostToken(roomId: string, hostToken: string): void {
  if (typeof window === 'undefined') {
    return // SSR - não há localStorage no servidor
  }
  
  localStorage.setItem(`host-token-${roomId}`, hostToken)
}

/**
 * Remove o host token do localStorage para uma sala específica
 */
export function removeHostToken(roomId: string): void {
  if (typeof window === 'undefined') {
    return // SSR - não há localStorage no servidor
  }
  
  localStorage.removeItem(`host-token-${roomId}`)
}

/**
 * Verifica se o usuário é host de uma sala específica (baseado no localStorage)
 */
export function isHost(roomId: string): boolean {
  return getHostToken(roomId) !== null
}
