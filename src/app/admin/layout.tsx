import type { Metadata } from 'next'
import '../globals.css'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { SessionProvider } from 'next-auth/react'

export const metadata: Metadata = {
  title: 'Admin — NkundaAuto',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <SessionProvider>
          <div className="flex min-h-screen bg-[#F8FAFC]">
            <AdminSidebar />
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}
