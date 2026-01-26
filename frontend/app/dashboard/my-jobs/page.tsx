'use client'

import { motion } from 'framer-motion'
import { Wrench, CheckCircle2, Clock } from 'lucide-react'
import { Header } from '@/components/dashboard/header'
import { JobCard } from '@/components/dashboard/job-card'
import { useAppStore } from '@/lib/store'

export default function MyJobsPage() {
  const { currentUser, getDevJobs } = useAppStore()
  
  const myJobs = currentUser ? getDevJobs(currentUser.id) : []
  
  const activeJobs = myJobs.filter(j => j.status === 'in_progress' || j.status === 'validating')
  const completedJobs = myJobs.filter(j => j.status === 'completed')
  
  const totalEarnings = completedJobs.reduce((sum, job) => sum + (job.finalPrice || 0), 0)
  
  return (
    <div className="min-h-screen">
      <Header title="Meus Jobs" subtitle="Acompanhe seus trabalhos" />
      
      <div className="p-6">
        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Jobs Ativos</span>
              <Clock className="h-5 w-5 text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-foreground">{activeJobs.length}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Jobs Completos</span>
              <CheckCircle2 className="h-5 w-5 text-accent" />
            </div>
            <p className="text-2xl font-bold text-foreground">{completedJobs.length}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Ganho</span>
              <span className="text-primary font-semibold">R$</span>
            </div>
            <p className="text-2xl font-bold text-primary">{totalEarnings.toFixed(2)}</p>
          </motion.div>
        </div>
        
        {myJobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-12 text-center"
          >
            <Wrench className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-semibold text-foreground">Nenhum job ainda</h2>
            <p className="text-muted-foreground">Aceite uma corrida para começar a ganhar!</p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Active Jobs */}
            {activeJobs.length > 0 && (
              <section>
                <h2 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                  <span className="flex h-2 w-2 animate-pulse rounded-full bg-accent" />
                  Em Andamento ({activeJobs.length})
                </h2>
                <div className="space-y-4">
                  {activeJobs.map((job, i) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <JobCard job={job} variant="dev" />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
            
            {/* Completed Jobs */}
            {completedJobs.length > 0 && (
              <section>
                <h2 className="mb-4 font-semibold text-foreground">
                  Concluídos ({completedJobs.length})
                </h2>
                <div className="space-y-4">
                  {completedJobs.map((job, i) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <JobCard job={job} variant="dev" />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
