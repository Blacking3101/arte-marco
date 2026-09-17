import type { Metadata } from 'next'
import { CatalogoView } from '@/components/catalogo-view'

export const metadata: Metadata = {
  title: 'Catálogo Completo — ArteMarco',
  description: 'Explora toda nuestra colección de marcos artesanales hechos a mano en madera natural de roble, nogal, pino y maderas recuperadas.',
}

export default function CatalogoPage() {
  return <CatalogoView />
}
