'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, DollarSign, AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Job } from '@/lib/store'

interface JobCardProps {
  job: Job
  variant?: 'client' | 'dev'
}

const statusConfig = {
  open: { label: 'Aberto', color: 'bg-primary text-primary-foreground', icon: AlertCircle },
  searching_dev: { label: 'Buscando Dev', color: 'bg-yellow-500/20 text-yellow-400', icon: Loader2 },
  in_progress: { label: 'Em Progresso', color: 'bg-accent/20 text-accent', icon: Loader2 },
  validating: { label: 'Validando', color: 'bg-blue-500/20 text-blue-400', icon: Loader2 },
  completed: { label: 'Concluído', color: 'bg-accent text-accent-foreground', icon: CheckCircle2 },
}

const complexityConfig = {
  Low: { color: 'text-accent', label: 'Baixa' },
  Medium: { color: 'text-yellow-400', label: 'Média' },
  High: { color: 'text-orange-400', label: 'Alta' },
  Critical: { color: 'text-destructive', label: 'Crítica' },
}

export function JobCard({ job, variant = 'client' }: JobCardProps) {
  const status = statusConfig[job.status]
  const complexity = job.aiAnalysis?.complexity ? complexityConfig[job.aiAnalysis.complexity] : null
  
  const timeAgo = getTimeAgo(job.createdAt)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge className={cn('text-xs', status.color)}>
              {status.label}
            </Badge>
            {complexity && (
              <span className={cn('text-xs font-medium', complexity.color)}>
                {complexity.label}
              </span>
            )}
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
          
          {/* Title */}
          <h3 className="mb-2 font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {job.title}
          </h3>
          
          {/* Description */}
          <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
            {job.description}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {job.tags.slice(0, 4).map(tag => (
              <span key={tag} className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                {tag}
              </span>
            ))}
            {job.tags.length > 4 && (
              <span className="text-xs text-muted-foreground">+{job.tags.length - 4}</span>
            )}
          </div>
        </div>
        
        {/* Price & Action */}
        <div className="flex flex-col items-end gap-3">
          <div className="text-right">
            <div className="flex items-center gap-1 text-lg font-bold text-primary">
              <DollarSign className="h-4 w-4" />
              R$ {job.finalPrice?.toFixed(2) || job.budgetOffer.toFixed(2)}
            </div>
            {job.aiAnalysis?.estimatedTime && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {job.aiAnalysis.estimatedTime}
              </div>
            )}
          </div>
          
          <Link href={job.status === 'in_progress' || job.status === 'validating' ? `/job/${job.id}/room` : `/job/${job.id}`}>
            <Button size="sm" variant={variant === 'dev' && job.status === 'open' ? 'default' : 'outline'} className="gap-1">
              {variant === 'dev' && job.status === 'open' ? 'Aplicar' : 'Ver'}
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Applicants count for open jobs */}
      {job.status === 'open' && job.applicants.length > 0 && (
        <div className="mt-3 border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">
            {job.applicants.length} dev{job.applicants.length > 1 ? 's' : ''} interessado{job.applicants.length > 1 ? 's' : ''}
          </span>
        </div>
      )}
    </motion.div>
  )
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days}d atrás`
  if (hours > 0) return `${hours}h atrás`
  if (minutes > 0) return `${minutes}min atrás`
  return 'Agora'
}
