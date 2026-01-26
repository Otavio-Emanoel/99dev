'use client'

import React from "react"

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Clock,
  DollarSign,
  User,
  Star,
  MessageSquare,
  CheckCircle2,
  X,
  Code,
  AlertCircle,
  Sparkles,
  Loader2,
  Handshake
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { StatusTracker } from '@/components/dashboard/status-tracker'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { currentUser, getJobById, getUserById, applyToJob, acceptOffer, updateJobStatus, isAuthenticated } = useAppStore()
  
  const [job, setJob] = useState(getJobById(id))
  const [offerAmount, setOfferAmount] = useState('')
  const [offerMessage, setOfferMessage] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [showHandshake, setShowHandshake] = useState(false)
  
  const isClient = currentUser?.role === 'client'
  const isDev = currentUser?.role === 'developer'
  const isOwner = job?.clientId === currentUser?.id
  const hasApplied = job?.applicants.some(a => a.devId === currentUser?.id)
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])
  
  useEffect(() => {
    setJob(getJobById(id))
  }, [id, getJobById])
  
  if (!job) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">Job não encontrado</p>
          <Link href="/dashboard">
            <Button className="mt-4">Voltar ao Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }
  
  const client = getUserById(job.clientId)
  const developer = job.developerId ? getUserById(job.developerId) : null
  
  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsApplying(true)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    applyToJob(job.id, currentUser?.id || 'dev_01', parseFloat(offerAmount) || job.budgetOffer, offerMessage)
    setJob(getJobById(id))
    setShowApplyForm(false)
    setIsApplying(false)
  }
  
  const handleAcceptOffer = async (devId: string) => {
    setShowHandshake(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    acceptOffer(job.id, devId)
    setJob(getJobById(id))
    setShowHandshake(false)
    router.push(`/job/${job.id}/room`)
  }
  
  const complexityColors = {
    Low: 'text-accent',
    Medium: 'text-yellow-400',
    High: 'text-orange-400',
    Critical: 'text-destructive'
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Handshake Animation Overlay */}
      <AnimatePresence>
        {showHandshake && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-accent"
              >
                <Handshake className="h-12 w-12 text-accent-foreground" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-2xl font-bold text-foreground"
              >
                Match feito!
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-2 text-muted-foreground"
              >
                Entrando na sala de resolução...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          
          {job.status !== 'open' && job.status !== 'completed' && (
            <Link href={`/job/${job.id}/room`}>
              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Ir para Sala
              </Button>
            </Link>
          )}
        </div>
      </header>
      
      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Status Tracker for active jobs */}
        {job.status !== 'open' && job.status !== 'completed' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-xl border border-primary/20 bg-card p-6"
          >
            <StatusTracker status={job.status} />
          </motion.div>
        )}
        
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge className={cn(
                  'text-xs',
                  job.status === 'open' ? 'bg-primary text-primary-foreground' :
                  job.status === 'completed' ? 'bg-accent text-accent-foreground' :
                  'bg-yellow-500/20 text-yellow-400'
                )}>
                  {job.status === 'open' ? 'Aberto' :
                   job.status === 'completed' ? 'Concluído' :
                   job.status === 'in_progress' ? 'Em Progresso' :
                   job.status === 'searching_dev' ? 'Buscando Dev' : 'Validando'}
                </Badge>
                {job.aiAnalysis?.complexity && (
                  <span className={cn('text-xs font-medium', complexityColors[job.aiAnalysis.complexity])}>
                    Complexidade: {job.aiAnalysis.complexity}
                  </span>
                )}
              </div>
              
              <h1 className="mb-4 text-2xl font-bold text-foreground">{job.title}</h1>
              
              <p className="mb-6 text-muted-foreground whitespace-pre-wrap">{job.description}</p>
              
              {/* Tags */}
              <div className="mb-6 flex flex-wrap gap-2">
                {job.tags.map(tag => (
                  <span key={tag} className="rounded-lg bg-secondary px-3 py-1 text-sm text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
              
              {/* Code Snippet */}
              {job.codeSnippet && (
                <div className="rounded-lg border border-border bg-secondary p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Code className="h-4 w-4" />
                    Código
                  </div>
                  <pre className="overflow-x-auto text-sm text-foreground">
                    <code>{job.codeSnippet}</code>
                  </pre>
                </div>
              )}
            </motion.div>
            
            {/* AI Analysis */}
            {job.aiAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl border border-border bg-card p-6"
              >
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold text-foreground">Análise IA</h2>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg bg-secondary p-3">
                    <span className="text-xs text-muted-foreground">Tempo Estimado</span>
                    <p className="mt-1 font-medium text-foreground">{job.aiAnalysis.estimatedTime}</p>
                  </div>
                  <div className="rounded-lg bg-secondary p-3">
                    <span className="text-xs text-muted-foreground">Preço Sugerido</span>
                    <p className="mt-1 font-medium text-primary">
                      R$ {job.aiAnalysis.estimatedPrice.min} - {job.aiAnalysis.estimatedPrice.max}
                    </p>
                  </div>
                  <div className="rounded-lg bg-secondary p-3">
                    <span className="text-xs text-muted-foreground">Complexidade</span>
                    <p className={cn('mt-1 font-medium', complexityColors[job.aiAnalysis.complexity])}>
                      {job.aiAnalysis.complexity}
                    </p>
                  </div>
                </div>
                
                <p className="mt-4 text-sm text-muted-foreground">{job.aiAnalysis.summary}</p>
              </motion.div>
            )}
            
            {/* Applicants (Client View) */}
            {isOwner && job.status === 'open' && job.applicants.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl border border-border bg-card p-6"
              >
                <h2 className="mb-4 font-semibold text-foreground">
                  Propostas ({job.applicants.length})
                </h2>
                
                <div className="space-y-4">
                  {job.applicants.map(applicant => {
                    const dev = getUserById(applicant.devId)
                    return (
                      <div key={applicant.devId} className="rounded-lg border border-border bg-secondary p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent">
                              {dev?.name.charAt(0) || 'D'}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{dev?.name || 'Dev'}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Star className="h-3 w-3 text-yellow-400" />
                                {dev?.rating || 4.5}
                                <span className="mx-1">•</span>
                                {dev?.completedJobs || 0} jobs
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">
                              R$ {applicant.offerAmount.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        
                        {applicant.message && (
                          <p className="mt-3 text-sm text-muted-foreground">{applicant.message}</p>
                        )}
                        
                        <div className="mt-4 flex gap-2">
                          <Button
                            onClick={() => handleAcceptOffer(applicant.devId)}
                            className="flex-1 gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Aceitar
                          </Button>
                          <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                            <MessageSquare className="h-4 w-4" />
                            Chat
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}
            
            {/* Apply Form (Dev View) */}
            {isDev && job.status === 'open' && !hasApplied && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl border border-primary/30 bg-card p-6"
              >
                {!showApplyForm ? (
                  <div className="text-center">
                    <h2 className="mb-2 text-lg font-semibold text-foreground">Quer resolver este bug?</h2>
                    <p className="mb-4 text-sm text-muted-foreground">Envie sua proposta para o cliente</p>
                    <Button
                      onClick={() => setShowApplyForm(true)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Fazer Proposta
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="font-semibold text-foreground">Sua Proposta</h2>
                      <button
                        type="button"
                        onClick={() => setShowApplyForm(false)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div>
                      <label className="mb-2 block text-sm text-muted-foreground">Seu preço (R$)</label>
                      <Input
                        type="number"
                        value={offerAmount}
                        onChange={(e) => setOfferAmount(e.target.value)}
                        placeholder={job.budgetOffer.toString()}
                        className="bg-secondary"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Cliente ofereceu: R$ {job.budgetOffer.toFixed(2)}
                      </p>
                    </div>
                    
                    <div>
                      <label className="mb-2 block text-sm text-muted-foreground">Mensagem para o cliente</label>
                      <Textarea
                        value={offerMessage}
                        onChange={(e) => setOfferMessage(e.target.value)}
                        placeholder="Ex: Tenho experiência com esse tipo de erro e posso resolver rapidamente..."
                        className="resize-none bg-secondary"
                        rows={3}
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      disabled={isApplying}
                    >
                      {isApplying ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        'Enviar Proposta'
                      )}
                    </Button>
                  </form>
                )}
              </motion.div>
            )}
            
            {/* Already Applied */}
            {isDev && hasApplied && (
              <div className="rounded-xl border border-accent/30 bg-accent/10 p-6 text-center">
                <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-accent" />
                <p className="font-medium text-foreground">Proposta enviada!</p>
                <p className="mt-1 text-sm text-muted-foreground">Aguardando resposta do cliente</p>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  {job.finalPrice ? 'Preço Final' : 'Orçamento'}
                </span>
              </div>
              <p className="text-3xl font-bold text-primary">
                R$ {(job.finalPrice || job.budgetOffer).toFixed(2)}
              </p>
              {job.aiAnalysis?.estimatedTime && (
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {job.aiAnalysis.estimatedTime}
                </div>
              )}
            </motion.div>
            
            {/* Client Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-border bg-card p-6"
            >
              <h3 className="mb-4 text-sm font-medium text-muted-foreground">Cliente</h3>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-foreground">
                  {client?.name.charAt(0) || 'C'}
                </div>
                <div>
                  <p className="font-medium text-foreground">{client?.name || 'Cliente'}</p>
                  <p className="text-xs text-muted-foreground">Membro desde 2024</p>
                </div>
              </div>
            </motion.div>
            
            {/* Developer Info (if assigned) */}
            {developer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-xl border border-accent/30 bg-card p-6"
              >
                <h3 className="mb-4 text-sm font-medium text-muted-foreground">Desenvolvedor</h3>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-accent">
                    {developer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{developer.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 text-yellow-400" />
                      {developer.rating} • {developer.completedJobs} jobs
                    </div>
                  </div>
                </div>
                {developer.stack && (
                  <div className="mt-4 flex flex-wrap gap-1">
                    {developer.stack.slice(0, 4).map(tech => (
                      <span key={tech} className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
