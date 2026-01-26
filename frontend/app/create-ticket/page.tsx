'use client'

import React from "react"

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Sparkles,
  Clock,
  DollarSign,
  Tag,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Code,
  Send
} from 'lucide-react'
import { Header } from '@/components/dashboard/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAppStore } from '@/lib/store'
import Link from 'next/link'

// Mock AI Analysis function
function mockAIAnalysis(title: string, description: string) {
  const keywords = (title + ' ' + description).toLowerCase()
  
  let complexity: 'Low' | 'Medium' | 'High' | 'Critical' = 'Medium'
  let estimatedTime = '30-60 min'
  let priceMin = 40
  let priceMax = 80
  
  // Simple keyword-based analysis
  if (keywords.includes('critical') || keywords.includes('produção') || keywords.includes('urgente')) {
    complexity = 'Critical'
    estimatedTime = '1-3 horas'
    priceMin = 100
    priceMax = 200
  } else if (keywords.includes('api') || keywords.includes('backend') || keywords.includes('database')) {
    complexity = 'High'
    estimatedTime = '1-2 horas'
    priceMin = 60
    priceMax = 120
  } else if (keywords.includes('css') || keywords.includes('style') || keywords.includes('layout')) {
    complexity = 'Low'
    estimatedTime = '15-30 min'
    priceMin = 25
    priceMax = 50
  }
  
  // Extract suggested tags
  const tagKeywords = [
    'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Python',
    'CSS', 'TailwindCSS', 'API', 'Database', 'Auth', 'Vercel', 'Supabase',
    'Prisma', 'MongoDB', 'PostgreSQL', 'Stripe', 'Firebase', 'Vue.js',
    'Hydration', 'SSR', 'Performance', 'Bug', 'Error'
  ]
  
  const suggestedTags = tagKeywords.filter(tag => 
    keywords.includes(tag.toLowerCase())
  ).slice(0, 5)
  
  if (suggestedTags.length < 2) {
    suggestedTags.push('Bug', 'Debug')
  }
  
  const summary = `Análise inicial: ${
    complexity === 'Critical' ? 'Problema crítico que requer atenção imediata.' :
    complexity === 'High' ? 'Problema complexo que pode envolver múltiplos sistemas.' :
    complexity === 'Low' ? 'Problema simples, provavelmente resolvido rapidamente.' :
    'Problema de complexidade moderada, comum em projetos web.'
  }`
  
  return {
    complexity,
    estimatedTime,
    summary,
    suggestedTags: [...new Set(suggestedTags)],
    estimatedPrice: { min: priceMin, max: priceMax }
  }
}

