export type TaskType = 'Main Hall' | 'CR'

export interface CleaningAssignment {
  date: string
  group: number
  taskType: TaskType
}

export interface ChecklistItem {
  id: string
  task: string
  area?: string
}

export interface CleaningInstructions {
  taskType: TaskType
  estimatedTime: string
  supplies: string[]
  checklist: ChecklistItem[]
  notes?: string[]
}

export const cleaningInstructionsData: Record<TaskType, CleaningInstructions> = {
  'Main Hall': {
    taskType: 'Main Hall',
    estimatedTime: '45-60 minutes',
    supplies: [
      'Vacuum cleaner',
      'Microfiber cloths',
      'Glass cleaner',
      'All-purpose cleaner',
      'Dusting supplies',
      'Trash bags'
    ],
    checklist: [
      { id: 'mh-1', task: 'Empty all trash receptacles and replace liners', area: 'General' },
      { id: 'mh-2', task: 'Vacuum all carpeted areas thoroughly', area: 'Floors' },
      { id: 'mh-3', task: 'Dust all windowsills and ledges', area: 'Windows' },
      { id: 'mh-4', task: 'Clean all interior glass doors and windows', area: 'Windows' },
      { id: 'mh-5', task: 'Wipe down all door handles and light switches', area: 'Surfaces' },
      { id: 'mh-6', task: 'Clean and organize literature counter', area: 'Literature Area' },
      { id: 'mh-7', task: 'Dust and clean all chairs and seating areas', area: 'Seating' },
      { id: 'mh-8', task: 'Wipe down stage area and podium', area: 'Stage' },
      { id: 'mh-9', task: 'Clean entry foyer and remove any debris', area: 'Entry' },
      { id: 'mh-10', task: 'Check and refill paper towel dispensers', area: 'General' }
    ],
    notes: [
      'Please arrive 15 minutes early if possible',
      'Cleaning supplies are located in the utility closet',
      'Contact the coordinator if any supplies are running low',
      'Ensure all lights are turned off when finished'
    ]
  },
  'CR': {
    taskType: 'CR',
    estimatedTime: '30-45 minutes',
    supplies: [
      'Disinfectant cleaner',
      'Toilet bowl cleaner and brush',
      'Glass cleaner',
      'Paper towels',
      'Microfiber cloths',
      'Mop and bucket',
      'Trash bags'
    ],
    checklist: [
      { id: 'cr-1', task: 'Empty all trash receptacles and replace liners', area: 'General' },
      { id: 'cr-2', task: 'Clean and disinfect all toilets (bowl, seat, exterior)', area: 'Toilets' },
      { id: 'cr-3', task: 'Clean and disinfect all sinks and faucets', area: 'Sinks' },
      { id: 'cr-4', task: 'Clean mirrors with glass cleaner', area: 'Mirrors' },
      { id: 'cr-5', task: 'Wipe down all countertops and surfaces', area: 'Surfaces' },
      { id: 'cr-6', task: 'Refill soap dispensers, paper towels, and toilet paper', area: 'Supplies' },
      { id: 'cr-7', task: 'Clean and disinfect door handles and light switches', area: 'Surfaces' },
      { id: 'cr-8', task: 'Mop all floors with disinfectant', area: 'Floors' },
      { id: 'cr-9', task: 'Check for and clean any spots on walls or partitions', area: 'Walls' },
      { id: 'cr-10', task: 'Ensure all areas are dry and safe', area: 'General' }
    ],
    notes: [
      'Use disinfectant on all high-touch surfaces',
      'Cleaning supplies are located in the utility closet',
      'Report any plumbing issues or supply shortages immediately',
      'Ensure all lights are turned off and doors are secured when finished'
    ]
  }
}

const MAIN_HALL_ROTATION = [4, 6, 3, 5, 1, 2]
const CR_ROTATION = [5, 1, 2, 4, 6, 3]

function generateCleaningDates(): string[] {
  const dates: string[] = []
  const startDate = new Date('2026-01-01')
  const endDate = new Date('2026-12-31')
  
  let currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay()
    
    if (dayOfWeek === 0 || dayOfWeek === 4) {
      const dateStr = currentDate.toISOString().split('T')[0]
      dates.push(dateStr)
    }
    
    currentDate.setDate(currentDate.getDate() + 1)
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
