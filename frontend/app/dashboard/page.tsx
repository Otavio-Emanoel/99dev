'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Plus,
  Bug,
  CheckCircle2,
  Clock,
  DollarSign,
  TrendingUp,
  Zap,
  Star
} from 'lucide-react'
import { Header } from '@/components/dashboard/header'
import { JobCard } from '@/components/dashboard/job-card'
import { StatusTracker } from '@/components/dashboard/status-tracker'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'

export default function DashboardPage() {
  const { currentUser, jobs, getClientJobs, getOpenJobs, getDevJobs } = useAppStore()
  
  const isClient = currentUser?.role === 'client'
  
  // Client View
  if (isClient) {
    const clientJobs = currentUser ? getClientJobs(currentUser.id) : []
    const activeJob = clientJobs.find(j => j.status === 'in_progress' || j.status === 'searching_dev')
    const recentJobs = clientJobs.slice(0, 3)
    
    return (
      <div className="min-h-screen">
        <Header 
          title={`Olá, ${currentUser?.name.split(' ')[0]}!`} 
          subtitle="Como podemos ajudar hoje?"
        />
        
        <div className="p-6">
          {/* Active Job Status */}
          {activeJob && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 rounded-xl border border-primary/20 bg-card p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Job Ativo</h2>
                <Link href={`/job/${activeJob.id}`}>
                  <Button variant="outline" size="sm">Ver detalhes</Button>
                </Link>
              </div>
              <p className="mb-4 text-muted-foreground">{activeJob.title}</p>
              <StatusTracker status={activeJob.status} />
            </motion.div>
          )}
          
          {/* Quick Action - SOS Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Link href="/create-ticket">
              <div className="group relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-8 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
                <div className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:scale-110">
                  <Plus className="h-6 w-6" />
                </div>
                <Bug className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-2xl font-bold text-foreground">Pedir Socorro</h3>
                <p className="text-muted-foreground">Descreva seu bug e encontre um dev em minutos</p>
              </div>
            </Link>
          </motion.div>
          
          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Total de Tickets', value: clientJobs.length, icon: Bug, color: 'text-primary' },
              { label: 'Resolvidos', value: clientJobs.filter(j => j.status === 'completed').length, icon: CheckCircle2, color: 'text-accent' },
              { label: 'Em Progresso', value: clientJobs.filter(j => j.status === 'in_progress').length, icon: Clock, color: 'text-yellow-400' },
              { label: 'Saldo', value: `R$ ${currentUser?.balance?.toFixed(2) || '0.00'}`, icon: DollarSign, color: 'text-primary' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </motion.div>
            ))}
          </div>
          
          {/* Recent Jobs */}
          {recentJobs.length > 0 && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Meus Tickets Recentes</h2>
                <Link href="/dashboard/tickets">
                  <Button variant="ghost" size="sm">Ver todos</Button>
                </Link>
              </div>
              <div className="space-y-4">
                {recentJobs.map(job => (
                  <JobCard key={job.id} job={job} variant="client" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
  
  // Developer View
  const openJobs = getOpenJobs()
  const myJobs = currentUser ? getDevJobs(currentUser.id) : []
  
  return (
    <div className="min-h-screen">
      <Header 
        title={`Olá, ${currentUser?.name.split(' ')[0]}!`} 
        subtitle="Pronto para resolver bugs?"
      />
      
      <div className="p-6">
        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Corridas Disponíveis', value: openJobs.length, icon: Zap, color: 'text-primary' },
            { label: 'Jobs Completos', value: currentUser?.completedJobs || 0, icon: CheckCircle2, color: 'text-accent' },
            { label: 'Avaliação', value: currentUser?.rating?.toFixed(1) || '-', icon: Star, color: 'text-yellow-400' },
            { label: 'Ganhos', value: `R$ ${currentUser?.balance?.toFixed(2) || '0.00'}`, icon: TrendingUp, color: 'text-accent' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </motion.div>
          ))}
        </div>
        
        {/* Active Jobs */}
        {myJobs.filter(j => j.status === 'in_progress').length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Jobs Ativos</h2>
            </div>
            <div className="space-y-4">
              {myJobs
                .filter(j => j.status === 'in_progress')
                .map(job => (
                  <JobCard key={job.id} job={job} variant="dev" />
                ))}
            </div>
          </motion.div>
        )}
        
        {/* Available Jobs Feed */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground">Corridas Disponíveis</h2>
              <span className="flex h-2 w-2 animate-pulse rounded-full bg-accent" />
            </div>
            <Link href="/dashboard/jobs">
              <Button variant="ghost" size="sm">Ver todas</Button>
            </Link>
          </div>
          
          {openJobs.length > 0 ? (
            <div className="space-y-4">
              {openJobs.slice(0, 5).map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                >
                  <JobCard job={job} variant="dev" />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-8 text-center">
              <Clock className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">Nenhuma corrida disponível no momento</p>
              <p className="text-sm text-muted-foreground">Novas corridas aparecem a qualquer momento!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
