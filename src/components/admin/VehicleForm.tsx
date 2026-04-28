'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const vehicleSchema = z.object({
  title: z.string().min(3, 'Titre requis'),
  brand: z.string().min(1, 'Marque requise'),
  model: z.string().min(1, 'Modèle requis'),
  yearStr: z.string().min(4, 'Année requise'),
  priceStr: z.string().min(1, 'Prix requis'),
  currency: z.string().optional(),
  mileageStr: z.string().optional(),
  fuelType: z.enum(['essence', 'diesel', 'hybride', 'electrique']),
  transmission: z.enum(['manuelle', 'automatique']),
  condition: z.enum(['excellent', 'bon', 'correct', 'a_reviser']),
  city: z.string().min(1, 'Ville requise'),
  description: z.string().optional(),
  status: z.enum(['available', 'reserved', 'sold', 'archived']).optional(),
  featured: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  videoUrl: z.string().optional().or(z.literal('')),
  internalNotes: z.string().optional(),
})

type VehicleFormData = z.infer<typeof vehicleSchema>

interface VehicleFormProps {
  initialData?: Partial<VehicleFormData> & { id?: string; slug?: string; year?: number; price?: number; mileage?: number | null }
  mode: 'create' | 'edit'
}

export default function VehicleForm({ initialData, mode }: VehicleFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: initialData ?? {
      currency: 'USD',
      status: 'available' as const,
      featured: false,
      isPublic: true,
    },
  })

  async function onSubmit(data: VehicleFormData) {
    setLoading(true)
    setError('')
    try {
      const url = mode === 'edit' && initialData?.id
        ? `/api/vehicles?id=${initialData.id}`
        : '/api/vehicles'
      const method = mode === 'edit' ? 'PUT' : 'POST'

      const payload = {
        ...data,
        year: Number(data.yearStr),
        price: Number(data.priceStr),
        mileage: data.mileageStr ? Number(data.mileageStr) : undefined,
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Erreur lors de la sauvegarde')
      }

      router.push('/admin/vehicules')
      router.refresh()
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className={labelClass}>Titre *</label>
          <input {...register('title')} className={inputClass} placeholder="Ex: Toyota Land Cruiser V8 2019" />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Marque *</label>
          <input {...register('brand')} className={inputClass} placeholder="Toyota" />
          {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Modèle *</label>
          <input {...register('model')} className={inputClass} placeholder="Land Cruiser" />
          {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Année *</label>
          <input type="number" {...register('yearStr')} className={inputClass} placeholder="2020" />
          {errors.yearStr && <p className="text-red-500 text-xs mt-1">{errors.yearStr.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Prix *</label>
          <div className="flex gap-2">
            <input type="number" {...register('priceStr')} className={inputClass} placeholder="25000" />
            <select {...register('currency')} className="border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]">
              <option value="USD">USD</option>
              <option value="CDF">CDF</option>
            </select>
          </div>
          {errors.priceStr && <p className="text-red-500 text-xs mt-1">{errors.priceStr.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Kilométrage</label>
          <input type="number" {...register('mileageStr')} className={inputClass} placeholder="80000" />
        </div>

        <div>
          <label className={labelClass}>Carburant *</label>
          <select {...register('fuelType')} className={inputClass}>
            <option value="essence">Essence</option>
            <option value="diesel">Diesel</option>
            <option value="hybride">Hybride</option>
            <option value="electrique">Électrique</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Transmission *</label>
          <select {...register('transmission')} className={inputClass}>
            <option value="automatique">Automatique</option>
            <option value="manuelle">Manuelle</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>État *</label>
          <select {...register('condition')} className={inputClass}>
            <option value="excellent">Excellent</option>
            <option value="bon">Bon</option>
            <option value="correct">Correct</option>
            <option value="a_reviser">À réviser</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Ville *</label>
          <input {...register('city')} className={inputClass} placeholder="Kinshasa" />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Statut</label>
          <select {...register('status')} className={inputClass}>
            <option value="available">Disponible</option>
            <option value="reserved">Réservé</option>
            <option value="sold">Vendu</option>
            <option value="archived">Archivé</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>URL Vidéo</label>
          <input {...register('videoUrl')} className={inputClass} placeholder="https://youtube.com/..." />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Description</label>
          <textarea {...register('description')} rows={4} className={inputClass} placeholder="Décrivez le véhicule..." />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Notes internes</label>
          <textarea {...register('internalNotes')} rows={2} className={inputClass} placeholder="Notes pour l'équipe..." />
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register('featured')} className="rounded" />
            Mettre en vedette
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register('isPublic')} className="rounded" />
            Visible sur le site
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 text-sm bg-[#F59E0B] text-[#0B1F3A] font-semibold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-60"
        >
          {loading ? 'Enregistrement...' : mode === 'edit' ? 'Mettre à jour' : 'Créer le véhicule'}
        </button>
      </div>
    </form>
  )
}
