import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { motion, AnimatePresence } from 'framer-motion'
import { toast, Toaster } from 'sonner'
import { 
  Broom, 
  Sparkle, 
  Heart, 
  Sun, 
  Drop,
  House,
  CalendarBlank,
  ArrowLeft
} from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  getAssignmentsForGroup, 
  getNextAssignment, 
  getDaysUntil,
  formatDate,
  formatShortDate,
  getDayOfWeek,
  downloadICS,
  type CleaningAssignment
} from '@/lib/scheduleData'

const cleaningIcons = [Broom, Drop, Sparkle, House]

function WelcomeView({ onSelectGroup }: { onSelectGroup: (group: number) => void }) {
  const [currentIconIndex, setCurrentIconIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIconIndex((prev) => (prev + 1) % cleaningIcons.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const CurrentIcon = cleaningIcons[currentIconIndex]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4 md:p-6"
    >
      <div className="max-w-4xl mx-auto space-y-8 pt-8">
        <div className="text-center space-y-4">
          <motion.div
            key={currentIconIndex}
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <CurrentIcon className="w-10 h-10 text-white" weight="duotone" />
            </div>
          </motion.div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
            Kingdom Hall Cleaning Schedule 2026
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Select your cleaning group to view your assignments and add them to your calendar
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[1, 2, 3, 4, 5, 6].map((group, index) => (
            <motion.div
              key={group}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
            >
              <Card
                className="p-6 cursor-pointer transition-all duration-150 hover:scale-102 hover:shadow-xl active:scale-98 border-2 border-slate-200 bg-white/80 backdrop-blur-lg"
                onClick={() => onSelectGroup(group)}
              >
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-blue-600">
                    {group}
                  </div>
                  <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                    Group {group}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function DashboardView({ group, onChangeGroup }: { group: number; onChangeGroup: () => void }) {
  const nextAssignment = getNextAssignment(group)
  const allAssignments = getAssignmentsForGroup(group)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcomingAssignments = allAssignments.filter(assignment => {
    const assignmentDate = new Date(assignment.date)
    assignmentDate.setHours(0, 0, 0, 0)
    return assignmentDate >= today
  })

  const pastAssignments = allAssignments.filter(assignment => {
    const assignmentDate = new Date(assignment.date)
    assignmentDate.setHours(0, 0, 0, 0)
    return assignmentDate < today
  })

  const handleExportCalendar = () => {
    try {
      downloadICS(group)
      toast.success('Calendar downloaded!', {
        description: 'Your cleaning schedule has been added to a calendar file.'
      })
    } catch (error) {
      toast.error('Download failed', {
        description: 'Please try again.'
      })
    }
  }

  const getProximityBadge = (dateString: string) => {
    const daysUntil = getDaysUntil(dateString)
    
    if (daysUntil === 0) {
      return (
        <Badge className="bg-red-500 text-white uppercase text-xs font-semibold tracking-wider animate-pulse-badge">
          Today!
        </Badge>
      )
    }
    
    if (daysUntil > 0 && daysUntil <= 3) {
      return (
        <Badge className="bg-amber-500 text-white uppercase text-xs font-semibold tracking-wider animate-pulse-badge">
          Coming Soon
        </Badge>
      )
    }
    
    return null
  }

  const getTaskBadge = (taskType: string) => {
    if (taskType === 'Main Hall') {
      return (
        <Badge className="bg-sky-500 text-white uppercase text-xs font-semibold tracking-wider">
          <House className="w-3 h-3 mr-1" weight="fill" />
          Main Hall
        </Badge>
      )
    }
    return (
      <Badge className="bg-emerald-500 text-white uppercase text-xs font-semibold tracking-wider">
        <Drop className="w-3 h-3 mr-1" weight="fill" />
        CR
      </Badge>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50"
    >
      <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-lg">
              {group}
            </div>
            <div>
              <h2 className="text-xl font-semibold">Group {group}</h2>
              <p className="text-sm text-blue-100">Your Schedule</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onChangeGroup}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border-0 transition-all duration-150 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Change Group
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 pb-20">
        {nextAssignment ? (
          <Card className="relative overflow-hidden border-0 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600" />
            
            <div className="absolute top-4 right-4 opacity-20">
              <Broom className="w-16 h-16 text-white animate-float" weight="duotone" />
            </div>
            <div className="absolute top-20 right-20 opacity-20">
              <Sparkle className="w-12 h-12 text-white animate-float-delay-1" weight="duotone" />
            </div>
            <div className="absolute bottom-4 right-12 opacity-20">
              <Heart className="w-10 h-10 text-white animate-float-delay-2" weight="fill" />
            </div>
            <div className="absolute bottom-12 left-12 opacity-20">
              <Sun className="w-14 h-14 text-white animate-float-delay-3" weight="duotone" />
            </div>

            <div className="relative p-6 md:p-8 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-xl font-semibold text-white">Next Up</h3>
                {getProximityBadge(nextAssignment.date)}
              </div>

              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-white">
                  {formatShortDate(nextAssignment.date)}
                </div>
                <div className="text-lg text-blue-100">
                  {formatDate(nextAssignment.date)}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getTaskBadge(nextAssignment.taskType)}
              </div>

              <Button
                onClick={handleExportCalendar}
                className="w-full md:w-auto bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-lg transition-all duration-150 active:scale-98"
              >
                <CalendarBlank className="w-5 h-5 mr-2" weight="duotone" />
                Add to My Calendar
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-8 text-center border-2 border-slate-200 bg-white/80 backdrop-blur-lg">
            <Sparkle className="w-16 h-16 mx-auto mb-4 text-blue-500" weight="duotone" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              All 2026 cleaning complete!
            </h3>
            <p className="text-slate-600">
              Thank you for your service.
            </p>
          </Card>
        )}

        {upcomingAssignments.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                Upcoming Assignments
              </h3>
            </div>

            <div className="relative pl-12 space-y-3">
              <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 to-slate-200" />

              {upcomingAssignments.map((assignment, index) => (
                <motion.div
                  key={`${assignment.date}-${assignment.taskType}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                  className="relative"
                >
                  <div className="absolute -left-12 top-5 w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
                    {assignment.taskType === 'Main Hall' ? (
                      <House className="w-6 h-6 text-white" weight="fill" />
                    ) : (
                      <Drop className="w-6 h-6 text-white" weight="fill" />
                    )}
                  </div>

                  <Card className="p-5 transition-all duration-150 hover:scale-102 hover:shadow-lg border-2 border-slate-200 bg-white/80 backdrop-blur-lg">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                          {getDayOfWeek(assignment.date)}
                        </div>
                        <div className="text-lg font-medium text-slate-800">
                          {formatShortDate(assignment.date)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTaskBadge(assignment.taskType)}
                        {getProximityBadge(assignment.date)}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {pastAssignments.length > 0 && (
          <div className="space-y-4 opacity-70">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-slate-400 to-slate-300 rounded-full" />
              <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                Past Assignments
              </h3>
            </div>

            <div className="relative pl-12 space-y-3">
              <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-slate-200" />

              {pastAssignments.slice(-5).map((assignment) => (
                <div
                  key={`${assignment.date}-${assignment.taskType}`}
                  className="relative"
                >
                  <div className="absolute -left-12 top-5 w-12 h-12 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center shadow-sm">
                    {assignment.taskType === 'Main Hall' ? (
                      <House className="w-6 h-6 text-white" weight="fill" />
                    ) : (
                      <Drop className="w-6 h-6 text-white" weight="fill" />
                    )}
                  </div>

                  <Card className="p-5 border border-slate-200 bg-white/60">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                          {getDayOfWeek(assignment.date)}
                        </div>
                        <div className="text-lg font-medium text-slate-600">
                          {formatShortDate(assignment.date)}
                        </div>
                      </div>
                      {getTaskBadge(assignment.taskType)}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function App() {
  const [selectedGroup, setSelectedGroup] = useKV<number | null>('selected-group', null)

  const handleSelectGroup = (group: number) => {
    setSelectedGroup(group)
  }

  const handleChangeGroup = () => {
    setSelectedGroup(null)
  }

  return (
    <>
      <Toaster position="bottom-center" />
      <AnimatePresence mode="wait">
        {selectedGroup === null || selectedGroup === undefined ? (
          <WelcomeView key="welcome" onSelectGroup={handleSelectGroup} />
        ) : (
          <DashboardView key="dashboard" group={selectedGroup} onChangeGroup={handleChangeGroup} />
        )}
      </AnimatePresence>
    </>
  )
}

export default App