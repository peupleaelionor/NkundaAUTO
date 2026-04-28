import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const leadSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  whatsapp: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  city: z.string().optional().nullable(),
  budgetMin: z.coerce.number().optional().nullable(),
  budgetMax: z.coerce.number().optional().nullable(),
  desiredBrand: z.string().optional().nullable(),
  desiredModel: z.string().optional().nullable(),
  usage: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  source: z.string().default('website'),
  status: z.string().default('new'),
  diaspora: z.boolean().default(false),
  assignedToId: z.string().optional().nullable(),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const limit = parseInt(searchParams.get('limit') ?? '100')

  const where: Record<string, unknown> = {}
  if (status) where.status = status

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { assignedTo: { select: { id: true, name: true } } },
  })

  return NextResponse.json(leads)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = leadSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const lead = await prisma.lead.create({ data: parsed.data })
  return NextResponse.json(lead, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

  const body = await req.json()
  const parsed = leadSchema.partial().safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const lead = await prisma.lead.update({ where: { id }, data: parsed.data })
  return NextResponse.json(lead)
}
