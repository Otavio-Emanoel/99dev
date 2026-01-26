'use client'

import React from "react"

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Code, ArrowLeft, Eye, EyeOff, Loader2, Bug, Wrench, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppStore, type UserRole } from '@/lib/store'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAppStore()
  
  const initialRole = searchParams.get('role') as UserRole | null
  
  const [step, setStep] = useState<'role' | 'form'>(initialRole ? 'form' : 'role')
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole || 'client')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    setStep('form')
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    login(email, password, selectedRole)
    router.push('/dashboard')
    
    setIsLoading(false)
  }
  
  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 lg:w-1/2 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          <button
            onClick={() => step === 'form' ? setStep('role') : router.push('/')}
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {step === 'form' ? 'Escolher tipo' : 'Voltar'}
          </button>
          
          <Link href="/" className="mb-6 inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Code className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">99dev</span>
          </Link>
          
          <AnimatePresence mode="wait">
            {step === 'role' ? (
              <motion.div
                key="role"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="mt-4 text-2xl font-bold text-foreground">Criar conta</h1>
                <p className="mt-2 mb-8 text-muted-foreground">Escolha como você quer usar o 99dev</p>
                
                <div className="space-y-4">
                  {/* Client Option */}
                  <button
                    onClick={() => handleRoleSelect('client')}
                    className="group w-full rounded-xl border border-border bg-card p-6 text-left transition-all hover:border-primary/50 hover:bg-card/80"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10 text-destructive transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Bug className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">Preciso de ajuda</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Tenho bugs ou problemas no meu código que preciso resolver urgente.
                        </p>
                        <ul className="mt-3 space-y-1">
                          {['Poste seu problema', 'Receba propostas de devs', 'Pague só quando resolver'].map(item => (
                            <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <CheckCircle2 className="h-3 w-3 text-accent" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </button>
                  
                  {/* Developer Option */}
                  <button
                    onClick={() => handleRoleSelect('developer')}
                    className="group w-full rounded-xl border border-border bg-card p-6 text-left transition-all hover:border-accent/50 hover:bg-card/80"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                        <Wrench className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">Sou Desenvolvedor</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Quero ganhar dinheiro ajudando outros devs com seus problemas.
                        </p>
                        <ul className="mt-3 space-y-1">
                          {['Escolha seus jobs', 'Defina seus preços', 'Receba instantaneamente'].map(item => (
                            <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <CheckCircle2 className="h-3 w-3 text-accent" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </button>
                </div>
                
                <p className="mt-8 text-center text-sm text-muted-foreground">
                  Já tem conta?{' '}
                  <Link href="/auth/login" className="text-primary hover:underline">
                    Entrar
                  </Link>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-sm">
                  {selectedRole === 'client' ? (
                    <>
                      <Bug className="h-4 w-4 text-destructive" />
                      <span className="text-muted-foreground">Preciso de ajuda</span>
                    </>
                  ) : (
                    <>
                      <Wrench className="h-4 w-4 text-accent" />
                      <span className="text-muted-foreground">Sou Desenvolvedor</span>
                    </>
                  )}
                </div>
                
                <h1 className="mt-4 text-2xl font-bold text-foreground">Criar sua conta</h1>
                <p className="mt-2 mb-6 text-muted-foreground">
                  {selectedRole === 'client' 
                    ? 'Preencha seus dados para começar a pedir ajuda'
                    : 'Preencha seus dados para começar a aceitar corridas'
                  }
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="bg-secondary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-secondary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mínimo 8 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        className="bg-secondary pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className={`w-full ${
                      selectedRole === 'client'
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-accent text-accent-foreground hover:bg-accent/90'
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Criando conta...
                      </>
                    ) : (
                      'Criar conta'
                    )}
                  </Button>
                </form>
                
                <p className="mt-6 text-center text-xs text-muted-foreground">
                  Ao criar conta, você concorda com nossos{' '}
                  <span className="text-primary">Termos de Serviço</span> e{' '}
                  <span className="text-primary">Política de Privacidade</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Right Panel - Visual */}
      <div className="relative hidden bg-secondary lg:flex lg:w-1/2 lg:items-center lg:justify-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        </div>
        
        <div className="relative px-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <AnimatePresence mode="wait">
              {selectedRole === 'client' ? (
                <motion.div
                  key="client-visual"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/20">
                    <Bug className="h-10 w-10 text-destructive" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Código travado?
                    <br />
                    <span className="text-primary">A gente resolve.</span>
                  </h2>
                  <p className="text-muted-foreground">
                    Devs experientes prontos para atacar seu bug em minutos.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="dev-visual"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/20">
                    <Wrench className="h-10 w-10 text-accent" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Transforme skills
                    <br />
                    <span className="text-accent">em dinheiro.</span>
                  </h2>
                  <p className="text-muted-foreground">
                    Resolva bugs, ganhe por job. Sem horário fixo.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  )
}
