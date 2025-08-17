import { format, formatDistanceToNow, isToday, isYesterday, isThisWeek } from 'date-fns'
import { ptBR } from 'date-fns/locale'

/**
 * Formata uma data de forma inteligente baseada em quão recente ela é
 */
export function formatSmartDate(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  
  if (isToday(date)) {
    return `Hoje às ${format(date, 'HH:mm', { locale: ptBR })}`
  }
  
  if (isYesterday(date)) {
    return `Ontem às ${format(date, 'HH:mm', { locale: ptBR })}`
  }
  
  if (isThisWeek(date)) {
    return format(date, "EEEE 'às' HH:mm", { locale: ptBR })
  }
  
  // Se foi há menos de 30 dias, mostra formato relativo
  const daysDiff = Math.abs(new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  if (daysDiff < 30) {
    return formatDistanceToNow(date, { 
      addSuffix: true, 
      locale: ptBR 
    })
  }
  
  // Para datas mais antigas, mostra data completa
  return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
}

/**
 * Formata apenas a data (sem horário)
 */
export function formatDateOnly(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  return format(date, 'dd/MM/yyyy', { locale: ptBR })
}

/**
 * Formata apenas o horário
 */
export function formatTimeOnly(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  return format(date, 'HH:mm', { locale: ptBR })
}

/**
 * Formata data e horário completos
 */
export function formatDateTime(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
}

/**
 * Formata tempo relativo (ex: "há 2 horas")
 */
export function formatRelativeTime(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  return formatDistanceToNow(date, { 
    addSuffix: true, 
    locale: ptBR 
  })
}
