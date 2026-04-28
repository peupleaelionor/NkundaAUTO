import { getTranslations, setRequestLocale } from 'next-intl/server'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import WhatsAppButton from '@/components/public/WhatsAppButton'
import { Shield, CheckCircle, Headphones, Award, Star } from 'lucide-react'

export default async function ConfiancePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('trust')

  const items = [
    { icon: CheckCircle, key: 'transparency', color: 'text-green-500' },
    { icon: Shield, key: 'inspection', color: 'text-blue-500' },
    { icon: Headphones, key: 'support', color: 'text-purple-500' },
    { icon: Award, key: 'secure', color: 'text-[#F59E0B]' },
  ] as const

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F8FAFC]">
        <div className="bg-[#0B1F3A] text-white py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
            <p className="text-gray-300 text-lg">{t('subtitle')}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
            {items.map(({ icon: Icon, key, color }) => (
              <div key={key} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 flex gap-4">
                <div className="shrink-0">
                  <Icon className={`h-8 w-8 ${color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-[#0B1F3A] text-lg mb-2">{t(`${key}.title`)}</h3>
                  <p className="text-gray-600">{t(`${key}.desc`)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="bg-[#0B1F3A] rounded-2xl p-8 text-white grid grid-cols-2 sm:grid-cols-4 gap-6 text-center mb-16">
            {[
              { value: '200+', label: 'Véhicules vendus' },
              { value: '5 ans', label: "D'expérience" },
              { value: '100%', label: 'Véhicules inspectés' },
              { value: '98%', label: 'Clients satisfaits' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-[#F59E0B] mb-1">{stat.value}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div>
            <h2 className="text-2xl font-bold text-[#0B1F3A] mb-6 text-center">Ce que disent nos clients</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { name: 'Jean-Paul K.', city: 'Kinshasa', rating: 5, quote: 'Service exceptionnel ! J\'ai trouvé ma Land Cruiser en 3 jours. Très professionnel et transparent.' },
                { name: 'Marie N.', city: 'Lubumbashi', rating: 5, quote: 'Livraison rapide et véhicule conforme à la description. Je recommande vivement NkundaAuto!' },
                { name: 'Antoine M.', city: 'Diaspora (Paris)', rating: 5, quote: 'J\'ai acheté pour ma famille depuis la France. Tout s\'est passé parfaitement, sans stress.' },
              ].map((review) => (
                <div key={review.name} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm italic mb-4">&ldquo;{review.quote}&rdquo;</p>
                  <div>
                    <div className="font-semibold text-[#0B1F3A] text-sm">{review.name}</div>
                    <div className="text-xs text-gray-400">{review.city}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer locale={locale} />
      <WhatsAppButton />
    </>
  )
}
