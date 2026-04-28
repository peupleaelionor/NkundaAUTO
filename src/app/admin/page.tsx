import { prisma } from '@/lib/prisma'
import StatsCard from '@/components/admin/StatsCard'
import { Car, Users, TrendingUp, Clock } from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  const [totalVehicles, availableVehicles, totalLeads, newLeads, recentLeads] = await Promise.all([
    prisma.vehicle.count(),
    prisma.vehicle.count({ where: { status: 'available' } }),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: 'new' } }),
    prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])
  return { totalVehicles, availableVehicles, totalLeads, newLeads, recentLeads }
}

export default async function AdminDashboard() {
  const { totalVehicles, availableVehicles, totalLeads, newLeads, recentLeads } = await getStats()

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0B1F3A]">Dashboard</h1>
        <p className="text-gray-500 mt-1">Bienvenue dans votre espace administration NkundaAuto</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Véhicules total"
          value={totalVehicles}
          icon={Car}
          color="blue"
          description="Dans la base de données"
        />
        <StatsCard
          title="Disponibles"
          value={availableVehicles}
          icon={Car}
          color="green"
          description="Prêts à la vente"
        />
        <StatsCard
          title="Leads total"
          value={totalLeads}
          icon={Users}
          color="purple"
          description="Contacts enregistrés"
        />
        <StatsCard
          title="Nouveaux leads"
          value={newLeads}
          icon={TrendingUp}
          color="yellow"
          description="En attente de contact"
        />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-[#0B1F3A] mb-4">Actions rapides</h2>
          <div className="space-y-2">
            <Link
              href="/admin/vehicules/nouveau"
              className="flex items-center gap-2 w-full bg-[#F59E0B] text-[#0B1F3A] font-medium px-4 py-2.5 rounded-lg hover:bg-yellow-400 transition-colors text-sm"
            >
              <Car className="h-4 w-4" />
              Ajouter un véhicule
            </Link>
            <Link
              href="/admin/leads"
              className="flex items-center gap-2 w-full border border-gray-200 text-gray-700 font-medium px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              <Users className="h-4 w-4" />
              Voir tous les leads
            </Link>
          </div>
        </div>

        {/* Recent leads */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-[#0B1F3A] mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#F59E0B]" />
            Leads récents
          </h2>
          {recentLeads.length === 0 ? (
            <p className="text-sm text-gray-400">Aucun lead pour le moment</p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`}
                  className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg transition-colors"
                >
                  <div>
                    <div className="text-sm font-medium text-[#0B1F3A]">{lead.name}</div>
                    <div className="text-xs text-gray-500">{lead.phone}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    lead.status === 'new' ? 'bg-blue-100 text-blue-600' :
                    lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-600' :
                    lead.status === 'sold' ? 'bg-green-100 text-green-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {lead.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
