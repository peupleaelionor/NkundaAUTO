import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/prisma'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import HeroSection from '@/components/public/HeroSection'
import VehicleCard from '@/components/public/VehicleCard'
import TrustSection from '@/components/public/TrustSection'
import WhatsAppButton from '@/components/public/WhatsAppButton'
import Link from 'next/link'
import type { Vehicle } from '@/types'

async function getFeaturedVehicles(): Promise<Vehicle[]> {
  const vehicles = await prisma.vehicle.findMany({
    where: { featured: true, isPublic: true, status: { in: ['available', 'reserved'] } },
    orderBy: { createdAt: 'desc' },
    take: 6,
  })
  return vehicles.map((v) => ({
    ...v,
    photos: JSON.parse(v.photos) as string[],
    recommendedUsage: JSON.parse(v.recommendedUsage) as string[],
    status: v.status as Vehicle['status'],
  }))
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('home')
  const featured = await getFeaturedVehicles()

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />

        {/* Featured vehicles */}
        {featured.length > 0 && (
          <section className="py-16 px-4 bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-[#0B1F3A] mb-2">{t('featuredTitle')}</h2>
                <p className="text-gray-600">{t('featuredSubtitle')}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featured.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} locale={locale} />
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  href={`/${locale}/vehicules`}
                  className="inline-flex items-center gap-2 bg-[#0B1F3A] text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-900 transition-colors"
                >
                  {t('viewAll')} →
                </Link>
              </div>
            </div>
          </section>
        )}

        <TrustSection />

        {/* Testimonials placeholder */}
        <section className="py-16 px-4 bg-[#0B1F3A] text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">{t('trustTitle')}</h2>
            <p className="text-gray-300 mb-8">{t('trustSubtitle')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { name: 'Jean-Paul K.', city: 'Kinshasa', quote: 'Service exceptionnel ! J\'ai trouvé ma Land Cruiser en 3 jours.' },
                { name: 'Marie N.', city: 'Lubumbashi', quote: 'Livraison rapide et véhicule conforme à la description. Merci NkundaAuto!' },
                { name: 'Antoine M.', city: 'Diaspora (Paris)', quote: 'J\'ai acheté pour ma famille depuis la France. Tout s\'est passé parfaitement.' },
              ].map((t) => (
                <div key={t.name} className="bg-white/10 rounded-xl p-5 text-left">
                  <p className="text-sm text-gray-300 italic mb-3">&ldquo;{t.quote}&rdquo;</p>
                  <div>
                    <div className="font-semibold text-[#F59E0B] text-sm">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.city}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-16 px-4 bg-[#F8FAFC]">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#0B1F3A] mb-4">
              Vous ne trouvez pas ce que vous cherchez ?
            </h2>
            <p className="text-gray-600 mb-8">
              Décrivez le véhicule de vos rêves et nous le trouvons pour vous.
            </p>
            <Link
              href={`/${locale}/trouver-mon-vehicule`}
              className="inline-flex items-center gap-2 bg-[#F59E0B] text-[#0B1F3A] font-bold px-8 py-4 rounded-lg hover:bg-yellow-400 transition-colors text-lg"
            >
              Trouver mon véhicule →
            </Link>
          </div>
        </section>
      </main>
      <Footer locale={locale} />
      <WhatsAppButton />
    </>
  )
}
