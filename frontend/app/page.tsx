'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Bug, Zap, Clock, Shield, Users, Code, ArrowRight, Star, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const features = [
  {
    icon: Bug,
    title: 'Bugs Críticos',
    description: 'Resolva erros urgentes que estão travando seu projeto em produção.'
  },
  {
    icon: Zap,
    title: 'Resposta Rápida',
    description: 'Devs disponíveis 24/7 prontos para aceitar sua corrida.'
  },
  {
    icon: Clock,
    title: 'Tempo Real',
    description: 'Acompanhe o progresso como um Uber - do match até a solução.'
  },
  {
    icon: Shield,
    title: 'Pagamento Seguro',
    description: 'Só pague quando o problema for resolvido e validado.'
  }
]

const stats = [
  { value: '500+', label: 'Bugs Resolvidos' },
  { value: '4.9', label: 'Avaliação Média' },
  { value: '< 15min', label: 'Tempo de Match' },
  { value: '98%', label: 'Taxa de Sucesso' }
]

const testimonials = [
  {
    name: 'Lucas Mendes',
    role: 'CTO @ StartupXYZ',
    content: 'Salvou nosso deploy de sexta-feira. Dev incrível resolveu em 20 minutos o que eu não conseguia em 3 horas.',
    rating: 5
  },
  {
    name: 'Fernanda Lima',
    role: 'Freelancer',
    content: 'Uso toda semana quando pego projetos com código legado. Vale cada centavo.',
    rating: 5
  }
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Code className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">99dev</span>
          </Link>
          
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#como-funciona" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Como funciona
            </Link>
            <Link href="#para-devs" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Para Devs
            </Link>
            <Link href="#precos" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Preços
            </Link>
          </nav>
          
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Começar
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-20 right-1/4 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
              <span className="text-muted-foreground">Devs online agora</span>
            </div>
            
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              O <span className="text-primary">Uber</span> para correções{' '}
              <span className="relative">
                de código
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M2 6C50 2 150 2 198 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary/50" />
                </svg>
              </span>
            </h1>
            
            <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
              Bug urgente em produção? Código de IA quebrado? Conectamos você a devs experientes em minutos. 
              Pague apenas pelo problema resolvido.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/signup">
                <Button size="lg" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  Pedir Socorro
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/signup?role=developer">
                <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                  Quero ser Dev
                  <Users className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
          
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4"
          >
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border bg-card p-6 text-center"
              >
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* How it Works */}
      <section id="como-funciona" className="border-t border-border bg-card/50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">Como funciona</h2>
            <p className="text-muted-foreground">Simples como pedir um Uber</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: '1', title: 'Descreva o bug', desc: 'Cole seu erro ou descreva o problema. Nossa IA analisa e sugere preço.' },
              { step: '2', title: 'Match com Dev', desc: 'Devs qualificados recebem seu pedido e enviam propostas em tempo real.' },
              { step: '3', title: 'Problema resolvido', desc: 'Acompanhe o progresso e pague apenas quando validar a solução.' }
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative rounded-xl border border-border bg-card p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* For Devs */}
      <section id="para-devs" className="border-t border-border bg-card/50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-3 py-1 text-sm text-accent">
                <Zap className="h-4 w-4" />
                Para Desenvolvedores
              </div>
              <h2 className="mb-4 text-3xl font-bold text-foreground">
                Ganhe dinheiro resolvendo bugs
              </h2>
              <p className="mb-6 text-muted-foreground">
                Use seu conhecimento para ajudar outros devs e ganhe por problema resolvido. 
                Sem compromisso de horário - aceite corridas quando quiser.
              </p>
              <ul className="mb-8 space-y-3">
                {[
                  'Escolha os bugs que quer resolver',
                  'Defina seu próprio preço',
                  'Receba pagamento instantâneo',
                  'Construa sua reputação'
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/auth/signup?role=developer">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                  Começar como Dev
                </Button>
              </Link>
            </div>
            
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Corridas disponíveis</span>
                <span className="flex h-2 w-2 animate-pulse rounded-full bg-accent" />
              </div>
              {[
                { title: 'Erro de Hydration Next.js', price: 'R$ 50', time: '30-60min', tags: ['React', 'Next.js'] },
                { title: 'API 500 em produção', price: 'R$ 80', time: '1-2h', tags: ['Node.js', 'Vercel'] },
                { title: 'CSS quebrado no Safari', price: 'R$ 35', time: '15-30min', tags: ['CSS', 'Safari'] }
              ].map((job, i) => (
                <div key={job.title} className="flex items-center justify-between border-t border-border py-4">
                  <div>
                    <div className="font-medium text-foreground">{job.title}</div>
                    <div className="mt-1 flex gap-2">
                      {job.tags.map(tag => (
                        <span key={tag} className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-primary">{job.price}</div>
                    <div className="text-xs text-muted-foreground">{job.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">O que dizem sobre nós</h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="rounded-xl border border-border bg-card p-6"
              >
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mb-4 text-foreground">{`"${t.content}"`}</p>
                <div>
                  <div className="font-medium text-foreground">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            Pronto para resolver seu bug?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Não deixe um erro parar seu projeto. Encontre um dev agora.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              Começar Agora
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
              <Code className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">99dev</span>
          </div>
          <div className="text-sm text-muted-foreground">
            2026 99dev. Feito com cafeína e bugs resolvidos.
          </div>
        </div>
      </footer>
    </div>
  )
}
