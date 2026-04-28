'use client'

import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import WhatsAppButton from '@/components/public/WhatsAppButton'
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'
import { buildWhatsAppUrl } from '@/lib/utils'
import { useParams } from 'next/navigation'

const schema = z.object({
  name: z.string().min(2, 'Nom requis'),
  phone: z.string().min(8, 'Téléphone requis'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  message: z.string().min(10, 'Message trop court'),
})

type FormData = z.infer<typeof schema>

export default function ContactPage() {
  const t = useTranslations('contact')
  const params = useParams()
  const locale = (params?.locale as string) ?? 'fr'
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setStatus('loading')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          phone: data.phone,
          email: data.email,
          notes: data.message,
          source: 'website',
        }),
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
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-3">{t('title')}</h1>
            <p className="text-gray-300">{t('subtitle')}</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact info */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h2 className="font-semibold text-[#0B1F3A] mb-4">Informations</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-[#F59E0B] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">{t('address')}</div>
                      <div className="text-sm text-gray-600">Kinshasa, RDC</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-[#F59E0B] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">Téléphone</div>
                      <a href="tel:+243810000000" className="text-sm text-gray-600 hover:text-[#F59E0B]">
                        +243 810 000 000
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-[#F59E0B] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">Email</div>
                      <a href="mailto:info@nkundaauto.cd" className="text-sm text-gray-600 hover:text-[#F59E0B]">
                        info@nkundaauto.cd
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-[#F59E0B] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">{t('hours')}</div>
                      <div className="text-sm text-gray-600">{t('hoursValue')}</div>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href={buildWhatsAppUrl('Bonjour NkundaAuto, je voudrais vous contacter.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500 text-white font-semibold py-3 rounded-xl hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                {t('whatsappDirect')}
              </a>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-2">
              {status === 'success' ? (
                <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-8 rounded-xl text-center">
                  <div className="text-4xl mb-3">✅</div>
                  <div className="font-semibold text-lg">{t('success')}</div>
                  <button onClick={() => setStatus('idle')} className="mt-4 text-sm text-green-600 underline">
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl p-6 shadow-sm space-y-4">
                  <h2 className="font-semibold text-[#0B1F3A] mb-2">Envoyer un message</h2>
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
                    <div className="sm:col-span-2">
                      <label className={labelClass}>{t('email')}</label>
                      <input {...register('email')} type="email" className={inputClass} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>{t('message')} *</label>
                      <textarea {...register('message')} rows={5} className={inputClass} />
                      {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                    </div>
                  </div>

                  {status === 'error' && (
                    <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
                      Une erreur s&apos;est produite. Veuillez réessayer.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-[#F59E0B] text-[#0B1F3A] font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-60"
                  >
                    {status === 'loading' ? 'Envoi...' : t('submit')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer locale={locale} />
      <WhatsAppButton />
    </>
  )
}
