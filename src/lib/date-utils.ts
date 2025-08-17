import { 
  format, 
  formatDistanceToNow, 
  isToday, 
  isYesterday, 
  isThisWeek, 
  isThisMonth,
  isThisYear,
  isPast,
  isFuture,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  isValid
} from 'date-fns'
import { ptBR } from 'date-fns/locale'

/**
 * Formata uma data de forma inteligente baseada em quão recente ela é
 */
export function formatSmartDate(dateInput: string | Date): string {
  // Verificação para hidratação SSR
  if (typeof window === 'undefined') {
    return 'Carregando...'
  }
  
  if (!dateInput) {
    return 'Sem data'
  }
  
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
    
    // Verificar se a data é válida usando date-fns
    if (!isValid(date)) {
      return 'Data inválida'
    }

    // Usar as funções do date-fns para verificação de tempo
    if (isToday(date)) {
      return `Hoje às ${format(date, 'HH:mm', { locale: ptBR })}`
    }
    
    if (isYesterday(date)) {
      return `Ontem às ${format(date, 'HH:mm', { locale: ptBR })}`
    }
    
    if (isThisWeek(date)) {
      return format(date, "EEEE 'às' HH:mm", { locale: ptBR })
    }
    
    if (isThisMonth(date)) {
      // Para este mês, mostra quantos dias atrás
      const daysAgo = differenceInDays(new Date(), date)
      return `${daysAgo} ${daysAgo === 1 ? 'dia' : 'dias'} atrás`
    }
    
    if (isThisYear(date)) {
      return format(date, "dd 'de' MMMM", { locale: ptBR })
    }
    
    // Para anos anteriores
    return format(date, "dd/MM/yyyy", { locale: ptBR })
    
  } catch (error) {
    return 'Erro na data'
  }
}

/**
 * Formata apenas a data (sem horário)
 */
export function formatDateOnly(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  
  if (!date || isNaN(date.getTime())) {
    return 'Data inválida'
  }
  
  return format(date, 'dd/MM/yyyy', { locale: ptBR })
}

/**
 * Formata apenas o horário
 */
export function formatTimeOnly(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  
  if (!date || isNaN(date.getTime())) {
    return 'Horário inválido'
  }
  
  return format(date, 'HH:mm', { locale: ptBR })
}

/**
 * Formata data e horário completos
 */
export function formatDateTime(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  
  if (!date || isNaN(date.getTime())) {
    return 'Data/hora inválida'
  }
  
  return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
}

/**
 * Formata tempo relativo (ex: "há 2 horas")
 */
export function formatRelativeTime(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  
  if (!isValid(date)) {
    return 'Data inválida'
  }
  
  return formatDistanceToNow(date, { 
    addSuffix: true, 
    locale: ptBR 
  })
}

/**
 * Verifica se uma data está no passado, presente ou futuro
 */
export function getTimeContext(dateInput: string | Date): 'past' | 'present' | 'future' {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  
  if (!isValid(date)) {
    return 'past' // fallback
  }
  
  if (isToday(date)) {
    return 'present'
  } else if (isPast(date)) {
    return 'past'
  } else {
    return 'future'
  }
}

/**
 * Calcula diferenças específicas de tempo
 */
export function getTimeDifference(dateInput: string | Date) {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  const now = new Date()
  
  if (!isValid(date)) {
    return null
  }
  
  return {
    seconds: differenceInSeconds(now, date),
    minutes: differenceInMinutes(now, date),
    hours: differenceInHours(now, date),
    days: differenceInDays(now, date),
    isInPast: isPast(date),
    isInFuture: isFuture(date),
    isToday: isToday(date),
    isYesterday: isYesterday(date),
    isThisWeek: isThisWeek(date),
    isThisMonth: isThisMonth(date),
    isThisYear: isThisYear(date)
  }
}

/**
 * Formata uma data com contexto inteligente
 */
export function formatContextualDate(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  
  if (!isValid(date)) {
    return 'Data inválida'
  }
  
  const context = getTimeContext(date)
  const diff = getTimeDifference(date)
  
  if (!diff) return 'Data inválida'
  
  if (context === 'future') {
    return `Em ${formatDistanceToNow(date, { locale: ptBR })}`
  }
  
  if (diff.seconds < 60) {
    return 'Agora mesmo'
  }
  
  if (diff.minutes < 60) {
    return `Há ${diff.minutes} ${diff.minutes === 1 ? 'minuto' : 'minutos'}`
  }
  
  if (diff.hours < 24 && isToday(date)) {
    return `Há ${diff.hours} ${diff.hours === 1 ? 'hora' : 'horas'}`
  }
  
  return formatSmartDate(date)
}
