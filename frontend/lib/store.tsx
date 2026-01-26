import { create } from 'zustand'

// Types
export type UserRole = 'client' | 'developer'

export interface User {
  id: string
  role: UserRole
  name: string
  email: string
  avatar: string
  balance?: number
  stack?: string[]
  rating?: number
  completedJobs?: number
  bio?: string
}

export type JobStatus = 'open' | 'searching_dev' | 'in_progress' | 'validating' | 'completed'

export interface AIAnalysis {
  complexity: 'Low' | 'Medium' | 'High' | 'Critical'
  estimatedTime: string
  summary: string
  suggestedTags: string[]
  estimatedPrice: { min: number; max: number }
}

export interface Message {
  id: string
  senderId: string
  content: string
  timestamp: Date
  type: 'text' | 'offer' | 'system'
  offerAmount?: number
  offerStatus?: 'pending' | 'accepted' | 'rejected'
}

export interface Job {
  id: string
  clientId: string
  developerId?: string
  title: string
  description: string
  codeSnippet?: string
  budgetOffer: number
  finalPrice?: number
  status: JobStatus
  aiAnalysis?: AIAnalysis
  tags: string[]
  createdAt: Date
  messages: Message[]
  applicants: { devId: string; offerAmount: number; message: string }[]
}

// Mock Data
const mockUsers: User[] = [
  {
    id: 'usr_01',
    role: 'client',
    name: 'Carlos Silva',
    email: 'carlos@email.com',
    avatar: '',
    balance: 1500.00,
    bio: 'Empreendedor digital com projetos em React e Next.js'
  },
  {
    id: 'dev_01',
    role: 'developer',
    name: 'Ana Costa',
    email: 'ana@email.com',
    avatar: '',
    stack: ['React', 'Next.js', 'TypeScript', 'Node.js'],
    rating: 4.9,
    completedJobs: 42,
    balance: 3200.00,
    bio: 'Desenvolvedora Full Stack com 5 anos de experiência'
  },
  {
    id: 'dev_02',
    role: 'developer',
    name: 'Pedro Santos',
    email: 'pedro@email.com',
    avatar: '',
    stack: ['Python', 'Django', 'React', 'PostgreSQL'],
    rating: 4.7,
    completedJobs: 28,
    balance: 2100.00,
    bio: 'Especialista em backend e integração de APIs'
  },
  {
    id: 'dev_03',
    role: 'developer',
    name: 'Maria Oliveira',
    email: 'maria@email.com',
    avatar: '',
    stack: ['Vue.js', 'Nuxt', 'TailwindCSS', 'Firebase'],
    rating: 4.8,
    completedJobs: 35,
    balance: 2800.00,
    bio: 'Frontend developer apaixonada por UI/UX'
  }
]

