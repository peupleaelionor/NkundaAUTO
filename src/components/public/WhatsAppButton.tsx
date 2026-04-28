'use client'

import { MessageCircle } from 'lucide-react'
import { buildWhatsAppUrl } from '@/lib/utils'

interface WhatsAppButtonProps {
  message?: string
  className?: string
}

export default function WhatsAppButton({
  message = 'Bonjour NkundaAuto, je suis intéressé par vos véhicules.',
  className = '',
}: WhatsAppButtonProps) {
  const url = buildWhatsAppUrl(message)

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 text-white font-semibold px-4 py-3 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-105 ${className}`}
      aria-label="Contacter sur WhatsApp"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline text-sm">WhatsApp</span>
    </a>
  )
}
