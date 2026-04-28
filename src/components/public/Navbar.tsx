'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { useState } from 'react'
import { Menu, X, Car, Globe } from 'lucide-react'

const localeNames: Record<string, string> = {
  fr: 'Français',
  en: 'English',
  ln: 'Lingala',
}

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  const navLinks = [
    { href: `/${locale}/vehicules`, label: t('vehicles') },
    { href: `/${locale}/trouver-mon-vehicule`, label: t('findMyVehicle') },
    { href: `/${locale}/services`, label: t('services') },
    { href: `/${locale}/confiance`, label: t('trust') },
    { href: `/${locale}/contact`, label: t('contact') },
  ]

  const otherLocales = ['fr', 'en', 'ln'].filter((l) => l !== locale)

  function switchLocale(l: string) {
    const path = window.location.pathname
    const segments = path.split('/')
    if (['fr', 'en', 'ln'].includes(segments[1])) {
      segments[1] = l
    } else {
      segments.splice(1, 0, l)
    }
    window.location.href = segments.join('/')
  }

  return (
    <nav className="bg-[#0B1F3A] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 font-bold text-xl text-[#F59E0B]">
            <Car className="h-6 w-6" />
            NkundaAuto
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-[#F59E0B] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 text-sm hover:text-[#F59E0B] transition-colors uppercase"
              >
                <Globe className="h-4 w-4" />
                {locale}
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white text-[#0B1F3A] rounded-md shadow-lg py-1 z-50">
                  {otherLocales.map((l) => (
                    <button
                      key={l}
                      onClick={() => { switchLocale(l); setLangOpen(false) }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      {localeNames[l]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0B1F3A] border-t border-blue-900 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm font-medium hover:text-[#F59E0B] transition-colors py-1"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
