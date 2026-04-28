export interface Vehicle {
  id: string
  slug: string
  title: string
  brand: string
  model: string
  year: number
  price: number
  currency: string
  mileage?: number | null
  fuelType: string
  transmission: string
  condition: string
  city: string
  description?: string | null
  recommendedUsage: string[]
  status: 'available' | 'reserved' | 'sold' | 'archived'
  featured: boolean
  photos: string[]
  videoUrl?: string | null
  internalNotes?: string | null
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Lead {
  id: string
  name: string
  phone: string
  whatsapp?: string | null
  email?: string | null
  city?: string | null
  budgetMin?: number | null
  budgetMax?: number | null
  desiredBrand?: string | null
  desiredModel?: string | null
  usage?: string | null
  notes?: string | null
  source: string
  status: LeadStatus
  diaspora: boolean
  assignedToId?: string | null
  nextFollowUpAt?: Date | null
  createdAt: Date
  updatedAt: Date
  assignedTo?: User | null
}

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'waiting'
  | 'offer_sent'
  | 'negotiated'
  | 'sold'
  | 'lost'

export interface User {
  id: string
  name: string
  email: string
  phone?: string | null
  role: UserRole
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type UserRole = 'super_admin' | 'admin' | 'editor' | 'viewer'

export interface VehicleInquiry {
  id: string
  vehicleId?: string | null
  leadId?: string | null
  type: 'question' | 'reserve' | 'request_video' | 'sourcing'
  message?: string | null
  createdAt: Date
}

export interface ActivityLog {
  id: string
  actorId?: string | null
  entityType: string
  entityId: string
  action: string
  payload?: string | null
  createdAt: Date
}

export interface Testimonial {
  id: string
  clientName: string
  quote: string
  location?: string | null
  photoUrl?: string | null
  published: boolean
  createdAt: Date
}

export interface FindVehicleFormData {
  name: string
  phone: string
  whatsapp?: string
  email?: string
  city?: string
  budgetMin?: number
  budgetMax?: number
  desiredBrand?: string
  desiredModel?: string
  usage?: string
  notes?: string
  diaspora?: boolean
}

export interface ContactFormData {
  name: string
  phone: string
  email?: string
  message: string
}

export interface VehicleFilters {
  brand?: string
  fuelType?: string
  transmission?: string
  condition?: string
  status?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'oldest'
}
