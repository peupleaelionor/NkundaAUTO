import { setRequestLocale } from 'next-intl/server'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import WhatsAppButton from '@/components/public/WhatsAppButton'
import VehicleCard from '@/components/public/VehicleCard'
import type { Vehicle } from '@/types'

async function getVehicles(): Promise<Vehicle[]> {
  const vehicles = await prisma.vehicle.findMany({
    where: { isPublic: true },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
  })
  return vehicles.map((v) => ({
    ...v,
    photos: JSON.parse(v.photos) as string[],
    recommendedUsage: JSON.parse(v.recommendedUsage) as string[],
    status: v.status as Vehicle['status'],
  }))
}

export default async function VehiclesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const vehicles = await getVehicles()

  const brands = [...new Set(vehicles.map((v) => v.brand))].sort()

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F8FAFC]">
        {/* Header */}
        <div className="bg-[#0B1F3A] text-white py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Notre Stock</h1>
            <p className="text-gray-300">
              {vehicles.length} véhicule{vehicles.length !== 1 ? 's' : ''} disponible{vehicles.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Filter bar */}
          <div className="bg-white rounded-xl p-4 shadow-sm mb-8 border border-gray-100 flex flex-wrap gap-3">
            <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option>Toutes les marques</option>
              {brands.map((b) => <option key={b}>{b}</option>)}
            </select>
            <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option>Tous statuts</option>
              <option value="available">Disponible</option>
              <option value="reserved">Réservé</option>
            </select>
            <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option>Trier par</option>
              <option>Prix croissant</option>
              <option>Prix décroissant</option>
              <option>Plus récent</option>
            </select>
          </div>

          {/* Results */}
          {vehicles.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <div className="text-5xl mb-4">🚗</div>
              <p className="text-lg font-medium">Aucun véhicule disponible pour le moment</p>
              <p className="text-sm mt-2">Revenez bientôt ou utilisez notre service de recherche personnalisée</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer locale={locale} />
      <WhatsAppButton />
    </>
  )
}
