export interface Product {
  id: string
  name: string
  detail: string
  wood: string
  dimensions: string
  price: string
  numericPrice: number
  image: string
  tone: string
  badge?: string
  category: 'roble' | 'nogal' | 'pino' | 'recuperada' | 'especial'
  description: string
  isSeasonal?: boolean
}

export const allProducts: Product[] = [
  {
    id: 'roble-clasico',
    name: 'Marco de Roble Clásico',
    detail: '30 × 40 cm · Roble macizo',
    wood: 'Roble macizo europeo',
    dimensions: '30 × 40 cm',
    price: '$89 MXN',
    numericPrice: 89,
    image: '/arte-marco-hero.png',
    tone: 'bg-[#d8bda1]',
    badge: 'Favorito',
    category: 'roble',
    description: 'Moldura atemporal tallada en madera maciza de roble con acabado al aceite natural mate. Ideal para retratos y láminas botánicas.',
    isSeasonal: true,
  },
  {
    id: 'nogal-serena',
    name: 'Marco Nogal Serena',
    detail: '40 × 50 cm · Nogal natural',
    wood: 'Nogal español',
    dimensions: '40 × 50 cm',
    price: '$119 MXN',
    numericPrice: 119,
    image: '/arte-marco-hero.png',
    tone: 'bg-[#a88467]',
    badge: 'Artesanal',
    category: 'nogal',
    description: 'Veta profunda y tono cálido chocolate. Acabado satinado realizado a mano con cera de abeja natural.',
    isSeasonal: true,
  },
  {
    id: 'terracota',
    name: 'Marco Terracota',
    detail: '20 × 25 cm · Pino teñido',
    wood: 'Pino silvestre',
    dimensions: '20 × 25 cm',
    price: '$64 MXN',
    numericPrice: 64,
    image: '/arte-marco-hero.png',
    tone: 'bg-[#bd8064]',
    badge: 'Popular',
    category: 'pino',
    description: 'Pigmentos minerales naturales que aportan un matiz tierra cálido y mediterráneo a la madera.',
    isSeasonal: true,
  },
  {
    id: 'olivo-antiguo',
    name: 'Marco Olivo Antiguo',
    detail: '50 × 70 cm · Madera recuperada',
    wood: 'Olivo centenario recuperado',
    dimensions: '50 × 70 cm',
    price: '$145 MXN',
    numericPrice: 145,
    image: '/arte-marco-hero.png',
    tone: 'bg-[#b8ad91]',
    badge: 'Exclusivo',
    category: 'recuperada',
    description: 'Pieza única elaborada con madera de poda de olivos centenarios. Cada nudo y detalle tiene más de un siglo de historia.',
    isSeasonal: true,
  },
  {
    id: 'castano-profundo',
    name: 'Marco Castaño Profundo',
    detail: '40 × 60 cm · Castaño envejecido',
    wood: 'Castaño del norte',
    dimensions: '40 × 60 cm',
    price: '$105 MXN',
    numericPrice: 105,
    image: '/arte-marco-hero.png',
    tone: 'bg-[#8b5a2b]',
    badge: 'Taller',
    category: 'especial',
    description: 'Castaño tratado al humo para realzar la textura de la madera viva y conseguir una tonalidad oscura refinada.',
  },
  {
    id: 'haya-nordico',
    name: 'Marco Haya Nórdica',
    detail: '30 × 30 cm · Haya clara al natural',
    wood: 'Haya vaporizada',
    dimensions: '30 × 30 cm',
    price: '$78 MXN',
    numericPrice: 78,
    image: '/arte-marco-hero.png',
    tone: 'bg-[#e6ceb5]',
    badge: 'Minimal',
    category: 'especial',
    description: 'Líneas limpias y perfil esbelto. Diseñado para dar máxima luz y protagonismo a la obra enmarcada.',
  },
  {
    id: 'ebano-galeria',
    name: 'Marco Ébano Galería',
    detail: '50 × 70 cm · Fresno tintado oscuro',
    wood: 'Fresno tintado en carbón',
    dimensions: '50 × 70 cm',
    price: '$159 MXN',
    numericPrice: 159,
    image: '/arte-marco-hero.png',
    tone: 'bg-[#3a3532]',
    badge: 'Edición Limitada',
    category: 'especial',
    description: 'Inspirado en los marcos de museos y galerías de arte contemporáneo. Profundidad pronunciada tipo vitrina.',
  },
  {
    id: 'cedro-rustico',
    name: 'Marco Cedro Rústico',
    detail: '60 × 80 cm · Cedro tallado a gubia',
    wood: 'Cedro aromático',
    dimensions: '60 × 80 cm',
    price: '$175 MXN',
    numericPrice: 175,
    image: '/arte-marco-hero.png',
    tone: 'bg-[#c2845c]',
    badge: 'Gran Formato',
    category: 'recuperada',
    description: 'Marcas de gubia artesanal visibles en todo el bisel. Textura táctil orgánica con perfume natural de cedro.',
  },
  {
    id: 'cerezo-silvestre',
    name: 'Marco Cerezo Silvestre',
    detail: '24 × 30 cm · Cerezo dorado',
    wood: 'Cerezo macizo',
    dimensions: '24 × 30 cm',
    price: '$82 MXN',
    numericPrice: 82,
    image: '/arte-marco-hero.png',
    tone: 'bg-[#a65d57]',
    badge: 'Clásico',
    category: 'especial',
    description: 'Tonos rojizos dorados que evolucionan y ganan calidez con el paso de los años y la luz indirecta.',
  },
  {
    id: 'roble-blanco-estudio',
    name: 'Marco Roble Blanco Estudio',
    detail: '70 × 100 cm · Roble blanqueado',
    wood: 'Roble europeo al cal',
    dimensions: '70 × 100 cm',
    price: '$189 MXN',
    numericPrice: 189,
    image: '/arte-marco-hero.png',
    tone: 'bg-[#cfc5b8]',
    badge: 'Gran Formato',
    category: 'roble',
    description: 'Tratamiento a la cal tradicional que blanquea la veta manteniendo la textura natural del poro abierto.',
  },
  {
    id: 'pino-albar-dorado',
    name: 'Marco Pino Albar Cera',
    detail: '35 × 50 cm · Pino resinero pulido',
    wood: 'Pino resinero',
    dimensions: '35 × 50 cm',
    price: '$69 MXN',
    numericPrice: 69,
    image: '/arte-marco-hero.png',
    tone: 'bg-[#d1a877]',
    badge: 'Económico',
    category: 'pino',
    description: 'Pulido suave con varias capas de cera virgen. Tono miel acogedor que combina con cualquier ambiente rústico o moderno.',
  },
  {
    id: 'nogal-corte-vivo',
    name: 'Marco Nogal Canto Vivo',
    detail: '40 × 40 cm · Nogal con arista natural',
    wood: 'Nogal negro americano',
    dimensions: '40 × 40 cm',
    price: '$135 MXN',
    numericPrice: 135,
    image: '/arte-marco-hero.png',
    tone: 'bg-[#7e5e49]',
    badge: 'Pieza de Autor',
    category: 'nogal',
    description: 'Conserva el contorno natural del tronco en el marco exterior, convirtiendo cada unidad en una escultura irrepetible.',
  },
]

