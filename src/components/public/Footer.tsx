import Link from 'next/link'
import { Car, Phone, Mail, MapPin, Share2 } from 'lucide-react'

export default function Footer({ locale = 'fr' }: { locale?: string }) {
  const year = new Date().getFullYear()

  const navLinks = [
    { href: `/${locale}/vehicules`, label: 'Véhicules' },
    { href: `/${locale}/trouver-mon-vehicule`, label: 'Trouver mon véhicule' },
    { href: `/${locale}/services`, label: 'Services' },
    { href: `/${locale}/confiance`, label: 'Confiance' },
    { href: `/${locale}/contact`, label: 'Contact' },
  ]

  return (
    <footer className="bg-[#0B1F3A] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-[#F59E0B] font-bold text-xl mb-3">
              <Car className="h-6 w-6" />
              NkundaAuto
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Votre partenaire automobile de confiance en République Démocratique du Congo.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="hover:text-[#F59E0B] transition-colors">
                <Share2 className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-[#F59E0B] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#F59E0B] mt-0.5 shrink-0" />
                <span>Kinshasa, République Démocratique du Congo</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#F59E0B] shrink-0" />
                <a href="tel:+243810000000" className="hover:text-[#F59E0B] transition-colors">
                  +243 810 000 000
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#F59E0B] shrink-0" />
                <a href="mailto:info@nkundaauto.cd" className="hover:text-[#F59E0B] transition-colors">
                  info@nkundaauto.cd
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-900 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>© {year} NkundaAuto. Tous droits réservés.</p>
          <p>
            <Link href="#" className="hover:text-[#F59E0B] transition-colors">Politique de confidentialité</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
