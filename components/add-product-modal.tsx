'use client'

import React, { useState } from 'react'
import { Check, Hammer, Image as ImageIcon, Sparkles, X } from 'lucide-react'
import { Product, saveCustomProduct } from '@/lib/products'

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onProductAdded: (newProducts: Product[]) => void
}

const TONE_OPTIONS = [
  { label: 'Roble Cálido', value: 'bg-[#d8bda1]' },
  { label: 'Nogal Chocolate', value: 'bg-[#a88467]' },
  { label: 'Terracota / Teja', value: 'bg-[#bd8064]' },
  { label: 'Olivo Ceniza', value: 'bg-[#b8ad91]' },
  { label: 'Castaño Oscuro', value: 'bg-[#8b5a2b]' },
  { label: 'Haya Nórdica Clara', value: 'bg-[#e6ceb5]' },
  { label: 'Ébano / Carbón', value: 'bg-[#3a3532]' },
  { label: 'Cedro Canela', value: 'bg-[#c2845c]' },
]

export function AddProductModal({ isOpen, onClose, onProductAdded }: AddProductModalProps) {
  const [name, setName] = useState('')
  const [wood, setWood] = useState('Roble macizo')
  const [dimensions, setDimensions] = useState('40 × 50 cm')
  const [price, setPrice] = useState('95')
  const [category, setCategory] = useState<'roble' | 'nogal' | 'pino' | 'recuperada' | 'especial'>('roble')
  const [tone, setTone] = useState('bg-[#d8bda1]')
  const [badge, setBadge] = useState('Novedad')
  const [isSeasonal, setIsSeasonal] = useState(true)
  const [description, setDescription] = useState(
    'Marco artesanal tallado a mano en el taller. Acabado al aceite y cera virgen de abeja para proteger y nutrir la madera natural.'
  )
  const [error, setError] = useState('')

  if (!isOpen) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Por favor indica el nombre del cuadro o marco')
      return
    }

    const numPrice = Number.parseFloat(price)
    if (isNaN(numPrice) || numPrice <= 0) {
      setError('Introduce un precio válido en pesos')
      return
    }

    const newId = `custom-${Date.now()}`
    const newProduct: Product = {
      id: newId,
      name: name.trim(),
      detail: `${dimensions} · ${wood}`,
      wood: wood.trim(),
      dimensions: dimensions.trim(),
      price: `$${numPrice} MXN`,
      numericPrice: numPrice,
      image: '/arte-marco-hero.png',
      tone,
      badge: badge.trim() || undefined,
      category,
      description: description.trim(),
      isSeasonal,
    }

    const updated = saveCustomProduct(newProduct)
    onProductAdded(updated)
    onClose()

    // Reset form
    setName('')
    setPrice('95')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-primary/45 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative my-8 w-full max-w-xl bg-background border border-border p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid size-10 place-items-center text-muted-foreground hover:bg-secondary hover:text-primary transition-colors cursor-pointer"
          aria-label="Cerrar modal de nuevo cuadro"
        >
          <X className="size-5" />
        </button>

        <div className="mb-6">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent">
            <Hammer className="size-3.5" /> Panel del Dueño
          </p>
          <h2 className="font-serif text-3xl text-primary mt-1">Agregar Nuevo Cuadro / Marco</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Añade una nueva pieza tallada a mano al catálogo en tiempo real.
          </p>
        </div>

        {error && (
          <div className="mb-5 bg-destructive/10 border border-destructive/30 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Nombre */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Nombre de la Obra o Marco *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Marco Castaño Veta Dorada"
              className="w-full bg-secondary/30 border border-border px-3 py-2.5 text-xs text-primary placeholder:text-muted-foreground outline-none focus:border-accent"
            />
          </div>

          {/* Categoría y Madera */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-secondary/30 border border-border px-3 py-2.5 text-xs text-primary outline-none focus:border-accent font-medium cursor-pointer"
              >
                <option value="roble">Roble macizo</option>
                <option value="nogal">Nogal noble</option>
                <option value="pino">Pino cálido</option>
                <option value="recuperada">Madera recuperada</option>
                <option value="especial">Madera especial / autor</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Tipo de Madera / Detalle
              </label>
              <input
                type="text"
                value={wood}
                onChange={(e) => setWood(e.target.value)}
                placeholder="Ej: Roble macizo europeo envejecido"
                className="w-full bg-secondary/30 border border-border px-3 py-2.5 text-xs text-primary placeholder:text-muted-foreground outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Medidas y Precio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Medidas exteriores
              </label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="Ej: 50 × 70 cm"
                className="w-full bg-secondary/30 border border-border px-3 py-2.5 text-xs text-primary placeholder:text-muted-foreground outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Precio ($ MXN) *
              </label>
              <input
                type="number"
                required
                min="1"
                step="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="95"
                className="w-full bg-secondary/30 border border-border px-3 py-2.5 text-xs text-primary placeholder:text-muted-foreground outline-none focus:border-accent font-semibold"
              />
            </div>
          </div>

          {/* Tono visual de madera */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Tono de acabado / Fondo artesanal
            </label>
            <div className="grid grid-cols-4 gap-2">
              {TONE_OPTIONS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setTone(item.value)}
                  className={`flex flex-col items-center gap-1.5 p-2 border text-center transition-all cursor-pointer ${
                    tone === item.value
                      ? 'border-accent bg-accent/10 shadow-xs'
                      : 'border-border bg-secondary/20 hover:border-primary/40'
                  }`}
                >
                  <span className={`size-5 rounded-full border border-primary/20 ${item.value}`} />
                  <span className="text-[10px] leading-tight text-primary font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Etiqueta y Temporada */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
            <div>
              <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Etiqueta / Badge (Opcional)
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Ej: Novedad, Edición Limitada, Taller"
                className="w-full bg-secondary/30 border border-border px-3 py-2 text-xs text-primary placeholder:text-muted-foreground outline-none focus:border-accent"
              />
            </div>

            <div className="flex items-center gap-2.5 pt-4">
              <input
                type="checkbox"
                id="isSeasonal"
                checked={isSeasonal}
                onChange={(e) => setIsSeasonal(e.target.checked)}
                className="size-4 accent-accent cursor-pointer"
              />
              <label htmlFor="isSeasonal" className="font-semibold text-primary cursor-pointer select-none">
                Destacar en Selección de Temporada
              </label>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Descripción del proceso y acabado
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-secondary/30 border border-border p-3 text-xs text-primary placeholder:text-muted-foreground outline-none focus:border-accent resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-border flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-border py-3 font-semibold text-muted-foreground hover:bg-secondary hover:text-primary transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-primary py-3 font-semibold text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
            >
              <Sparkles className="size-4" /> Publicar Cuadro
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