const mockJobs: Job[] = [
  {
    id: 'job_101',
    clientId: 'usr_01',
    title: 'Erro de Hydration no Next.js com Shadcn',
    description: 'Meu site crasha quando dou refresh. O console diz que o HTML do server difere do client. Já tentei desabilitar extensões do browser mas continua.',
    codeSnippet: `'use client'\nimport { useState, useEffect } from 'react'\n\nexport function Counter() {\n  const [count, setCount] = useState(Math.random())\n  return <div>{count}</div>\n}`,
    budgetOffer: 50.00,
    status: 'open',
    tags: ['Next.js', 'React', 'Hydration', 'Shadcn'],
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    aiAnalysis: {
      complexity: 'Medium',
      estimatedTime: '30-60 min',
      summary: 'Provável erro de renderização condicional usando valores aleatórios ou extensão de browser interferindo no DOM.',
      suggestedTags: ['Next.js', 'React', 'Hydration', 'SSR'],
      estimatedPrice: { min: 40, max: 80 }
    },
    messages: [],
    applicants: []
  },
  {
    id: 'job_102',
    clientId: 'usr_01',
    title: 'API Route retornando 500 sem motivo aparente',
    description: 'Minha API route do Next.js está retornando erro 500 em produção mas funciona local. Os logs não mostram nada útil.',
    budgetOffer: 80.00,
    status: 'open',
    tags: ['Next.js', 'API', 'Vercel', 'Debug'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    aiAnalysis: {
      complexity: 'High',
      estimatedTime: '1-2 horas',
      summary: 'Possível problema com variáveis de ambiente ou cold start. Verificar logs do Vercel.',
      suggestedTags: ['Next.js', 'API', 'Vercel', 'Environment'],
      estimatedPrice: { min: 60, max: 120 }
    },
    messages: [],
    applicants: []
  },
  {
    id: 'job_103',
    clientId: 'usr_01',
    developerId: 'dev_01',
    title: 'Componente React re-renderizando infinitamente',
    description: 'Toda vez que a página carrega, o componente entra em loop infinito de re-render. UseEffect com array vazio não funciona.',
    budgetOffer: 45.00,
    finalPrice: 50.00,
    status: 'in_progress',
    tags: ['React', 'Performance', 'useEffect'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    aiAnalysis: {
      complexity: 'Medium',
      estimatedTime: '30-45 min',
      summary: 'Dependência não declarada no useEffect ou state update dentro do render.',
      suggestedTags: ['React', 'Hooks', 'Performance'],
      estimatedPrice: { min: 35, max: 70 }
    },
    messages: [
      {
        id: 'msg_1',
        senderId: 'dev_01',
        content: 'Oi! Vou começar a analisar o código agora.',
        timestamp: new Date(Date.now() - 1000 * 60 * 20),
        type: 'text'
      },
      {
        id: 'msg_2',
        senderId: 'usr_01',
        content: 'Ótimo! Qualquer dúvida pode perguntar.',
        timestamp: new Date(Date.now() - 1000 * 60 * 18),
        type: 'text'
      }
    ],
    applicants: [{ devId: 'dev_01', offerAmount: 50, message: 'Posso resolver isso rapidamente!' }]
  },
  {
    id: 'job_104',
    clientId: 'usr_01',
    developerId: 'dev_02',
    title: 'Integração Stripe falhando no checkout',
    description: 'O checkout do Stripe não está redirecionando corretamente. O pagamento processa mas o webhook não dispara.',
    budgetOffer: 100.00,
    finalPrice: 120.00,
    status: 'completed',
    tags: ['Stripe', 'Webhook', 'Payment', 'Node.js'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    aiAnalysis: {
      complexity: 'High',
      estimatedTime: '2-3 horas',
      summary: 'Problema com configuração de webhook ou endpoint não acessível publicamente.',
      suggestedTags: ['Stripe', 'Webhook', 'API'],
      estimatedPrice: { min: 80, max: 150 }
    },
    messages: [],
    applicants: [{ devId: 'dev_02', offerAmount: 120, message: 'Experiência com Stripe. Posso ajudar!' }]
  }
]

// Store Interface
interface AppStore {
  // Auth
  currentUser: User | null
  isAuthenticated: boolean
  
  // Jobs
  jobs: Job[]
  
  // Users
  users: User[]
  
  // Actions
  login: (email: string, password: string, role: UserRole) => boolean
  logout: () => void
  switchRole: (role: UserRole) => void
  
  createJob: (job: Omit<Job, 'id' | 'createdAt' | 'messages' | 'applicants' | 'status'>) => Job
  updateJobStatus: (jobId: string, status: JobStatus) => void
  applyToJob: (jobId: string, devId: string, offerAmount: number, message: string) => void
  acceptOffer: (jobId: string, devId: string) => void
  addMessage: (jobId: string, message: Omit<Message, 'id' | 'timestamp'>) => void
  
  getJobById: (id: string) => Job | undefined
  getUserById: (id: string) => User | undefined
  getClientJobs: (clientId: string) => Job[]
  getOpenJobs: () => Job[]
  getDevJobs: (devId: string) => Job[]
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Initial state
  currentUser: null,
  isAuthenticated: false,
  jobs: mockJobs,
  users: mockUsers,
  
  // Auth actions
  login: (email, password, role) => {
    // Mock login - find user by role
    const user = mockUsers.find(u => u.role === role)
    if (user) {
      set({ currentUser: user, isAuthenticated: true })
      return true
    }
    return false
  },
  
  logout: () => {
    set({ currentUser: null, isAuthenticated: false })
  },
  
  switchRole: (role) => {
    const user = mockUsers.find(u => u.role === role)
    if (user) {
      set({ currentUser: user })
    }
  },
  
  // Job actions
  createJob: (jobData) => {
    const newJob: Job = {
      ...jobData,
      id: `job_${Date.now()}`,
      status: 'open',
      createdAt: new Date(),
      messages: [],
      applicants: []
    }
    set(state => ({ jobs: [newJob, ...state.jobs] }))
    return newJob
  },
  
  updateJobStatus: (jobId, status) => {
    set(state => ({
      jobs: state.jobs.map(job => 
        job.id === jobId ? { ...job, status } : job
      )
    }))
  },
  
  applyToJob: (jobId, devId, offerAmount, message) => {
    set(state => ({
      jobs: state.jobs.map(job => 
        job.id === jobId 
          ? { ...job, applicants: [...job.applicants, { devId, offerAmount, message }] }
          : job
      )
    }))
  },
  
  acceptOffer: (jobId, devId) => {
    set(state => ({
      jobs: state.jobs.map(job => {
        if (job.id === jobId) {
          const offer = job.applicants.find(a => a.devId === devId)
          return {
            ...job,
            developerId: devId,
            finalPrice: offer?.offerAmount || job.budgetOffer,
            status: 'in_progress' as JobStatus
          }
        }
        return job
      })
    }))
  },
  
  addMessage: (jobId, messageData) => {
    const newMessage: Message = {
      ...messageData,
      id: `msg_${Date.now()}`,
      timestamp: new Date()
    }
    set(state => ({
      jobs: state.jobs.map(job => 
        job.id === jobId 
          ? { ...job, messages: [...job.messages, newMessage] }
          : job
      )
    }))
  },
  
  // Getters
  getJobById: (id) => get().jobs.find(job => job.id === id),
  getUserById: (id) => get().users.find(user => user.id === id),
  getClientJobs: (clientId) => get().jobs.filter(job => job.clientId === clientId),
  getOpenJobs: () => get().jobs.filter(job => job.status === 'open'),
  getDevJobs: (devId) => get().jobs.filter(job => job.developerId === devId)
}))
