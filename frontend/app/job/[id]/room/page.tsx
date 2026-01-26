'use client'

import React from "react"

import { useState, useEffect, useRef, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Send,
  Code,
  CheckCircle2,
  Clock,
  DollarSign,
  Star,
  Copy,
  Check,
  AlertTriangle,
  PartyPopper,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatusTracker } from '@/components/dashboard/status-tracker'
import { useAppStore, type Message } from '@/lib/store'
import { cn } from '@/lib/utils'

export default function WarRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { currentUser, getJobById, getUserById, addMessage, updateJobStatus, isAuthenticated } = useAppStore()
  
  const [job, setJob] = useState(getJobById(id))
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const isClient = currentUser?.role === 'client'
  const client = job ? getUserById(job.clientId) : null
  const developer = job?.developerId ? getUserById(job.developerId) : null
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])
  
  useEffect(() => {
    setJob(getJobById(id))
  }, [id, getJobById])
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [job?.messages])
  
  if (!job || !developer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">Sala não disponível</p>
          <Link href="/dashboard">
            <Button className="mt-4">Voltar ao Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    
    addMessage(job.id, {
      senderId: currentUser?.id || '',
      content: message,
      type: 'text'
    })
    
    setMessage('')
    setJob(getJobById(id))
  }
  
  const handleMarkResolved = async () => {
    setIsValidating(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    updateJobStatus(job.id, 'validating')
    setJob(getJobById(id))
    setIsValidating(false)
    
    // Simulate validation
    setTimeout(async () => {
      updateJobStatus(job.id, 'completed')
      setJob(getJobById(id))
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }, 2000)
  }
  
  const copyCode = () => {
    if (job.codeSnippet) {
      navigator.clipboard.writeText(job.codeSnippet)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  return (
    <div className="flex h-screen bg-background">
      {/* Confetti Animation */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              className="text-center"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: 2, duration: 0.5 }}
                className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-accent"
              >
                <PartyPopper className="h-12 w-12 text-accent-foreground" />
              </motion.div>
              <h2 className="mb-2 text-2xl font-bold text-foreground">Bug Resolvido!</h2>
              <p className="mb-6 text-muted-foreground">O problema foi solucionado com sucesso</p>
              <div className="flex items-center justify-center gap-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href={`/job/${job.id}`} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-semibold text-foreground line-clamp-1">{job.title}</h1>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
                Sala de Resolução
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-sm text-muted-foreground">Valor</span>
              <p className="font-semibold text-primary">R$ {job.finalPrice?.toFixed(2)}</p>
            </div>
            
            {isClient && job.status === 'in_progress' && (
              <Button
                onClick={handleMarkResolved}
                disabled={isValidating}
                className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Validando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Marcar Resolvido
                  </>
                )}
              </Button>
            )}
          </div>
        </header>
        
        {/* Status Tracker */}
        <div className="border-b border-border bg-card/50 px-6 py-4">
          <StatusTracker status={job.status} />
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* System Message */}
          <div className="flex justify-center">
            <div className="rounded-full bg-secondary px-4 py-2 text-xs text-muted-foreground">
              {developer.name} aceitou resolver este bug
            </div>
          </div>
          
          {/* Chat Messages */}
          {job.messages.map((msg, index) => {
            const isOwn = msg.senderId === currentUser?.id
            const sender = getUserById(msg.senderId)
            
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn('flex gap-3', isOwn && 'flex-row-reverse')}
              >
                <div className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium',
                  isOwn
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-accent/20 text-accent'
                )}>
                  {sender?.name.charAt(0) || '?'}
                </div>
                
                <div className={cn('max-w-[70%]', isOwn && 'text-right')}>
                  <div className={cn(
                    'rounded-2xl px-4 py-2',
                    isOwn
                      ? 'rounded-br-md bg-primary text-primary-foreground'
                      : 'rounded-bl-md bg-secondary text-foreground'
                  )}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <span className="mt-1 text-xs text-muted-foreground">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </motion.div>
            )
          })}
          
          {/* Completion Message */}
          {job.status === 'completed' && (
            <div className="flex justify-center">
              <div className="rounded-xl border border-accent/30 bg-accent/10 px-6 py-4 text-center">
                <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-accent" />
                <p className="font-medium text-foreground">Bug Resolvido!</p>
                <p className="text-sm text-muted-foreground">Pagamento de R$ {job.finalPrice?.toFixed(2)} liberado</p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Message Input */}
        {job.status !== 'completed' && (
          <form onSubmit={handleSendMessage} className="border-t border-border bg-card p-4">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-secondary"
              />
              <Button type="submit" disabled={!message.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        )}
      </div>
      
      {/* Sidebar - Job Details */}
      <aside className="hidden w-80 flex-col border-l border-border bg-card lg:flex">
        {/* Participants */}
        <div className="border-b border-border p-4">
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">Participantes</h3>
          
          <div className="space-y-3">
            {/* Client */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground">
                {client?.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-foreground">{client?.name}</p>
                <p className="text-xs text-muted-foreground">Cliente</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-accent" />
            </div>
            
            {/* Developer */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-accent">
                {developer.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-foreground">{developer.name}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 text-yellow-400" />
                  {developer.rating}
                </div>
              </div>
              <div className="h-2 w-2 rounded-full bg-accent" />
            </div>
          </div>
        </div>
        
        {/* Job Info */}
        <div className="border-b border-border p-4">
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">Detalhes do Job</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Valor
              </span>
              <span className="font-medium text-primary">R$ {job.finalPrice?.toFixed(2)}</span>
            </div>
            
            {job.aiAnalysis?.estimatedTime && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Estimativa
                </span>
                <span className="text-sm text-foreground">{job.aiAnalysis.estimatedTime}</span>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex flex-wrap gap-1">
            {job.tags.map(tag => (
              <span key={tag} className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        {/* Code Snippet */}
        {job.codeSnippet && (
          <div className="flex-1 overflow-hidden p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Code className="h-4 w-4" />
                Código
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyCode}
                className="h-8 gap-1 text-xs"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
            
            <div className="h-full max-h-64 overflow-auto rounded-lg border border-border bg-secondary p-3">
              <pre className="text-xs text-foreground">
                <code>{job.codeSnippet}</code>
              </pre>
            </div>
          </div>
        )}
        
        {/* Quick Actions */}
        <div className="border-t border-border p-4">
          <Link href={`/job/${job.id}`}>
            <Button variant="outline" className="w-full bg-transparent">
              Ver Detalhes Completos
            </Button>
          </Link>
        </div>
      </aside>
    </div>
  )
}
