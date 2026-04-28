import VehicleForm from '@/components/admin/VehicleForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewVehiclePage() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <Link
          href="/admin/vehicules"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#0B1F3A] mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Link>
        <h1 className="text-2xl font-bold text-[#0B1F3A]">Nouveau véhicule</h1>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 max-w-3xl">
        <VehicleForm mode="create" />
      </div>
    </div>
  )
}
