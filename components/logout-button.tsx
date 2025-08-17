'use client'

import { LogOut } from 'lucide-react'
import { useLogout } from '@/hook/use-logout'

export function LogoutButton() {
  const logout = useLogout()

  return (
    <button
      onClick={() => logout.mutate()}
      disabled={logout.isPending}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <LogOut className="size-4" />
      {logout.isPending ? 'Saindo...' : 'Sair'}
    </button>
  )
}
