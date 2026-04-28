import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import VehicleForm from '@/components/admin/VehicleForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Vehicle } from '@/types'

async function getVehicle(id: string) {
  const v = await prisma.vehicle.findUnique({ where: { id } })
  if (!v) return null
  return {
    ...v,
    photos: JSON.parse(v.photos) as string[],
    recommendedUsage: JSON.parse(v.recommendedUsage) as string[],
    status: v.status as Vehicle['status'],
  }
}

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const vehicle = await getVehicle(id)

  if (!vehicle) notFound()

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <Link
          href="/admin/vehicules"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#0B1F3A] mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Link>
        <h1 className="text-2xl font-bold text-[#0B1F3A]">Modifier: {vehicle.title}</h1>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 max-w-3xl">
        <VehicleForm
          mode="edit"
          initialData={{
            id: vehicle.id,
            title: vehicle.title,
            brand: vehicle.brand,
            model: vehicle.model,
            yearStr: String(vehicle.year),
            priceStr: String(vehicle.price),
            currency: vehicle.currency,
            mileageStr: vehicle.mileage != null ? String(vehicle.mileage) : '',
            fuelType: vehicle.fuelType as 'essence' | 'diesel' | 'hybride' | 'electrique',
            transmission: vehicle.transmission as 'manuelle' | 'automatique',
            condition: vehicle.condition as 'excellent' | 'bon' | 'correct' | 'a_reviser',
            city: vehicle.city,
            description: vehicle.description ?? undefined,
            status: vehicle.status as 'available' | 'reserved' | 'sold' | 'archived',
            featured: vehicle.featured,
            isPublic: vehicle.isPublic,
            videoUrl: vehicle.videoUrl ?? '',
            internalNotes: vehicle.internalNotes ?? undefined,
          }}
        />
      </div>
    </div>
  )
}
