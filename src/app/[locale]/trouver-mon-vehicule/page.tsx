'use client'

import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import WhatsAppButton from '@/components/public/WhatsAppButton'
import { useParams } from 'next/navigation'

const schema = z.object({
  name: z.string().min(2, 'Nom requis'),
  phone: z.string().min(8, 'Téléphone requis'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  city: z.string().optional(),
  budgetMinStr: z.string().optional(),
  budgetMaxStr: z.string().optional(),
  desiredBrand: z.string().optional(),
  desiredModel: z.string().optional(),
  usage: z.string().optional(),
  notes: z.string().optional(),
  diaspora: z.boolean().optional(),
})

type FormData = z.infer<typeof schema>

export default function FindVehiclePage() {
  const t = useTranslations('findVehicle')
  const params = useParams()
  const locale = (params?.locale as string) ?? 'fr'
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { diaspora: false },
  })

  async function onSubmit(data: FormData) {
    setStatus('loading')
    try {
      const payload = {
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        city: data.city,
        budgetMin: data.budgetMinStr ? Number(data.budgetMinStr) : undefined,
        budgetMax: data.budgetMaxStr ? Number(data.budgetMaxStr) : undefined,
        desiredBrand: data.desiredBrand,
        desiredModel: data.desiredModel,
        usage: data.usage,
        notes: data.notes,
        diaspora: data.diaspora,
        source: 'website',
      }
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F8FAFC]">
        <div className="bg-[#0B1F3A] text-white py-12 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-3">{t('title')}</h1>
            <p className="text-gray-300">{t('subtitle')}</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-12">
          {status === 'success' ? (
            <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-8 rounded-xl text-center">
              <div className="text-4xl mb-3">✅</div>
              <div className="font-semibold text-lg mb-2">{t('success')}</div>
              <button
                onClick={() => setStatus('idle')}
                className="mt-4 text-sm text-green-600 underline"
              >
                Faire une nouvelle demande
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl p-8 shadow-sm space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t('name')} *</label>
                  <input {...register('name')} className={inputClass} />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>{t('phone')} *</label>
                  <input {...register('phone')} type="tel" className={inputClass} />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>{t('email')}</label>
                  <input {...register('email')} type="email" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{t('city')}</label>
                  <input {...register('city')} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{t('budgetMin')}</label>
                  <input {...register('budgetMinStr')} type="number" className={inputClass} placeholder="5000" />
                </div>
                <div>
                  <label className={labelClass}>{t('budgetMax')}</label>
                  <input {...register('budgetMaxStr')} type="number" className={inputClass} placeholder="20000" />
                </div>
                <div>
                  <label className={labelClass}>{t('brand')}</label>
                  <input {...register('desiredBrand')} className={inputClass} placeholder="Toyota, Mercedes..." />
                </div>
                <div>
                  <label className={labelClass}>{t('model')}</label>
                  <input {...register('desiredModel')} className={inputClass} placeholder="Land Cruiser, C180..." />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>{t('usage')}</label>
                  <select {...register('usage')} className={inputClass}>
                    <option value="">Sélectionner...</option>
                    <option value="ville">{t('usageOptions.ville')}</option>
                    <option value="famille">{t('usageOptions.famille')}</option>
                    <option value="business">{t('usageOptions.business')}</option>
                    <option value="terrain">{t('usageOptions.terrain')}</option>
                    <option value="livraison">{t('usageOptions.livraison')}</option>
                    <option value="budget">{t('usageOptions.budget')}</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClass}>{t('notes')}</label>
                  <textarea {...register('notes')} rows={3} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" {...register('diaspora')} className="rounded" />
                    {t('diaspora')}
                  </label>
                </div>
              </div>

              {status === 'error' && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{t('error')}</div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-[#F59E0B] text-[#0B1F3A] font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-60"
              >
                {status === 'loading' ? 'Envoi en cours...' : t('submit')}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer locale={locale} />
      <WhatsAppButton />
    </>
  )
}
