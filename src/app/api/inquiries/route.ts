import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const inquirySchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email().optional().nullable(),
  vehicleId: z.string().optional().nullable(),
  type: z.enum(['question', 'reserve', 'request_video', 'sourcing']),
  message: z.string().optional().nullable(),
  diaspora: z.boolean().default(false),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = inquirySchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { name, phone, email, vehicleId, type, message, diaspora } = parsed.data

  // Create or find lead
  let lead = await prisma.lead.findFirst({ where: { phone } })
  if (!lead) {
    lead = await prisma.lead.create({
      data: {
        name,
        phone,
        email: email ?? null,
        source: 'website',
        status: 'new',
        diaspora,
      },
    })
  }

  // Create inquiry
  const inquiry = await prisma.vehicleInquiry.create({
    data: {
      vehicleId: vehicleId ?? null,
      leadId: lead.id,
      type,
      message: message ?? null,
    },
  })

  return NextResponse.json({ inquiry, lead }, { status: 201 })
}
