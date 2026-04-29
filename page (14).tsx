import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/products - Tüm ürünleri getir (public)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')
  const search = searchParams.get('search')

  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...(category && { category: category as any }),
      ...(featured === 'true' && { featured: true }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    },
    include: { images: { where: { isPrimary: true }, take: 1 } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(products)
}

// POST /api/products - Yeni ürün ekle (admin only)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  const product = await prisma.product.create({
    data: {
      name: body.name,
      description: body.description,
      price: body.price,
      stock: body.stock || 0,
      sku: body.sku || null,
      filament: body.filament,
      category: body.category,
      printTimeH: body.printTimeH ? parseFloat(body.printTimeH) : null,
      dimensions: body.dimensions,
      layerHeight: body.layerHeight ? parseFloat(body.layerHeight) : 0.2,
      infill: body.infill ? parseInt(body.infill) : 20,
      featured: body.featured || false,
    },
  })

  return NextResponse.json(product, { status: 201 })
}
