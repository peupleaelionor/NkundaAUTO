import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Pencil, Eye } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

async function getVehicles() {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return vehicles.map((v) => ({
    ...v,
    photos: JSON.parse(v.photos) as string[],
  }))
}

const statusConfig: Record<string, { label: string; className: string }> = {
  available: { label: 'Disponible', className: 'bg-green-100 text-green-700' },
  reserved: { label: 'Réservé', className: 'bg-yellow-100 text-yellow-700' },
  sold: { label: 'Vendu', className: 'bg-red-100 text-red-700' },
  archived: { label: 'Archivé', className: 'bg-gray-100 text-gray-700' },
}

export default async function AdminVehiclesPage() {
  const vehicles = await getVehicles()

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F3A]">Véhicules</h1>
          <p className="text-gray-500 text-sm mt-1">{vehicles.length} véhicule{vehicles.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/admin/vehicules/nouveau"
          className="flex items-center gap-2 bg-[#F59E0B] text-[#0B1F3A] font-semibold px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          Ajouter
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Véhicule</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Prix</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Statut</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Visible</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {vehicles.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    Aucun véhicule. <Link href="/admin/vehicules/nouveau" className="text-[#F59E0B] underline">En ajouter un</Link>
                  </td>
                </tr>
              )}
              {vehicles.map((v) => {
                const status = statusConfig[v.status] ?? statusConfig.available
                return (
                  <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-[#0B1F3A]">{v.title}</div>
                      <div className="text-xs text-gray-400">{v.year} · {v.city}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#F59E0B]">
                      {formatPrice(v.price, v.currency)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs ${v.isPublic ? 'text-green-600' : 'text-gray-400'}`}>
                        {v.isPublic ? '✓ Public' : '○ Privé'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/vehicules/${v.id}`}
                          className="text-gray-400 hover:text-[#0B1F3A] transition-colors"
                          title="Modifier"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/fr/vehicules/${v.slug}`}
                          target="_blank"
                          className="text-gray-400 hover:text-[#F59E0B] transition-colors"
                          title="Voir sur le site"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </div>
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
