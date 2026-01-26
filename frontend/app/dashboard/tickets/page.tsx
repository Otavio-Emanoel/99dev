'use client'

import { motion } from 'framer-motion'
import { Bug, Plus, Filter } from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/components/dashboard/header'
import { JobCard } from '@/components/dashboard/job-card'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/lib/store'

export default function TicketsPage() {
  const { currentUser, getClientJobs } = useAppStore()
  
  const tickets = currentUser ? getClientJobs(currentUser.id) : []
  
  const openTickets = tickets.filter(t => t.status === 'open')
  const activeTickets = tickets.filter(t => t.status === 'in_progress' || t.status === 'searching_dev' || t.status === 'validating')
  const completedTickets = tickets.filter(t => t.status === 'completed')
  
  return (
    <div className="min-h-screen">
      <Header title="Meus Tickets" subtitle="Gerencie seus pedidos de ajuda" />
      
      <div className="p-6">
        {/* Quick Action */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Bug className="h-4 w-4" />
            {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} no total
          </div>
          
          <Link href="/create-ticket">
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              Novo Pedido de Socorro
            </Button>
          </Link>
        </div>
        
        {tickets.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-12 text-center"
          >
            <Bug className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-semibold text-foreground">Nenhum ticket ainda</h2>
            <p className="mb-6 text-muted-foreground">Crie seu primeiro pedido de socorro para encontrar um dev</p>
            <Link href="/create-ticket">
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Criar Ticket
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Active Tickets */}
            {activeTickets.length > 0 && (
              <section>
                <h2 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                  <span className="flex h-2 w-2 animate-pulse rounded-full bg-accent" />
                  Em Andamento ({activeTickets.length})
                </h2>
                <div className="space-y-4">
                  {activeTickets.map((ticket, i) => (
                    <motion.div
                      key={ticket.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <JobCard job={ticket} variant="client" />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
            
            {/* Open Tickets */}
            {openTickets.length > 0 && (
              <section>
                <h2 className="mb-4 font-semibold text-foreground">
                  Aguardando Dev ({openTickets.length})
                </h2>
                <div className="space-y-4">
                  {openTickets.map((ticket, i) => (
                    <motion.div
                      key={ticket.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <JobCard job={ticket} variant="client" />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
            
            {/* Completed Tickets */}
            {completedTickets.length > 0 && (
              <section>
                <h2 className="mb-4 font-semibold text-foreground">
                  Concluídos ({completedTickets.length})
                </h2>
                <div className="space-y-4">
                  {completedTickets.map((ticket, i) => (
                    <motion.div
                      key={ticket.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <JobCard job={ticket} variant="client" />
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
