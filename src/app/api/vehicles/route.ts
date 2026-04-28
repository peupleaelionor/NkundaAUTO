import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'
import { z } from 'zod'

const vehicleSchema = z.object({
  title: z.string().min(3),
  brand: z.string().min(1),
  model: z.string().min(1),
  year: z.coerce.number().min(1990),
  price: z.coerce.number().min(0),
  currency: z.string().default('USD'),
  mileage: z.coerce.number().optional().nullable(),
  fuelType: z.string(),
  transmission: z.string(),
  condition: z.string(),
  city: z.string(),
  description: z.string().optional().nullable(),
  status: z.string().default('available'),
  featured: z.boolean().default(false),
  isPublic: z.boolean().default(true),
  videoUrl: z.string().optional().nullable(),
  internalNotes: z.string().optional().nullable(),
  photos: z.array(z.string()).optional(),
  recommendedUsage: z.array(z.string()).optional(),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const featured = searchParams.get('featured')
  const limit = parseInt(searchParams.get('limit') ?? '50')
  const isPublic = searchParams.get('public')

  const where: Record<string, unknown> = {}
  if (status) where.status = status
  if (featured === 'true') where.featured = true
  if (isPublic === 'true') where.isPublic = true

  const vehicles = await prisma.vehicle.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  const result = vehicles.map((v) => ({
    ...v,
    photos: JSON.parse(v.photos),
    recommendedUsage: JSON.parse(v.recommendedUsage),
  }))

  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = vehicleSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data
  const baseSlug = slugify(`${data.brand}-${data.model}-${data.year}`)
  let slug = baseSlug
  let counter = 1

  while (await prisma.vehicle.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`
  }

  const vehicle = await prisma.vehicle.create({
    data: {
      ...data,
      slug,
      mileage: data.mileage ?? null,
      photos: JSON.stringify(data.photos ?? []),
      recommendedUsage: JSON.stringify(data.recommendedUsage ?? []),
    },
  })

  return NextResponse.json({
    ...vehicle,
    photos: JSON.parse(vehicle.photos),
    recommendedUsage: JSON.parse(vehicle.recommendedUsage),
  }, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

  const body = await req.json()
  const parsed = vehicleSchema.partial().safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data
  const updateData: Record<string, unknown> = { ...data }
  if (data.photos) updateData.photos = JSON.stringify(data.photos)
  if (data.recommendedUsage) updateData.recommendedUsage = JSON.stringify(data.recommendedUsage)

  const vehicle = await prisma.vehicle.update({
    where: { id },
    data: updateData,
  })

  return NextResponse.json({
    ...vehicle,
    photos: JSON.parse(vehicle.photos),
    recommendedUsage: JSON.parse(vehicle.recommendedUsage),
  })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

  await prisma.vehicle.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