export const seasonalProducts = allProducts.filter((p) => p.isSeasonal)

export const CUSTOM_PRODUCTS_KEY = 'artemarco_custom_products'

export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return allProducts
  try {
    const saved = localStorage.getItem(CUSTOM_PRODUCTS_KEY)
    if (saved) {
      const customItems: Product[] = JSON.parse(saved)
      // Return custom items first, then base products (excluding duplicates if any)
      const customIds = new Set(customItems.map((p) => p.id))
      return [...customItems, ...allProducts.filter((p) => !customIds.has(p.id))]
    }
  } catch (e) {
    console.error('Error reading custom products from localStorage', e)
  }
  return allProducts
}

export function saveCustomProduct(newProduct: Product): Product[] {
  if (typeof window === 'undefined') return [newProduct, ...allProducts]
  try {
    const saved = localStorage.getItem(CUSTOM_PRODUCTS_KEY)
    const currentCustom: Product[] = saved ? JSON.parse(saved) : []
    const updated = [newProduct, ...currentCustom]
    localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(updated))
    return getStoredProducts()
  } catch (e) {
    console.error('Error saving custom product to localStorage', e)
    return [newProduct, ...allProducts]
  }
}

export function deleteCustomProduct(id: string): Product[] {
  if (typeof window === 'undefined') return allProducts.filter((p) => p.id !== id)
  try {
    const saved = localStorage.getItem(CUSTOM_PRODUCTS_KEY)
    if (saved) {
      const currentCustom: Product[] = JSON.parse(saved)
      const updated = currentCustom.filter((p) => p.id !== id)
      localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(updated))
    }
    return getStoredProducts().filter((p) => p.id !== id)
  } catch (e) {
    console.error('Error deleting product', e)
    return getStoredProducts().filter((p) => p.id !== id)
  }
}
