export type TaskType = 'Main Hall' | 'CR'

export interface CleaningAssignment {
  date: string
  group: number
  taskType: TaskType
}

const MAIN_HALL_ROTATION = [4, 6, 3, 5, 1, 2]
const CR_ROTATION = [5, 1, 2, 4, 6, 3]

function generateCleaningDates(): string[] {
  const dates: string[] = []
  const startDate = new Date('2026-01-01')
  const endDate = new Date('2026-12-31')
  
  let currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0]
    dates.push(dateStr)
    currentDate.setDate(currentDate.getDate() + 7)
  }
  
  return dates
}

function generateSchedule(): CleaningAssignment[] {
  const dates = generateCleaningDates()
  const schedule: CleaningAssignment[] = []
  
  dates.forEach((date, index) => {
    const mainHallGroup = MAIN_HALL_ROTATION[index % MAIN_HALL_ROTATION.length]
    const crGroup = CR_ROTATION[index % CR_ROTATION.length]
    
    schedule.push({
      date,
      group: mainHallGroup,
      taskType: 'Main Hall'
    })
    
    schedule.push({
      date,
      group: crGroup,
      taskType: 'CR'
    })
  })
  
  return schedule.sort((a, b) => {
    const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime()
    if (dateCompare !== 0) return dateCompare
    return a.taskType === 'Main Hall' ? -1 : 1
  })
}

export const cleaningSchedule2026: CleaningAssignment[] = generateSchedule()

export function getAssignmentsForGroup(group: number): CleaningAssignment[] {
  return cleaningSchedule2026
    .filter(assignment => assignment.group === group)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export function getNextAssignment(group: number): CleaningAssignment | null {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const assignments = getAssignmentsForGroup(group)
  const upcoming = assignments.find(assignment => {
    const assignmentDate = new Date(assignment.date)
    assignmentDate.setHours(0, 0, 0, 0)
    return assignmentDate >= today
  })
  
  return upcoming || null
}

export function getDaysUntil(dateString: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const targetDate = new Date(dateString)
  targetDate.setHours(0, 0, 0, 0)
  
  const diffTime = targetDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatShortDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export function getDayOfWeek(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}

export function generateICS(group: number): string {
  const assignments = getAssignmentsForGroup(group)
  
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Kingdom Hall CleanSync//NONSGML v1.0//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Kingdom Hall Cleaning - Group ' + group,
    'X-WR-TIMEZONE:UTC',
  ]
  
  assignments.forEach(assignment => {
    const date = new Date(assignment.date)
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '')
    
    icsLines.push(
      'BEGIN:VEVENT',
      `DTSTART;VALUE=DATE:${dateStr}`,
      `DTEND;VALUE=DATE:${dateStr}`,
      `SUMMARY:Kingdom Hall Cleaning - ${assignment.taskType}`,
      `DESCRIPTION:Group ${group} cleaning assignment for ${assignment.taskType}`,
      `LOCATION:Kingdom Hall`,
      `UID:${assignment.date}-group${group}-${assignment.taskType.replace(' ', '')}@cleansync.local`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'END:VEVENT'
    )
  })
  
  icsLines.push('END:VCALENDAR')
  
  return icsLines.join('\r\n')
}

export function downloadICS(group: number): void {
  const icsContent = generateICS(group)
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `kingdom-hall-cleaning-group-${group}-2026.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}
