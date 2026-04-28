import { Shield, Search, CheckCircle, Headphones } from 'lucide-react'

const trustItems = [
  {
    icon: CheckCircle,
    title: 'Véhicules inspectés',
    desc: 'Chaque véhicule passe une inspection complète avant mise en vente.',
  },
  {
    icon: Shield,
    title: 'Transparence totale',
    desc: 'Prix affichés, historique du véhicule, aucune surprise cachée.',
  },
  {
    icon: Search,
    title: 'Sourcing personnalisé',
    desc: 'Nous trouvons le véhicule de vos rêves si nous ne l\'avons pas en stock.',
  },
  {
    icon: Headphones,
    title: 'Support après-vente',
    desc: 'Nous restons disponibles après la vente pour tout besoin.',
  },
]

export default function TrustSection() {
  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#0B1F3A] mb-3">Pourquoi nous choisir ?</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            La confiance au cœur de chaque transaction
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="flex flex-col items-center text-center p-6 rounded-xl bg-[#F8FAFC] hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-[#F59E0B]/20 rounded-full flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-[#F59E0B]" />
                </div>
                <h3 className="font-semibold text-[#0B1F3A] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
