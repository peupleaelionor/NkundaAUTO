'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowRight, Search, MessageCircle } from 'lucide-react'
import { buildWhatsAppUrl } from '@/lib/utils'

export default function HeroSection() {
  const t = useTranslations('hero')
  const locale = useLocale()

  const whatsappUrl = buildWhatsAppUrl('Bonjour NkundaAuto, je suis intéressé par vos véhicules.')

  return (
    <section className="relative bg-[#0B1F3A] text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25% 50%, #F59E0B 0%, transparent 50%), radial-gradient(circle at 75% 50%, #1e40af 0%, transparent 50%)'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-[#F59E0B]/20 text-[#F59E0B] text-sm font-medium px-3 py-1 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] inline-block animate-pulse" />
            RDC #1 Plateforme Auto
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            {t('title')}
          </h1>

          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            {t('subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={`/${locale}/vehicules`}
              className="flex items-center justify-center gap-2 bg-[#F59E0B] text-[#0B1F3A] font-semibold px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              <Search className="h-4 w-4" />
              {t('cta_browse')}
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href={`/${locale}/trouver-mon-vehicule`}
              className="flex items-center justify-center gap-2 border border-white/30 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              {t('cta_find')}
            </Link>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              {t('cta_whatsapp')}
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-md">
          {[
            { value: '200+', label: 'Véhicules vendus' },
            { value: '5 ans', label: "D'expérience" },
            { value: '100%', label: 'Inspectés' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-[#F59E0B]">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
