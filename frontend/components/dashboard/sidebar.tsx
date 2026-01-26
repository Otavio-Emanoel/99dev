'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Code,
  LayoutDashboard,
  Plus,
  Briefcase,
  User,
  LogOut,
  Bug,
  Wrench,
  ChevronLeft,
  ChevronRight,
  Wallet
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const { currentUser, logout } = useAppStore()
  
  const isClient = currentUser?.role === 'client'
  
  const clientNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/create-ticket', label: 'Pedir Socorro', icon: Plus },
    { href: '/dashboard/tickets', label: 'Meus Tickets', icon: Bug },
    { href: '/dashboard/profile', label: 'Perfil', icon: User },
  ]
  
  const devNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/jobs', label: 'Corridas', icon: Briefcase },
    { href: '/dashboard/my-jobs', label: 'Meus Jobs', icon: Wrench },
    { href: '/dashboard/profile', label: 'Perfil', icon: User },
  ]
  
  const navItems = isClient ? clientNavItems : devNavItems
  
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.2 }}
      className="fixed left-0 top-0 z-40 flex h-full flex-col border-r border-sidebar-border bg-sidebar"
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
            <Code className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-lg font-bold text-sidebar-foreground"
            >
              99dev
            </motion.span>
          )}
        </Link>
        
        <button
          onClick={onToggle}
          className="flex h-6 w-6 items-center justify-center rounded text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
      
      {/* User Info */}
      <div className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-foreground">
            {currentUser?.name.charAt(0) || 'U'}
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-w-0 flex-1"
            >
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {currentUser?.name || 'Usuário'}
              </p>
              <p className="truncate text-xs text-sidebar-foreground/60">
                {isClient ? 'Cliente' : 'Desenvolvedor'}
              </p>
            </motion.div>
          )}
        </div>
        
        {!collapsed && currentUser?.balance !== undefined && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 flex items-center gap-2 rounded-lg bg-sidebar-accent p-2"
          >
            <Wallet className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-sidebar-foreground">
              R$ {currentUser.balance.toFixed(2)}
            </span>
          </motion.div>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map(item => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          )
        })}
      </nav>
      
      {/* Logout */}
      <div className="border-t border-sidebar-border p-2">
        <Button
          variant="ghost"
          onClick={() => logout()}
          className={cn(
            'w-full justify-start gap-3 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Sair</span>}
        </Button>
      </div>
    </motion.aside>
  )
}