export default function CreateTicketPage() {
  const router = useRouter()
  const { currentUser, createJob, isAuthenticated } = useAppStore()
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [codeSnippet, setCodeSnippet] = useState('')
  const [budget, setBudget] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<ReturnType<typeof mockAIAnalysis> | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Redirect if not authenticated or not a client
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, router])
  
  // Debounced AI analysis
  const runAnalysis = useCallback(() => {
    if (title.length < 5 || description.length < 10) {
      setAiAnalysis(null)
      return
    }
    
    setIsAnalyzing(true)
    
    // Simulate API delay
    const timeout = setTimeout(() => {
      const analysis = mockAIAnalysis(title, description)
      setAiAnalysis(analysis)
      setIsAnalyzing(false)
      
      // Auto-suggest budget if not set
      if (!budget) {
        setBudget(analysis.estimatedPrice.min.toString())
      }
      
      // Auto-suggest tags
      if (selectedTags.length === 0) {
        setSelectedTags(analysis.suggestedTags.slice(0, 3))
      }
    }, 1200)
    
    return () => clearTimeout(timeout)
  }, [title, description, budget, selectedTags.length])
  
  useEffect(() => {
    const debounce = setTimeout(runAnalysis, 1000)
    return () => clearTimeout(debounce)
  }, [runAnalysis])
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const newJob = createJob({
      clientId: currentUser?.id || 'usr_01',
      title,
      description,
      codeSnippet: codeSnippet || undefined,
      budgetOffer: parseFloat(budget) || 50,
      tags: selectedTags.length > 0 ? selectedTags : ['Bug'],
      aiAnalysis: aiAnalysis ? {
        complexity: aiAnalysis.complexity,
        estimatedTime: aiAnalysis.estimatedTime,
        summary: aiAnalysis.summary,
        suggestedTags: aiAnalysis.suggestedTags,
        estimatedPrice: aiAnalysis.estimatedPrice
      } : undefined
    })
    
    router.push(`/job/${newJob.id}`)
  }
  
  const complexityColors = {
    Low: 'text-accent',
    Medium: 'text-yellow-400',
    High: 'text-orange-400',
    Critical: 'text-destructive'
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header title="Pedir Socorro" subtitle="Descreva seu problema e encontre ajuda" />
      
      <div className="mx-auto max-w-4xl p-6">
        <Link href="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Dashboard
        </Link>
        
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 font-semibold text-foreground">Descreva o problema</h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título do problema</Label>
                    <Input
                      id="title"
                      placeholder="Ex: Erro de Hydration no Next.js"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="bg-secondary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição detalhada</Label>
                    <Textarea
                      id="description"
                      placeholder="Descreva o erro, quando acontece, o que você já tentou..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      rows={5}
                      className="resize-none bg-secondary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="code" className="flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      Código relevante (opcional)
                    </Label>
                    <Textarea
                      id="code"
                      placeholder="Cole o trecho de código que está causando o problema..."
                      value={codeSnippet}
                      onChange={(e) => setCodeSnippet(e.target.value)}
                      rows={4}
                      className="resize-none bg-secondary font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
              
              {/* Tags */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                  <Tag className="h-4 w-4" />
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {(aiAnalysis?.suggestedTags || ['React', 'Next.js', 'TypeScript', 'Bug', 'CSS']).map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Budget */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                  <DollarSign className="h-4 w-4" />
                  Orçamento
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">R$</span>
                  <Input
                    type="number"
                    placeholder="50"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    min={10}
                    required
                    className="w-32 bg-secondary"
                  />
                  {aiAnalysis && (
                    <span className="text-sm text-muted-foreground">
                      Sugerido: R$ {aiAnalysis.estimatedPrice.min} - {aiAnalysis.estimatedPrice.max}
                    </span>
                  )}
                </div>
              </div>
              
              <Button
                type="submit"
                size="lg"
                className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isSubmitting || !title || !description}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Publicando...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Publicar Pedido de Socorro
                  </>
                )}
              </Button>
            </form>
          </div>
          
          {/* AI Analysis Panel */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              <motion.div
                layout
                className="rounded-xl border border-border bg-card p-6"
              >
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold text-foreground">Análise IA</h2>
                </div>
                
                <AnimatePresence mode="wait">
                  {isAnalyzing ? (
                    <motion.div
                      key="analyzing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center py-8"
                    >
                      <div className="relative">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <div className="absolute inset-0 h-8 w-8 animate-ping rounded-full bg-primary/20" />
                      </div>
                      <p className="mt-4 text-sm text-muted-foreground">Analisando com IA...</p>
                    </motion.div>
                  ) : aiAnalysis ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {/* Complexity */}
                      <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                        <span className="text-sm text-muted-foreground">Complexidade</span>
                        <span className={`font-semibold ${complexityColors[aiAnalysis.complexity]}`}>
                          {aiAnalysis.complexity === 'Low' ? 'Baixa' :
                           aiAnalysis.complexity === 'Medium' ? 'Média' :
                           aiAnalysis.complexity === 'High' ? 'Alta' : 'Crítica'}
                        </span>
                      </div>
                      
                      {/* Time */}
                      <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                        <span className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          Tempo estimado
                        </span>
                        <span className="font-medium text-foreground">{aiAnalysis.estimatedTime}</span>
                      </div>
                      
                      {/* Price */}
                      <div className="flex items-center justify-between rounded-lg bg-secondary p-3">
                        <span className="flex items-center gap-2 text-sm text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                          Preço sugerido
                        </span>
                        <span className="font-medium text-primary">
                          R$ {aiAnalysis.estimatedPrice.min} - {aiAnalysis.estimatedPrice.max}
                        </span>
                      </div>
                      
                      {/* Summary */}
                      <div className="rounded-lg bg-secondary p-3">
                        <p className="text-sm text-muted-foreground">{aiAnalysis.summary}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-accent">
                        <CheckCircle2 className="h-4 w-4" />
                        Análise concluída
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center py-8 text-center"
                    >
                      <AlertCircle className="mb-4 h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Comece a digitar para a IA analisar seu problema
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              
              {/* Tips */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-3 text-sm font-medium text-foreground">Dicas para um bom ticket</h3>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3 w-3 text-accent" />
                    Seja específico sobre o erro
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3 w-3 text-accent" />
                    Inclua mensagens de console
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3 w-3 text-accent" />
                    Mencione o que você já tentou
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3 w-3 text-accent" />
                    Cole o código relevante
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
