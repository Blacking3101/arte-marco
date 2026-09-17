'use client'

import React, { useState } from 'react'
import { Check, Hammer, Lock, LogOut, Mail, ShieldCheck, UserRound, X, Sparkles } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenAddProduct?: () => void
}

export function AuthModal({ isOpen, onClose, onOpenAddProduct }: AuthModalProps) {
  const { user, isOwner, login, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<'owner' | 'customer'>('owner')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Por favor introduce tu correo electrónico')
      return
    }

    if (activeTab === 'owner') {
      // Allow demo owner login or any valid admin/dueño credential
      login(email || 'admin@artemarco.com', 'owner')
    } else {
      login(email, 'customer')
    }

    onClose()
  }

  function handleQuickOwnerLogin() {
    login('admin@artemarco.com', 'owner')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-primary/45 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-background border border-border p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid size-10 place-items-center text-muted-foreground hover:bg-secondary hover:text-primary transition-colors cursor-pointer"
          aria-label="Cerrar ventana de inicio de sesión"
        >
          <X className="size-5" />
        </button>

        {user ? (
          /* User Logged In View */
          <div>
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center bg-secondary text-accent">
                {isOwner ? <Hammer className="size-6" /> : <UserRound className="size-6" />}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-accent">Sesión activa</p>
                <h2 className="font-serif text-2xl text-primary">{user.name}</h2>
              </div>
            </div>

            <div className="mt-6 border-y border-border py-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium text-primary">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rol:</span>
                <span className={`font-semibold ${isOwner ? 'text-accent' : 'text-primary'}`}>
                  {isOwner ? '👑 Dueño / Artesano del Taller' : 'Cliente'}
                </span>
              </div>
            </div>

            {isOwner && (
              <div className="mt-6 bg-secondary/50 p-4 border border-primary/15">
                <p className="flex items-center gap-2 text-xs font-semibold text-primary">
                  <ShieldCheck className="size-4 text-accent" /> Modo Dueño Activado
                </p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Tienes permisos para agregar nuevos cuadros, marcos y piezas directamente al catálogo de la tienda.
                </p>
                {onOpenAddProduct && (
                  <button
                    onClick={() => {
                      onClose()
                      onOpenAddProduct()
                    }}
                    className="mt-3 flex w-full items-center justify-center gap-2 bg-primary py-2.5 text-xs font-semibold text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                  >
                    <Sparkles className="size-3.5" /> + Agregar Nuevo Cuadro Ahora
                  </button>
                )}
              </div>
            )}

            <button
              onClick={() => {
                logout()
                onClose()
              }}
              className="mt-6 flex w-full items-center justify-center gap-2 border border-border py-3 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-destructive transition-colors cursor-pointer"
            >
              <LogOut className="size-4" /> Cerrar Sesión
            </button>
          </div>
        ) : (
          /* Login Form */
          <div>
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">Área de acceso</p>
              <h2 className="font-serif text-3xl text-primary mt-1">Iniciar Sesión</h2>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Inicia como dueño para agregar nuevos cuadros al catálogo o como cliente.
              </p>
            </div>

            {/* Role Tabs */}
            <div className="grid grid-cols-2 gap-2 border-b border-border pb-4 mb-6">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('owner')
                  setError('')
                }}
                className={`flex items-center justify-center gap-2 py-2.5 text-xs font-semibold transition-all cursor-pointer border ${
                  activeTab === 'owner'
                    ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                    : 'bg-secondary/40 text-muted-foreground border-border hover:text-primary'
                }`}
              >
                <Hammer className="size-3.5" /> Dueño del Taller
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('customer')
                  setError('')
                }}
                className={`flex items-center justify-center gap-2 py-2.5 text-xs font-semibold transition-all cursor-pointer border ${
                  activeTab === 'customer'
                    ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                    : 'bg-secondary/40 text-muted-foreground border-border hover:text-primary'
                }`}
              >
                <UserRound className="size-3.5" /> Cliente
              </button>
            </div>

            {activeTab === 'owner' && (
              <div className="mb-6 bg-accent/10 border border-accent/30 p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-primary flex items-center gap-1.5">
                      <ShieldCheck className="size-4 text-accent" /> Panel del Dueño
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Acceso rápido de prueba para gestionar y subir cuadros.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleQuickOwnerLogin}
                  className="mt-3 w-full flex items-center justify-center gap-2 bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <Sparkles className="size-3.5" /> Acceder como Dueño en 1 Clic
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 border border-destructive/30 px-3 py-2 text-xs text-destructive">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={activeTab === 'owner' ? 'admin@artemarco.com' : 'tu@email.com'}
                    className="w-full bg-secondary/30 border border-border pl-9 pr-3 py-2.5 text-xs text-primary placeholder:text-muted-foreground outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-secondary/30 border border-border pl-9 pr-3 py-2.5 text-xs text-primary placeholder:text-muted-foreground outline-none focus:border-accent"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 w-full bg-primary py-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
              >
                {activeTab === 'owner' ? 'Entrar al Taller como Dueño' : 'Iniciar Sesión'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
