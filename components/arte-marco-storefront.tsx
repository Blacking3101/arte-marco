'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  ArrowRight,
  Camera,
  Hammer,
  Menu,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from 'lucide-react'

import { allProducts, Product, getStoredProducts, deleteCustomProduct } from '@/lib/products'
import { useAuth } from '@/lib/auth-context'
import { AuthModal } from '@/components/auth-modal'
import { AddProductModal } from '@/components/add-product-modal'

export function ArteMarcoStorefront() {
  const { user, isOwner, logout } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [addProductModalOpen, setAddProductModalOpen] = useState(false)
  const [productsList, setProductsList] = useState<Product[]>(allProducts)

  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'temporada' | 'todos' | 'roble' | 'nogal' | 'pino' | 'recuperada' | 'especial'>('temporada')
  const [cartItems, setCartItems] = useState([
    { ...allProducts[0], quantity: 1 },
    { ...allProducts[1], quantity: 1 },
  ])
  const [notice, setNotice] = useState('')

  useEffect(() => {
    setProductsList(getStoredProducts())
  }, [])

  const currentSeasonProducts = productsList.filter((p) => p.isSeasonal)

  const catalogTabs = [
    { id: 'temporada', label: 'Selección de temporada', count: currentSeasonProducts.length },
    { id: 'todos', label: 'Todo el catálogo', count: productsList.length },
    { id: 'roble', label: 'Roble macizo', count: productsList.filter((p) => p.category === 'roble').length },
    { id: 'nogal', label: 'Nogal noble', count: productsList.filter((p) => p.category === 'nogal').length },
    { id: 'pino', label: 'Pino cálido', count: productsList.filter((p) => p.category === 'pino').length },
    { id: 'recuperada', label: 'Madera recuperada', count: productsList.filter((p) => p.category === 'recuperada').length },
  ]

  const normalizedSearch = searchTerm.trim().toLocaleLowerCase()

  const filteredProducts = useMemo(() => {
    let list = productsList
    if (normalizedSearch) {
      if (activeTab !== 'todos' && activeTab !== 'temporada') {
        list = list.filter((p) => p.category === activeTab)
      }
      return list.filter((product) =>
        `${product.name} ${product.detail} ${product.wood} ${product.category} ${product.description}`
          .toLocaleLowerCase()
          .includes(normalizedSearch),
      )
    }

    return activeTab === 'temporada'
      ? currentSeasonProducts
      : activeTab === 'todos'
      ? productsList
      : productsList.filter((p) => p.category === activeTab)
  }, [productsList, normalizedSearch, activeTab, currentSeasonProducts])
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const getUnitPrice = (item: { price: string; numericPrice?: number }) =>
    item.numericPrice ?? (Number.parseInt(item.price.replace(/[^0-9]/g, '')) || 0)
  const subtotal = cartItems.reduce((total, item) => total + getUnitPrice(item) * item.quantity, 0)

  function addToCart(name: string) {
    const product = productsList.find((item) => item.name === name) || allProducts.find((item) => item.name === name)
    if (!product) return
    setCartItems((items) => {
      const existing = items.find((item) => item.name === name)
      return existing
        ? items.map((item) => item.name === name ? { ...item, quantity: item.quantity + 1 } : item)
        : [...items, { ...product, quantity: 1 }]
    })
    setNotice(`«${name}» añadido a tu carrito`)
    window.setTimeout(() => setNotice(''), 2600)
  }

  function handleDeleteProduct(id: string, name: string) {
    if (confirm(`¿Eliminar «${name}» del catálogo?`)) {
      const updated = deleteCustomProduct(id)
      setProductsList(updated)
      setNotice(`«${name}» eliminado del catálogo`)
      window.setTimeout(() => setNotice(''), 2600)
    }
  }

  function updateQuantity(name: string, change: number) {
    setCartItems((items) => items.map((item) => item.name === name ? { ...item, quantity: Math.max(1, item.quantity + change) } : item))
  }

  function removeFromCart(name: string) {
    setCartItems((items) => items.filter((item) => item.name !== name))
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {notice && <div role="status" className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 bg-primary px-5 py-3 text-sm text-primary-foreground shadow-xl">{notice}</div>}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="cart-title">
          <button className="absolute inset-0 cursor-default bg-primary/35" aria-label="Cerrar carrito" onClick={() => setCartOpen(false)} />
          <aside className="relative flex h-full w-full max-w-md flex-col bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Tu selección</p><h2 id="cart-title" className="mt-1 font-serif text-3xl text-primary">Tu Carrito</h2></div>
              <button onClick={() => setCartOpen(false)} className="grid size-10 place-items-center hover:bg-secondary" aria-label="Cerrar carrito"><X /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {cartItems.length === 0 ? <p className="py-16 text-center text-sm text-muted-foreground">Tu carrito está vacío.</p> : <div className="flex flex-col gap-6">{cartItems.map((item) => <article key={item.name} className="flex gap-4 border-b border-border pb-6">
                <img src={item.image} alt="" className="size-24 shrink-0 object-cover" />
                <div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><h3 className="font-serif text-lg text-primary">{item.name}</h3><p className="mt-1 text-xs text-muted-foreground">{item.price} / unidad</p></div><button onClick={() => removeFromCart(item.name)} className="text-muted-foreground hover:text-accent" aria-label={`Eliminar ${item.name}`}><Trash2 /></button></div>
                  <div className="mt-4 flex items-center justify-between"><div className="flex items-center border border-border"><button onClick={() => updateQuantity(item.name, -1)} className="grid size-8 place-items-center hover:bg-secondary" aria-label={`Reducir cantidad de ${item.name}`}><Minus /></button><span className="grid size-8 place-items-center text-sm" aria-label={`Cantidad: ${item.quantity}`}>{item.quantity}</span><button onClick={() => updateQuantity(item.name, 1)} className="grid size-8 place-items-center hover:bg-secondary" aria-label={`Aumentar cantidad de ${item.name}`}><Plus /></button></div><strong className="text-sm text-primary">${getUnitPrice(item) * item.quantity} MXN</strong></div>
                </div>
              </article>)}</div>}
            </div>
            <div className="border-t border-border bg-secondary/50 px-6 py-6"><div className="flex flex-col gap-3 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="text-primary">${subtotal} MXN</span></div><div className="flex justify-between"><span className="text-muted-foreground">Envío</span><span className="text-primary">Por calcular</span></div><div className="mt-2 flex justify-between border-t border-border pt-4 text-base font-semibold"><span className="text-primary">Total final</span><span className="text-accent">${subtotal} MXN</span></div></div><button className="mt-6 w-full bg-primary px-5 py-4 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5">Proceder al Pago</button></div>
          </aside>
        </div>
      )}
      {isOwner && (
        <div className="bg-primary border-b border-accent/40 text-primary-foreground px-5 py-2 text-xs">
          <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex size-2 rounded-full bg-accent animate-pulse" />
              <span className="font-semibold text-accent">Modo Taller / Dueño:</span>
              <span className="opacity-90">{user?.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAddProductModalOpen(true)}
                className="flex items-center gap-1.5 bg-accent px-3 py-1 font-semibold text-accent-foreground hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Plus className="size-3.5" />   Agregar Cuadro
              </button>
              <button
                type="button"
                onClick={logout}
                className="text-primary-foreground/75 hover:text-accent transition-colors cursor-pointer"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <a href="#inicio" className="font-serif text-2xl tracking-tight text-primary">Arte<span className="text-accent">Marco</span></a>
          <nav className="hidden items-center gap-8 text-sm font-medium lg:flex" aria-label="Principal">
            <a className="text-accent" href="#inicio">Inicio</a><a href="#catalogo" onClick={() => setActiveTab('todos')} className="transition-colors hover:text-accent">Catálogo</a><a href="#artesania" className="transition-colors hover:text-accent">Artesanía</a><a href="#contacto" className="transition-colors hover:text-accent">Contacto</a>
          </nav>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen((open) => !open)}
              className={`grid size-10 place-items-center hover:bg-secondary transition-colors cursor-pointer ${
                searchOpen || searchTerm ? 'text-accent' : 'text-primary'
              }`}
              aria-label={searchOpen ? 'Cerrar búsqueda' : 'Buscar en catálogo'}
              aria-expanded={searchOpen}
            >
              <Search className="size-5" />
            </button>
            <button
              onClick={() => setAuthModalOpen(true)}
              className={`relative hidden size-10 place-items-center hover:bg-secondary sm:grid cursor-pointer transition-colors ${
                user ? 'text-accent' : 'text-primary'
              }`}
              aria-label={user ? `Perfil de ${user.name}` : 'Iniciar sesión'}
            >
              <UserRound />
              {user && (
                <span className="absolute bottom-1 right-1 size-2.5 rounded-full bg-accent ring-2 ring-background" />
              )}
            </button>
            <button onClick={() => setCartOpen(true)} className="relative grid size-10 place-items-center hover:bg-secondary" aria-label={`Carrito, ${cartCount} artículos`}><ShoppingBag /><span className="absolute right-0 top-0 grid size-4 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">{cartCount}</span></button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="grid size-10 place-items-center lg:hidden" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}>{menuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
        {searchOpen && (
          <div className="border-t border-border/70 bg-secondary/85 px-5 py-4 lg:px-8 shadow-lg backdrop-blur-xs">
            <div className="mx-auto max-w-7xl">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setActiveTab('todos')
                  const el = document.getElementById('catalogo')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
                className="flex items-center gap-3 border-b border-primary/40 pb-2"
              >
                <Search className="shrink-0 text-accent size-5" />
                <label htmlFor="catalog-search" className="sr-only">Buscar en el catálogo</label>
                <input
                  id="catalog-search"
                  autoFocus
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') setSearchOpen(false)
                  }}
                  placeholder="Buscar por marco, madera (roble, nogal, cedro, pino), medidas o estilo..."
                  className="min-w-0 flex-1 bg-transparent py-2 text-sm text-primary outline-none placeholder:text-muted-foreground font-medium"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="grid size-8 place-items-center text-muted-foreground hover:text-accent cursor-pointer"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="size-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer whitespace-nowrap"
                >
                  Buscar
                </button>
              </form>

              {/* Vista previa de resultados instantáneos */}
              {searchTerm.trim().length > 0 && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-muted-foreground">
                      {filteredProducts.length === 1
                        ? '1 marco encontrado'
                        : `${filteredProducts.length} marcos encontrados`}
                    </p>
                    <a
                      href="#catalogo"
                      onClick={() => setSearchOpen(false)}
                      className="text-xs font-semibold text-accent hover:underline flex items-center gap-1"
                    >
                      Ver en el catálogo <ArrowRight className="size-3" />
                    </a>
                  </div>

                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-h-60 overflow-y-auto pr-1">
                      {filteredProducts.slice(0, 4).map((item) => (
                        <div
                          key={item.id || item.name}
                          className="flex items-center gap-3 bg-background/90 p-2.5 border border-border hover:border-accent transition-colors"
                        >
                          <div className={`size-12 shrink-0 overflow-hidden ${item.tone}`}>
                            <img src={item.image} alt={item.name} className="size-full object-cover mix-blend-multiply opacity-85" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-serif text-xs text-primary truncate font-medium">{item.name}</h4>
                            <p className="text-[11px] text-muted-foreground truncate">{item.detail}</p>
                            <span className="text-xs font-bold text-accent">{item.price}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => addToCart(item.name)}
                            className="size-7 grid place-items-center bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer shrink-0"
                            title="Añadir al carrito"
                          >
                            <ShoppingBag className="size-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground py-2">
                      No encontramos ningún marco que coincida con &quot;{searchTerm}&quot;.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {menuOpen && <nav className="flex flex-col gap-1 border-t border-border/70 px-5 py-4 lg:hidden" aria-label="Menú móvil"><a href="#inicio" onClick={() => setMenuOpen(false)} className="px-3 py-2">Inicio</a><a href="#catalogo" onClick={() => { setMenuOpen(false); setActiveTab('todos') }} className="px-3 py-2">Catálogo</a><a href="#artesania" onClick={() => setMenuOpen(false)} className="px-3 py-2">Artesanía</a><a href="#contacto" onClick={() => setMenuOpen(false)} className="px-3 py-2">Contacto</a><button onClick={() => { setMenuOpen(false); setAuthModalOpen(true) }} className="flex items-center gap-2 px-3 py-2 text-left font-medium text-primary hover:text-accent cursor-pointer"><UserRound className="size-4 text-accent" /><span>{user ? `Mi cuenta (${isOwner ? 'Dueño' : user.name})` : 'Iniciar sesión'}</span></button></nav>}
      </header>

      <section id="inicio" className="mx-auto grid max-w-7xl gap-10 px-5 pb-20 pt-12 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-20 lg:px-8 lg:pb-28 lg:pt-20">
        <div className="max-w-xl">
          <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-accent"><span className="h-px w-9 bg-accent" /> Hecho para durar</p>
          <h1 className="text-balance font-serif text-5xl leading-[0.98] tracking-tight text-primary sm:text-6xl lg:text-7xl">Marcos únicos <em className="font-serif font-normal text-accent">tallados a mano</em> para tus mejores recuerdos.</h1>
          <p className="mt-7 max-w-md text-base leading-7 text-muted-foreground">Madera con historia, manos expertas y acabados que convierten cada imagen en una pieza para atesorar.</p>
          <div className="mt-9 flex flex-wrap items-center gap-5"><a href="#catalogo" onClick={() => setActiveTab('todos')} className="inline-flex items-center gap-3 bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5">Explorar catálogo <ArrowRight /></a><a href="#artesania" className="text-sm font-semibold text-primary underline decoration-accent decoration-2 underline-offset-8">Conoce nuestro proceso</a></div>
          <div className="mt-14 flex gap-8 border-t border-border pt-5 text-xs text-muted-foreground"><span><strong className="mr-1 text-primary">100%</strong> madera natural</span><span><strong className="mr-1 text-primary">+15 años</strong> de oficio</span></div>
        </div>
        <div className="relative min-h-[460px] overflow-hidden bg-secondary sm:min-h-[560px]"><img src="/arte-marco-hero.png" alt="Marco de nogal tallado a mano en un estudio cálido" className="absolute inset-0 size-full object-cover" /><div className="absolute bottom-5 left-5 bg-background/90 px-5 py-4 backdrop-blur"><p className="font-serif text-lg text-primary">El valor de lo hecho a mano</p><p className="mt-1 text-xs text-muted-foreground">Cada pieza es irrepetible</p></div></div>
      </section>

      <section id="catalogo" className="bg-primary px-5 py-20 text-primary-foreground lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                {activeTab === 'temporada' ? 'Selección de temporada' : 'Catálogo completo del taller'}
              </p>
              <h2 className="font-serif text-4xl tracking-tight sm:text-5xl">Nuestras Obras</h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {isOwner && (
                <button
                  type="button"
                  onClick={() => setAddProductModalOpen(true)}
                  className="flex items-center gap-1.5 bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground hover:opacity-90 transition-all shadow-sm cursor-pointer"
                >
                  <Plus className="size-4" /> Agregar Cuadro
                </button>
              )}
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'todos' ? 'temporada' : 'todos')}
                className="group flex items-center gap-2 text-sm font-semibold text-primary-foreground/85 transition-colors hover:text-accent cursor-pointer"
              >
                {activeTab === 'todos' ? (
                  <>
                    Ver selección de temporada ({currentSeasonProducts.length}){' '}
                    <ArrowRight className="size-4 rotate-180 transition-transform group-hover:-translate-x-1" />
                  </>
                ) : (
                  <>
                    Ver todo el catálogo ({productsList.length} marcos){' '}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Pestañas de categorías y buscador integrado dentro del catálogo */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-primary-foreground/15 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              {catalogTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-accent text-accent-foreground shadow-sm'
                      : 'bg-primary-foreground/10 text-primary-foreground/75 hover:bg-primary-foreground/20 hover:text-primary-foreground'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Input de búsqueda rápido en catálogo */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-primary-foreground/60" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar por madera o medida..."
                className="w-full bg-primary-foreground/10 border border-primary-foreground/20 pl-9 pr-8 py-2 text-xs text-primary-foreground placeholder:text-primary-foreground/50 outline-none focus:border-accent"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-primary-foreground/60 hover:text-accent cursor-pointer"
                  aria-label="Limpiar filtro de búsqueda"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Banner de estado de búsqueda activa */}
          {searchTerm && (
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3 bg-primary-foreground/10 px-4 py-3 border border-primary-foreground/15 text-xs">
              <div className="flex items-center gap-2">
                <Search className="size-4 text-accent" />
                <span>
                  Resultados para: <strong className="text-accent">&quot;{searchTerm}&quot;</strong> ({filteredProducts.length} marcos encontrados)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="flex items-center gap-1.5 text-accent hover:text-accent-foreground font-semibold cursor-pointer underline"
              >
                Limpiar búsqueda y ver todo <X className="size-3.5" />
              </button>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-5 text-center">
              <p className="font-serif text-2xl text-primary-foreground">No encontramos marcos que coincidan con tu búsqueda</p>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('')
                  setActiveTab('todos')
                }}
                className="border border-accent px-5 py-3 text-xs font-semibold text-accent transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
              >
                Limpiar búsqueda y ver todo
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((product, index) => (
                <article key={product.id || product.name} className="group flex flex-col justify-between">
                  <div>
                    <div className={`relative aspect-[4/5] overflow-hidden ${product.tone}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="size-full object-cover object-center mix-blend-multiply opacity-85 transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute left-4 top-4 bg-background/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                        {product.badge || (index === 0 ? 'Favorito' : 'Artesanal')}
                      </div>
                      {isOwner && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteProduct(product.id, product.name)
                          }}
                          title="Eliminar este marco del catálogo"
                          className="absolute right-3 top-3 grid size-8 place-items-center bg-background/90 text-destructive hover:bg-destructive hover:text-destructive-foreground shadow-xs transition-colors cursor-pointer z-10"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </div>
                    <div className="flex items-start justify-between gap-2 pt-4">
                      <div>
                        <h3 className="font-serif text-lg">{product.name}</h3>
                        <p className="mt-1 text-xs text-primary-foreground/60">{product.detail}</p>
                      </div>
                      <p className="text-sm font-semibold text-accent">{product.price}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => addToCart(product.name)}
                    className="mt-4 flex w-full items-center justify-center gap-2 border border-primary-foreground/25 py-3 text-xs font-semibold transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  >
                    <ShoppingBag /> Añadir al carrito
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="artesania" className="bg-secondary px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto max-w-7xl"><div className="max-w-xl"><p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-accent">El oficio detrás de cada pieza</p><h2 className="font-serif text-4xl leading-tight tracking-tight text-primary sm:text-5xl">La belleza está en el proceso.</h2></div><div className="mt-14 grid gap-10 md:grid-cols-3">{[{icon: Sparkles, title: 'Seleccionamos la madera', body: 'Buscamos vetas con carácter y maderas nobles que envejezcan con belleza.'}, {icon: Hammer, title: 'Tallamos a mano', body: 'Cada moldura recibe el tiempo y la atención de nuestras manos expertas.'}, {icon: ArrowRight, title: 'Cuidamos el acabado', body: 'Aceites y ceras naturales protegen la pieza sin esconder su historia.'}].map(({ icon: Icon, title, body }, i) => <div key={title} className="border-t border-primary/20 pt-5"><div className="mb-8 flex items-center justify-between"><Icon className="text-accent" /><span className="font-serif text-3xl text-primary/30">0{i + 1}</span></div><h3 className="font-serif text-2xl text-primary">{title}</h3><p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">{body}</p></div>)}</div></div></section>

      <footer id="contacto" className="bg-background px-5 pb-8 pt-20 lg:px-8 lg:pt-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 border-b border-border pb-16 md:grid-cols-[1.2fr_0.7fr_0.7fr_1.3fr]">
            <div>
              <a href="#inicio" className="font-serif text-2xl text-primary">
                Arte<span className="text-accent">Marco</span>
              </a>
              <p className="mt-5 max-w-xs text-sm leading-6 text-muted-foreground">
                Marcos hechos despacio, para recuerdos que merecen quedarse.
              </p>
            </div>
            <div>
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-wider text-primary">Explora</h3>
              <div className="flex flex-col gap-3 text-sm text-muted-foreground">
                <a href="#catalogo" onClick={() => setActiveTab('todos')} className="hover:text-accent">Catálogo</a>
                <a href="#artesania" className="hover:text-accent">Nuestra artesanía</a>
                <a href="#contacto" className="hover:text-accent">Contacto</a>
              </div>
            </div>
            <div>
              <h3 className="mb-5 text-xs font-semibold uppercase tracking-wider text-primary">Visítanos</h3>
              <p className="text-sm leading-6 text-muted-foreground">
                Calle del Olivo, 18<br />
                28012 Madrid<br />
                L–V, 10:00–18:00
              </p>
            </div>
            <div>
              <h3 className="mb-5 font-serif text-2xl text-primary">Una carta de inspiración</h3>
              <p className="mb-5 text-sm leading-6 text-muted-foreground">
                Novedades, historias del taller y piezas especiales una vez al mes.
              </p>
              <form className="flex border-b border-primary" onSubmit={(event) => event.preventDefault()}>
                <label htmlFor="email" className="sr-only">Tu email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Tu email"
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                  required
                />
                <button aria-label="Suscribirse" className="px-2 text-accent">
                  <ArrowRight />
                </button>
              </form>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-4 pt-6 text-xs text-muted-foreground sm:flex-row">
            <span>© 2026 ArteMarco. Hecho a mano en Madrid.</span>
            <span className="flex items-center gap-2">Síguenos <Camera /></span>
          </div>
        </div>
      </footer>

      {/* Modales de Autenticación y Agregar Cuadro */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onOpenAddProduct={() => setAddProductModalOpen(true)}
      />
      <AddProductModal
        isOpen={addProductModalOpen}
        onClose={() => setAddProductModalOpen(false)}
        onProductAdded={(updated) => {
          setProductsList(updated)
          setActiveTab('todos')
          setNotice('¡Nuevo cuadro agregado al catálogo con éxito!')
          window.setTimeout(() => setNotice(''), 2800)
        }}
      />
    </main>
  )
}
