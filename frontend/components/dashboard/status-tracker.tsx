'use client'

import { motion } from 'framer-motion'
import { Search, UserCheck, Wrench, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { JobStatus } from '@/lib/store'

interface StatusTrackerProps {
  status: JobStatus
  className?: string
}

const steps = [
  { status: 'searching_dev', label: 'Buscando Dev', icon: Search },
  { status: 'in_progress', label: 'Em Progresso', icon: UserCheck },
  { status: 'validating', label: 'Validando', icon: Wrench },
  { status: 'completed', label: 'Concluído', icon: CheckCircle2 },
]

export function StatusTracker({ status, className }: StatusTrackerProps) {
  const statusOrder: JobStatus[] = ['open', 'searching_dev', 'in_progress', 'validating', 'completed']
  const currentIndex = statusOrder.indexOf(status)
  
  return (
    <div className={cn('w-full', className)}>
      <div className="relative flex items-center justify-between">
        {/* Progress Line */}
        <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-border" />
        <motion.div
          className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-primary"
          initial={{ width: '0%' }}
          animate={{ width: `${Math.max(0, (currentIndex - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Steps */}
        {steps.map((step, index) => {
          const stepIndex = statusOrder.indexOf(step.status as JobStatus)
          const isActive = stepIndex <= currentIndex
          const isCurrent = step.status === status
          
          return (
            <div key={step.status} className="relative z-10 flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: isCurrent ? 1.1 : 1 }}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
                  isActive
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground'
                )}
              >
                <step.icon className="h-5 w-5" />
              </motion.div>
              <span
                className={cn(
                  'mt-2 text-xs font-medium',
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
              
              {isCurrent && step.status !== 'completed' && (
                <motion.div
                  className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
