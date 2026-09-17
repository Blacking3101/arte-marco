'use client'

import { useState, useMemo } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  ChevronDown,
  Eye,
  Filter,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'
import { allProducts, Product } from '@/lib/products'

export function CatalogoView() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('todos')
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  
  // Cart state
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number }[]>([
    { product: allProducts[0], quantity: 1 },
  ])
  const [notice, setNotice] = useState('')

  // Categories list
  const categories = [
    { id: 'todos', label: 'Todos los marcos', count: allProducts.length },
    { id: 'roble', label: 'Roble macizo', count: allProducts.filter(p => p.category === 'roble').length },
    { id: 'nogal', label: 'Nogal noble', count: allProducts.filter(p => p.category === 'nogal').length },
    { id: 'pino', label: 'Pino y tonos cálidos', count: allProducts.filter(p => p.category === 'pino').length },
    { id: 'recuperada', label: 'Madera recuperada', count: allProducts.filter(p => p.category === 'recuperada').length },
    { id: 'especial', label: 'Maderas especiales', count: allProducts.filter(p => p.category === 'especial').length },
  ]

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    let result = allProducts.filter((product) => {
      const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory
      const norm = searchTerm.trim().toLowerCase()
      const matchesSearch =
        !norm ||
        product.name.toLowerCase().includes(norm) ||
        product.detail.toLowerCase().includes(norm) ||
        product.wood.toLowerCase().includes(norm) ||
        product.dimensions.toLowerCase().includes(norm)
      return matchesCategory && matchesSearch
    })

    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.numericPrice - b.numericPrice)
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.numericPrice - a.numericPrice)
    } else if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    }

    return result
  }, [searchTerm, selectedCategory, sortBy])

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.numericPrice * item.quantity, 0)

  function addToCart(product: Product) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
    setNotice(`«${product.name}» añadido al carrito`)
    window.setTimeout(() => setNotice(''), 2600)
  }

  function updateQuantity(productId: string, delta: number) {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const newQty = Math.max(1, item.quantity + delta)
          return { ...item, quantity: newQty }
        }
        return item
      })
    )
  }

  function removeFromCart(productId: string) {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId))
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Floating Notification */}
      {notice && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2.5 bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-2xl transition-all"
        >
          <Check className="size-4 text-accent" />
          <span>{notice}</span>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
          <button
            className="absolute inset-0 cursor-default bg-primary/40 backdrop-blur-xs transition-opacity"
            aria-label="Cerrar carrito"
            onClick={() => setCartOpen(false)}
          />
          <aside className="relative flex h-full w-full max-w-md flex-col bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Tu selección</p>
                <h2 className="mt-1 font-serif text-3xl text-primary">Tu Carrito</h2>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="grid size-10 place-items-center hover:bg-secondary text-primary"
                aria-label="Cerrar carrito"
              >
                <X />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {cartItems.length === 0 ? (
                <div className="py-20 text-center">
                  <ShoppingBag className="mx-auto size-12 text-muted-foreground/40 mb-4" />
                  <p className="text-base font-serif text-primary">Tu carrito está vacío</p>
                  <p className="mt-1 text-xs text-muted-foreground">Explora nuestros marcos y añade tus favoritos.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {cartItems.map(({ product, quantity }) => (
                    <article key={product.id} className="flex gap-4 border-b border-border pb-6">
                      <div className={`size-24 shrink-0 overflow-hidden relative ${product.tone}`}>
                        <img src={product.image} alt={product.name} className="size-full object-cover mix-blend-multiply opacity-85" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-serif text-base text-primary leading-snug">{product.name}</h3>
                            <p className="mt-1 text-xs text-muted-foreground">{product.price} / unidad</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(product.id)}
                            className="text-muted-foreground hover:text-accent transition-colors"
                            aria-label={`Eliminar ${product.name}`}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center border border-border">
                            <button
                              onClick={() => updateQuantity(product.id, -1)}
                              className="grid size-8 place-items-center hover:bg-secondary"
                              aria-label="Reducir"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="grid size-8 place-items-center text-sm font-medium">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, 1)}
                              className="grid size-8 place-items-center hover:bg-secondary"
                              aria-label="Aumentar"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                          <strong className="text-sm font-semibold text-primary">
                            ${product.numericPrice * quantity} MXN
                          </strong>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-border bg-secondary/40 px-6 py-6">
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-primary">${subtotal} MXN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío asegurado en madera</span>
                  <span className="text-xs font-semibold text-accent uppercase">Gratis</span>
                </div>
                <div className="mt-2 flex justify-between border-t border-border pt-4 text-base font-semibold">
                  <span className="text-primary">Total final</span>
                  <span className="text-accent">${subtotal} MXN</span>
                </div>
              </div>
              <button
                disabled={cartItems.length === 0}
                className="mt-6 w-full bg-primary px-5 py-4 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceder al Pago
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Quick Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <button
            className="absolute inset-0 bg-primary/50 backdrop-blur-xs"
            aria-label="Cerrar modal"
            onClick={() => setSelectedProduct(null)}
          />
          <div className="relative w-full max-w-2xl bg-background border border-border shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute right-4 top-4 grid size-10 place-items-center hover:bg-secondary text-primary"
              aria-label="Cerrar detalles"
            >
              <X className="size-5" />
            </button>

            <div className="grid gap-8 sm:grid-cols-2">
              <div className={`relative aspect-square overflow-hidden ${selectedProduct.tone}`}>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="size-full object-cover mix-blend-multiply opacity-90"
                />
                {selectedProduct.badge && (
                  <span className="absolute left-3 top-3 bg-background/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                    {selectedProduct.badge}
                  </span>
                )}
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-accent">Detalle de Obra</p>
                  <h3 className="mt-1 font-serif text-3xl text-primary">{selectedProduct.name}</h3>
                  <p className="mt-3 text-2xl font-semibold text-accent">{selectedProduct.price}</p>
                  
                  <div className="mt-6 space-y-3 border-y border-border py-4 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Madera utilizada:</span>
                      <span className="font-semibold text-primary">{selectedProduct.wood}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Medidas exteriores:</span>
                      <span className="font-semibold text-primary">{selectedProduct.dimensions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Artesanía:</span>
                      <span className="font-semibold text-primary">100% hecho a mano en taller</span>
                    </div>
                  </div>

                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                    {selectedProduct.description}
                  </p>
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => {
                      addToCart(selectedProduct)
                      setSelectedProduct(null)
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary px-6 py-3.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <ShoppingBag className="size-4" /> Añadir al carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Volver a inicio</span>
            </a>
            <span className="text-border hidden sm:inline">|</span>
            <a href="/" className="font-serif text-2xl tracking-tight text-primary">
              Arte<span className="text-accent">Marco</span>
            </a>
          </div>

          {/* Quick Search */}
          <div className="hidden md:flex items-center relative w-72 lg:w-96">
            <Search className="absolute left-3 size-4 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por madera, medida..."
              className="w-full bg-secondary/50 border border-border pl-9 pr-8 py-2 text-xs text-primary placeholder:text-muted-foreground outline-none focus:border-accent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 text-muted-foreground hover:text-primary"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2.5 bg-secondary px-4 py-2.5 text-xs font-semibold text-primary hover:bg-secondary/80 transition-colors"
              aria-label={`Carrito, ${cartCount} artículos`}
            >
              <ShoppingBag className="size-4" />
              <span className="hidden sm:inline">Carrito</span>
              <span className="grid size-5 place-items-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="border-b border-border bg-secondary/30 px-5 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                <Sparkles className="size-3.5" /> Catálogo Completo del Taller
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-primary tracking-tight">
                Todos Nuestros Marcos
              </h1>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
                Explora cada una de nuestras piezas hechas a mano con maderas nobles seleccionadas.
                Cada marco es tratado con aceites y ceras naturales para garantizar su longevidad y realzar su textura única.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-serif text-3xl font-bold text-primary">{filteredProducts.length}</span>
              <span>marcos disponibles en catálogo</span>
            </div>
          </div>

          {/* Search bar on mobile */}
          <div className="mt-6 md:hidden relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por tipo de madera o dimensiones..."
              className="w-full bg-background border border-border pl-9 pr-8 py-3 text-xs text-primary placeholder:text-muted-foreground outline-none focus:border-accent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Filter and Sort Toolbar */}
      <section className="border-b border-border sticky top-20 z-30 bg-background/95 backdrop-blur px-5 lg:px-8 py-3.5">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors border ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-primary'
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-2 text-xs">
            <SlidersHorizontal className="size-3.5 text-muted-foreground" />
            <span className="text-muted-foreground hidden sm:inline">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border border-border px-3 py-1.5 text-xs text-primary outline-none focus:border-accent font-medium cursor-pointer"
            >
              <option value="default">Recomendados</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="name">Alfabético (A - Z)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Main Catalog Grid */}
      <main className="flex-1 px-5 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          {filteredProducts.length === 0 ? (
            <div className="flex min-h-80 flex-col items-center justify-center gap-4 text-center border border-dashed border-border p-8">
              <Search className="size-10 text-muted-foreground/40" />
              <h3 className="font-serif text-2xl text-primary">No encontramos ningún marco con estos criterios</h3>
              <p className="max-w-md text-xs text-muted-foreground">
                Prueba a restablecer los filtros de búsqueda o seleccionar otra categoría de madera para explorar más opciones.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('todos')
                  setSortBy('default')
                }}
                className="mt-2 border border-accent px-5 py-2.5 text-xs font-semibold text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Limpiar todos los filtros
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="group flex flex-col justify-between border border-border bg-card p-4 transition-all duration-300 hover:shadow-lg hover:border-primary/40"
                >
                  <div>
                    {/* Image Box */}
                    <div className={`relative aspect-[4/5] overflow-hidden ${product.tone}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="size-full object-cover mix-blend-multiply opacity-85 transition duration-500 group-hover:scale-105"
                      />
                      {product.badge && (
                        <div className="absolute left-3 top-3 bg-background/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary shadow-xs">
                          {product.badge}
                        </div>
                      )}
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="absolute bottom-3 right-3 grid size-8 place-items-center bg-background/90 text-primary opacity-0 shadow-md transition-all group-hover:opacity-100 hover:bg-accent hover:text-accent-foreground"
                        aria-label={`Ver detalles de ${product.name}`}
                        title="Ver detalles"
                      >
                        <Eye className="size-4" />
                      </button>
                    </div>

                    {/* Metadata */}
                    <div className="pt-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3
                            onClick={() => setSelectedProduct(product)}
                            className="font-serif text-lg text-primary cursor-pointer hover:text-accent transition-colors leading-snug"
                          >
                            {product.name}
                          </h3>
                          <p className="mt-1 text-xs text-muted-foreground">{product.detail}</p>
                        </div>
                        <p className="text-base font-semibold text-accent">{product.price}</p>
                      </div>
                      <p className="mt-2.5 line-clamp-2 text-xs text-muted-foreground/80 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-3 border-t border-border flex gap-2">
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 flex items-center justify-center gap-2 bg-primary py-2.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <ShoppingBag className="size-3.5" /> Añadir al carrito
                    </button>
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="grid size-9 place-items-center border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                      title="Detalle completo"
                    >
                      <Eye className="size-4" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Workshop Banner */}
      <section className="bg-primary text-primary-foreground px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">¿Buscas una medida personalizada?</p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Fabricamos marcos a medida de tu obra.</h2>
            <p className="mt-3 max-w-xl text-xs sm:text-sm text-primary-foreground/75 leading-relaxed">
              Si tu lámina, lienzo o fotografía requiere dimensiones especiales o una moldura personalizada, contáctanos directamente con nuestro maestro enmarcador.
            </p>
          </div>
          <a
            href="/#contacto"
            className="inline-flex items-center gap-2 bg-accent px-6 py-3.5 text-xs font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5 whitespace-nowrap"
          >
            Solicitar presupuesto a medida <ArrowRight className="size-4" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background px-5 py-10 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <a href="/" className="font-serif text-lg text-primary">
              Arte<span className="text-accent">Marco</span>
            </a>
            <span>· Taller de marcos de madera hechos a mano</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/" className="hover:text-primary transition-colors">Inicio</a>
            <a href="/#artesania" className="hover:text-primary transition-colors">Artesanía</a>
            <a href="/#contacto" className="hover:text-primary transition-colors">Contacto</a>
            <span>© 2026 ArteMarco</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
