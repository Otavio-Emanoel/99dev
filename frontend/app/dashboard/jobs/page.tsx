'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Filter, Search, SlidersHorizontal } from 'lucide-react'
import { Header } from '@/components/dashboard/header'
import { JobCard } from '@/components/dashboard/job-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/lib/store'

const filters = [
  { label: 'Todos', value: 'all' },
  { label: 'React', value: 'react' },
  { label: 'Next.js', value: 'nextjs' },
  { label: 'Node.js', value: 'nodejs' },
  { label: 'Python', value: 'python' },
  { label: 'CSS', value: 'css' },
]

export default function JobsFeedPage() {
  const { getOpenJobs } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  
  const openJobs = getOpenJobs()
  
  const filteredJobs = openJobs.filter(job => {
    const matchesSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = activeFilter === 'all' ||
      job.tags.some(tag => tag.toLowerCase().includes(activeFilter.toLowerCase()))
    
    return matchesSearch && matchesFilter
  })
  
  return (
    <div className="min-h-screen">
      <Header title="Corridas Disponíveis" subtitle="Encontre bugs para resolver e ganhe" />
      
      <div className="p-6">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por título ou descrição..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-secondary pl-9"
              />
            </div>
            <Button variant="outline" className="gap-2 sm:w-auto bg-transparent">
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
            </Button>
          </div>
          
          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.map(filter => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeFilter === filter.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Stats Banner */}
        <div className="mb-6 flex items-center justify-between rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{filteredJobs.length} corridas disponíveis</p>
              <p className="text-sm text-muted-foreground">Atualizando em tempo real</p>
            </div>
          </div>
          <span className="flex h-3 w-3 animate-pulse rounded-full bg-accent" />
        </div>
        
        {/* Jobs List */}
        {filteredJobs.length > 0 ? (
          <div className="space-y-4">
            {filteredJobs.map((job, i) => (
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
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-12 text-center"
          >
            <Filter className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="mb-2 text-lg font-semibold text-foreground">Nenhuma corrida encontrada</h2>
            <p className="text-muted-foreground">
              {searchQuery || activeFilter !== 'all'
                ? 'Tente ajustar seus filtros de busca'
                : 'Novas corridas aparecem a qualquer momento!'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
