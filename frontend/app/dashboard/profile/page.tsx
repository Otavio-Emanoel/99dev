'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Star, Briefcase, Wallet, Edit2, Check, Code } from 'lucide-react'
import { Header } from '@/components/dashboard/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAppStore } from '@/lib/store'

export default function ProfilePage() {
  const { currentUser, switchRole } = useAppStore()
  const [isEditing, setIsEditing] = useState(false)
  
  const isClient = currentUser?.role === 'client'
  
  return (
    <div className="min-h-screen">
      <Header title="Meu Perfil" subtitle="Gerencie suas informações" />
      
      <div className="mx-auto max-w-3xl p-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-xl border border-border bg-card p-6"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary text-3xl font-bold text-foreground">
                {currentUser?.name.charAt(0) || 'U'}
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                isClient 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-accent/10 text-accent'
              }`}>
                {isClient ? 'Cliente' : 'Desenvolvedor'}
              </span>
            </div>
            
            {/* Info */}
            <div className="flex-1">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{currentUser?.name}</h2>
                  <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="gap-2"
                >
                  {isEditing ? (
                    <>
                      <Check className="h-4 w-4" />
                      Salvar
                    </>
                  ) : (
                    <>
                      <Edit2 className="h-4 w-4" />
                      Editar
                    </>
                  )}
                </Button>
              </div>
              
              {currentUser?.bio && (
                <p className="text-muted-foreground">{currentUser.bio}</p>
              )}
              
              {/* Developer Stats */}
              {!isClient && (
                <div className="mt-4 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="font-medium text-foreground">{currentUser?.rating || 0}</span>
                    <span className="text-sm text-muted-foreground">avaliação</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-accent" />
                    <span className="font-medium text-foreground">{currentUser?.completedJobs || 0}</span>
                    <span className="text-sm text-muted-foreground">jobs completos</span>
                  </div>
                </div>
              )}
              
              {/* Stack */}
              {!isClient && currentUser?.stack && (
                <div className="mt-4">
                  <p className="mb-2 text-sm text-muted-foreground">Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {currentUser.stack.map(tech => (
                      <span key={tech} className="rounded-lg bg-secondary px-3 py-1 text-sm text-foreground">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 rounded-xl border border-border bg-card p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saldo disponível</p>
                <p className="text-2xl font-bold text-primary">
                  R$ {currentUser?.balance?.toFixed(2) || '0.00'}
                </p>
              </div>
            </div>
            <Button variant="outline">
              {isClient ? 'Adicionar créditos' : 'Sacar'}
            </Button>
          </div>
        </motion.div>
        
        {/* Role Switch (Demo) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <Code className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold text-foreground">Modo Demo</h3>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Alterne entre as visualizações de Cliente e Desenvolvedor para explorar todas as funcionalidades.
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => switchRole('client')}
              variant={isClient ? 'default' : 'outline'}
              className={isClient ? 'bg-primary text-primary-foreground' : ''}
            >
              Sou Cliente
            </Button>
            <Button
              onClick={() => switchRole('developer')}
              variant={!isClient ? 'default' : 'outline'}
              className={!isClient ? 'bg-accent text-accent-foreground' : ''}
            >
              Sou Dev
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
