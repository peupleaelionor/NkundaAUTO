import { getTranslations, setRequestLocale } from 'next-intl/server'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import WhatsAppButton from '@/components/public/WhatsAppButton'
import { Car, ShoppingBag, Wrench, CreditCard, Globe, Truck } from 'lucide-react'

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('services')

  const services = [
    {
      icon: Car,
      key: 'buying',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: ShoppingBag,
      key: 'selling',
      color: 'bg-yellow-50 text-[#F59E0B]',
    },
    {
      icon: Wrench,
      key: 'inspection',
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: CreditCard,
      key: 'financing',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: Globe,
      key: 'diaspora',
      color: 'bg-orange-50 text-orange-600',
    },
    {
      icon: Truck,
      key: 'delivery',
      color: 'bg-red-50 text-red-600',
    },
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(({ icon: Icon, key, color }) => (
              <div key={key} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-[#0B1F3A] text-lg mb-2">{t(`${key}.title`)}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{t(`${key}.desc`)}</p>
              </div>
            ))}
          </div>

          {/* Process section */}
          <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#0B1F3A] mb-8 text-center">Comment ça marche ?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              {[
                { step: '01', title: 'Parcourez', desc: 'Explorez notre catalogue de véhicules en ligne' },
                { step: '02', title: 'Contactez', desc: 'Écrivez-nous sur WhatsApp pour plus d\'infos' },
                { step: '03', title: 'Inspectez', desc: 'Visitez ou recevez une vidéo du véhicule' },
                { step: '04', title: 'Finalisez', desc: 'Signez et récupérez votre véhicule en toute sécurité' },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <div className="w-12 h-12 bg-[#F59E0B] text-[#0B1F3A] font-bold text-lg rounded-full flex items-center justify-center mx-auto mb-3">
                    {s.step}
                  </div>
                  <h4 className="font-semibold text-[#0B1F3A] mb-1">{s.title}</h4>
                  <p className="text-sm text-gray-600">{s.desc}</p>
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
