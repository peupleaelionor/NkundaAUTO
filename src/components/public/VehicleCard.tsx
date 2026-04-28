import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Fuel, Settings, Gauge, Calendar } from 'lucide-react'
import { formatPrice, formatMileage } from '@/lib/utils'
import type { Vehicle } from '@/types'

interface VehicleCardProps {
  vehicle: Vehicle
  locale: string
}

const statusConfig = {
  available: { label: 'Disponible', className: 'bg-green-100 text-green-700' },
  reserved: { label: 'Réservé', className: 'bg-yellow-100 text-yellow-700' },
  sold: { label: 'Vendu', className: 'bg-red-100 text-red-700' },
  archived: { label: 'Archivé', className: 'bg-gray-100 text-gray-700' },
}

const conditionLabels: Record<string, string> = {
  excellent: 'Excellent',
  bon: 'Bon',
  correct: 'Correct',
  a_reviser: 'À réviser',
}

export default function VehicleCard({ vehicle, locale }: VehicleCardProps) {
  const photos = vehicle.photos
  const firstPhoto = photos[0] ?? `https://picsum.photos/seed/${vehicle.slug}/400/300`
  const status = statusConfig[vehicle.status] ?? statusConfig.available

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col">
      {/* Photo */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={firstPhoto}
          alt={vehicle.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute top-2 left-2">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${status.className}`}>
            {status.label}
          </span>
        </div>
        {vehicle.featured && (
          <div className="absolute top-2 right-2">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#F59E0B] text-[#0B1F3A]">
              ⭐ Vedette
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-[#0B1F3A] text-base leading-snug mb-1">
          {vehicle.title}
        </h3>

        <div className="text-xl font-bold text-[#F59E0B] mb-3">
          {formatPrice(vehicle.price, vehicle.currency)}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            {vehicle.year}
          </div>
          {vehicle.mileage !== null && vehicle.mileage !== undefined && (
            <div className="flex items-center gap-1">
              <Gauge className="h-3.5 w-3.5 text-gray-400" />
              {formatMileage(vehicle.mileage)}
            </div>
          )}
          <div className="flex items-center gap-1">
            <Fuel className="h-3.5 w-3.5 text-gray-400" />
            {vehicle.fuelType}
          </div>
          <div className="flex items-center gap-1">
            <Settings className="h-3.5 w-3.5 text-gray-400" />
            {vehicle.transmission}
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
          <MapPin className="h-3.5 w-3.5" />
          {vehicle.city}
          <span className="mx-1">·</span>
          <span>{conditionLabels[vehicle.condition] ?? vehicle.condition}</span>
        </div>

        <div className="mt-auto pt-3 border-t border-gray-100">
          <Link
            href={`/${locale}/vehicules/${vehicle.slug}`}
            className="block w-full text-center bg-[#0B1F3A] text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-900 transition-colors"
          >
            Voir les détails
          </Link>
        </div>
      </div>
    </div>
  )
}
