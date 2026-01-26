'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Code, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppStore } from '@/lib/store'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAppStore()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedRole, setSelectedRole] = useState<'client' | 'developer'>('client')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const success = login(email, password, selectedRole)
    
    if (success) {
      router.push('/dashboard')
    } else {
      setError('Credenciais inválidas')
    }
    
    setIsLoading(false)
  }
  
  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 lg:w-1/2 lg:px-12">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mb-8">
              <Link href="/" className="mb-6 inline-flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <Code className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold text-foreground">99dev</span>
              </Link>
              <h1 className="mt-4 text-2xl font-bold text-foreground">Bem-vindo de volta</h1>
              <p className="mt-2 text-muted-foreground">Entre para continuar resolvendo bugs</p>
            </div>
            
            {/* Role Toggle */}
            <div className="mb-6 flex gap-2 rounded-lg bg-secondary p-1">
              <button
                type="button"
                onClick={() => setSelectedRole('client')}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  selectedRole === 'client'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Preciso de ajuda
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('developer')}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  selectedRole === 'developer'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Sou Dev
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
              
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>
            
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Não tem conta?{' '}
              <Link href="/auth/signup" className="text-primary hover:underline">
                Cadastre-se
              </Link>
            </p>
            
            {/* Demo credentials */}
            <div className="mt-8 rounded-lg border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Demo:</strong> Use qualquer email/senha para entrar. 
                A role selecionada determina sua visão do dashboard.
              </p>
            </div>
          </motion.div>
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
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary">
              <Code className="h-10 w-10 text-primary-foreground" />
            </div>
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              Bugs não esperam.
              <br />
              <span className="text-primary">Devs também não.</span>
            </h2>
            <p className="text-muted-foreground">
              Conecte-se com desenvolvedores experientes em minutos.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
