import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import WhatsAppButton from '@/components/public/WhatsAppButton'
import { formatPrice, formatMileage, buildWhatsAppUrl } from '@/lib/utils'
import { MapPin, Fuel, Settings, Gauge, Calendar, ArrowLeft, MessageCircle } from 'lucide-react'
import type { Vehicle } from '@/types'

async function getVehicle(slug: string): Promise<Vehicle | null> {
  const v = await prisma.vehicle.findUnique({ where: { slug } })
  if (!v) return null
  return {
    ...v,
    photos: JSON.parse(v.photos) as string[],
    recommendedUsage: JSON.parse(v.recommendedUsage) as string[],
    status: v.status as Vehicle['status'],
  }
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

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const vehicle = await getVehicle(slug)

  if (!vehicle || !vehicle.isPublic) notFound()

  const photos = vehicle.photos.length > 0
    ? vehicle.photos
    : [`https://picsum.photos/seed/${vehicle.slug}/800/600`]

  const status = statusConfig[vehicle.status] ?? statusConfig.available

  const whatsappMsg = `Bonjour NkundaAuto, je suis intéressé par le véhicule: ${vehicle.title} (${vehicle.year}) - ${formatPrice(vehicle.price, vehicle.currency)}`

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <Link
            href={`/${locale}/vehicules`}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0B1F3A] mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au stock
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Photos + Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main photo */}
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={photos[0]}
                  alt={vehicle.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                />
                <div className="absolute top-3 left-3">
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${status.className}`}>
                    {status.label}
                  </span>
                </div>
              </div>

              {/* Photo thumbnails */}
              {photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {photos.map((photo, i) => (
                    <div key={i} className="relative w-20 h-16 shrink-0 rounded-lg overflow-hidden">
                      <Image src={photo} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="80px" />
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              {vehicle.description && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="font-semibold text-[#0B1F3A] mb-3 text-lg">Description</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">{vehicle.description}</p>
                </div>
              )}

              {/* Specs */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="font-semibold text-[#0B1F3A] mb-4 text-lg">Caractéristiques</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { icon: Calendar, label: 'Année', value: String(vehicle.year) },
                    { icon: Gauge, label: 'Kilométrage', value: vehicle.mileage ? formatMileage(vehicle.mileage) : 'N/A' },
                    { icon: Fuel, label: 'Carburant', value: vehicle.fuelType },
                    { icon: Settings, label: 'Transmission', value: vehicle.transmission },
                    { icon: MapPin, label: 'Ville', value: vehicle.city },
                    { icon: MapPin, label: 'État', value: conditionLabels[vehicle.condition] ?? vehicle.condition },
                  ].map((spec) => {
                    const Icon = spec.icon
                    return (
                      <div key={spec.label} className="flex items-start gap-3 p-3 bg-[#F8FAFC] rounded-lg">
                        <Icon className="h-4 w-4 text-[#F59E0B] mt-0.5 shrink-0" />
                        <div>
                          <div className="text-xs text-gray-500">{spec.label}</div>
                          <div className="text-sm font-medium text-[#0B1F3A]">{spec.value}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right: Sidebar */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                <h1 className="text-xl font-bold text-[#0B1F3A] mb-2">{vehicle.title}</h1>

                <div className="text-3xl font-bold text-[#F59E0B] mb-4">
                  {formatPrice(vehicle.price, vehicle.currency)}
                </div>

                <div className="space-y-3">
                  {vehicle.status === 'available' && (
                    <>
                      <a
                        href={buildWhatsAppUrl(whatsappMsg)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <MessageCircle className="h-5 w-5" />
                        Je suis intéressé — WhatsApp
                      </a>
                      <a
                        href={buildWhatsAppUrl(`Bonjour, je voudrais réserver: ${vehicle.title}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full border-2 border-[#0B1F3A] text-[#0B1F3A] font-semibold py-3 rounded-lg hover:bg-[#0B1F3A] hover:text-white transition-colors"
                      >
                        Réserver ce véhicule
                      </a>
                    </>
                  )}

                  {vehicle.status === 'reserved' && (
                    <div className="bg-yellow-50 text-yellow-700 px-4 py-3 rounded-lg text-sm font-medium text-center">
                      Ce véhicule est actuellement réservé
                    </div>
                  )}

                  {vehicle.status === 'sold' && (
                    <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm font-medium text-center">
                      Ce véhicule a été vendu
                    </div>
                  )}

                  <a
                    href={buildWhatsAppUrl(`Bonjour, je voudrais une vidéo de: ${vehicle.title}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full text-sm text-gray-600 border border-gray-200 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    📹 Demander une vidéo
                  </a>
                </div>

                {/* Quick info */}
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {vehicle.city}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {vehicle.year}
                  </div>
                </div>
              </div>

              {vehicle.videoUrl && (
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <h3 className="font-medium text-[#0B1F3A] mb-3 text-sm">Vidéo</h3>
                  <a
                    href={vehicle.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Voir la vidéo →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer locale={locale} />
      <WhatsAppButton message={whatsappMsg} />
    </>
  )
}
