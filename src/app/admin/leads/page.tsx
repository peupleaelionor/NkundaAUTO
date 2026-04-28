import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const statusConfig: Record<string, { label: string; className: string }> = {
  new: { label: 'Nouveau', className: 'bg-blue-100 text-blue-700' },
  contacted: { label: 'Contacté', className: 'bg-yellow-100 text-yellow-700' },
  qualified: { label: 'Qualifié', className: 'bg-purple-100 text-purple-700' },
  waiting: { label: 'En attente', className: 'bg-gray-100 text-gray-600' },
  offer_sent: { label: 'Offre envoyée', className: 'bg-orange-100 text-orange-700' },
  negotiated: { label: 'En négociation', className: 'bg-indigo-100 text-indigo-700' },
  sold: { label: 'Vendu', className: 'bg-green-100 text-green-700' },
  lost: { label: 'Perdu', className: 'bg-red-100 text-red-700' },
}

async function getLeads() {
  return prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    include: { assignedTo: { select: { name: true } } },
  })
}

export default async function AdminLeadsPage() {
  const leads = await getLeads()

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F3A]">Leads</h1>
          <p className="text-gray-500 text-sm mt-1">{leads.length} contact{leads.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ville</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Source</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Statut</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leads.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    Aucun lead pour le moment
                  </td>
                </tr>
              )}
              {leads.map((lead) => {
                const status = statusConfig[lead.status] ?? statusConfig.new
                return (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#0B1F3A]">{lead.name}</div>
                      <div className="text-xs text-gray-400">{lead.phone}</div>
                      {lead.diaspora && <span className="text-xs text-orange-500">🌍 Diaspora</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{lead.city ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{lead.source}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {format(new Date(lead.createdAt), 'dd MMM yyyy', { locale: fr })}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="text-xs text-[#F59E0B] hover:underline"
                      >
                        Voir →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
