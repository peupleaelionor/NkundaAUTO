import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Phone, Mail, MapPin, MessageCircle } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { buildWhatsAppUrl } from '@/lib/utils'

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

async function getLead(id: string) {
  return prisma.lead.findUnique({
    where: { id },
    include: {
      assignedTo: { select: { name: true, email: true } },
      notes_list: {
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      },
      inquiries: {
        include: { vehicle: { select: { title: true, slug: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const lead = await getLead(id)

  if (!lead) notFound()

  const status = statusConfig[lead.status] ?? statusConfig.new

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <Link href="/admin/leads" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#0B1F3A] mb-3">
          <ArrowLeft className="h-4 w-4" />
          Retour aux leads
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0B1F3A]">{lead.name}</h1>
            <p className="text-gray-500 text-sm mt-1">
              Lead créé le {format(new Date(lead.createdAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}
            </p>
          </div>
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${status.className}`}>
            {status.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-[#0B1F3A] mb-4">Contact</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <a href={`tel:${lead.phone}`} className="hover:text-[#F59E0B] transition-colors">{lead.phone}</a>
            </div>
            {lead.whatsapp && (
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-green-500" />
                <a
                  href={buildWhatsAppUrl(`Bonjour ${lead.name}, je vous contacte de NkundaAuto.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline"
                >
                  WhatsApp: {lead.whatsapp}
                </a>
              </div>
            )}
            {lead.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <a href={`mailto:${lead.email}`} className="hover:text-[#F59E0B] transition-colors">{lead.email}</a>
              </div>
            )}
            {lead.city && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                {lead.city}
              </div>
            )}
          </div>

          <a
            href={buildWhatsAppUrl(`Bonjour ${lead.name}, je vous contacte de NkundaAuto concernant votre demande.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 mt-4 w-full bg-green-500 text-white font-medium py-2 rounded-lg hover:bg-green-600 transition-colors text-sm justify-center"
          >
            <MessageCircle className="h-4 w-4" />
            Contacter sur WhatsApp
          </a>
        </div>

        {/* Lead details */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-[#0B1F3A] mb-4">Demande</h2>
          <div className="space-y-3 text-sm">
            {lead.desiredBrand && (
              <div><span className="text-gray-500">Marque: </span>{lead.desiredBrand}</div>
            )}
            {lead.desiredModel && (
              <div><span className="text-gray-500">Modèle: </span>{lead.desiredModel}</div>
            )}
            {(lead.budgetMin || lead.budgetMax) && (
              <div>
                <span className="text-gray-500">Budget: </span>
                {lead.budgetMin && `$${lead.budgetMin.toLocaleString()}`}
                {lead.budgetMin && lead.budgetMax && ' - '}
                {lead.budgetMax && `$${lead.budgetMax.toLocaleString()}`}
              </div>
            )}
            {lead.usage && <div><span className="text-gray-500">Usage: </span>{lead.usage}</div>}
            {lead.diaspora && <div className="text-orange-500">🌍 Diaspora</div>}
            <div><span className="text-gray-500">Source: </span>{lead.source}</div>
          </div>

          {lead.notes && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Notes</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{lead.notes}</p>
            </div>
          )}
        </div>

        {/* Inquiries */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-[#0B1F3A] mb-4">Demandes véhicule</h2>
          {lead.inquiries.length === 0 ? (
            <p className="text-sm text-gray-400">Aucune demande liée</p>
          ) : (
            <div className="space-y-3">
              {lead.inquiries.map((inq) => (
                <div key={inq.id} className="text-sm border-l-2 border-[#F59E0B] pl-3">
                  <div className="font-medium text-[#0B1F3A]">{inq.type}</div>
                  {inq.vehicle && (
                    <div className="text-xs text-gray-500">{inq.vehicle.title}</div>
                  )}
                  {inq.message && <div className="text-xs text-gray-600 mt-0.5">{inq.message}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
