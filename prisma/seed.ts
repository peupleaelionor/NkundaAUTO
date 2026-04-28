import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const vehicles = [
  {
    slug: 'toyota-land-cruiser-v8-2019',
    title: 'Toyota Land Cruiser V8 2019',
    brand: 'Toyota',
    model: 'Land Cruiser',
    year: 2019,
    price: 58000,
    currency: 'USD',
    mileage: 65000,
    fuelType: 'essence',
    transmission: 'automatique',
    condition: 'excellent',
    city: 'Kinshasa',
    description: 'Toyota Land Cruiser V8 2019 en excellent état. Importé du Japon, entretien régulier, aucun accident. Idéal pour les routes congolaises.',
    status: 'available',
    featured: true,
    photos: JSON.stringify([
      'https://picsum.photos/seed/landcruiser/800/600',
      'https://picsum.photos/seed/landcruiser2/800/600',
    ]),
    recommendedUsage: JSON.stringify(['terrain', 'famille', 'business']),
    isPublic: true,
  },
  {
    slug: 'toyota-corolla-2020',
    title: 'Toyota Corolla 2020',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2020,
    price: 18500,
    currency: 'USD',
    mileage: 42000,
    fuelType: 'essence',
    transmission: 'automatique',
    condition: 'excellent',
    city: 'Kinshasa',
    description: 'Toyota Corolla 2020 automatique. Très économique, parfait pour la ville. Climatisation, vitres électriques, bon état général.',
    status: 'available',
    featured: true,
    photos: JSON.stringify(['https://picsum.photos/seed/corolla/800/600']),
    recommendedUsage: JSON.stringify(['ville', 'budget']),
    isPublic: true,
  },
  {
    slug: 'mercedes-c180-2018',
    title: 'Mercedes-Benz C180 2018',
    brand: 'Mercedes-Benz',
    model: 'C180',
    year: 2018,
    price: 24000,
    currency: 'USD',
    mileage: 78000,
    fuelType: 'essence',
    transmission: 'automatique',
    condition: 'bon',
    city: 'Kinshasa',
    description: 'Mercedes C180 AMG Line 2018. Très élégante, parfaite pour les professionnels. Intérieur cuir, système multimédia complet.',
    status: 'available',
    featured: true,
    photos: JSON.stringify(['https://picsum.photos/seed/mercedes/800/600']),
    recommendedUsage: JSON.stringify(['business', 'ville']),
    isPublic: true,
  },
  {
    slug: 'mitsubishi-pajero-2017',
    title: 'Mitsubishi Pajero 4x4 2017',
    brand: 'Mitsubishi',
    model: 'Pajero',
    year: 2017,
    price: 32000,
    currency: 'USD',
    mileage: 89000,
    fuelType: 'diesel',
    transmission: 'automatique',
    condition: 'bon',
    city: 'Lubumbashi',
    description: 'Mitsubishi Pajero 4x4 diesel 2017. Idéal pour les provinces et les terrains difficiles. Moteur diesel économique et puissant.',
    status: 'available',
    featured: false,
    photos: JSON.stringify(['https://picsum.photos/seed/pajero/800/600']),
    recommendedUsage: JSON.stringify(['terrain', 'famille']),
    isPublic: true,
  },
  {
    slug: 'toyota-hilux-2021',
    title: 'Toyota Hilux Double Cab 2021',
    brand: 'Toyota',
    model: 'Hilux',
    year: 2021,
    price: 38000,
    currency: 'USD',
    mileage: 28000,
    fuelType: 'diesel',
    transmission: 'manuelle',
    condition: 'excellent',
    city: 'Kinshasa',
    description: 'Toyota Hilux Double Cab 2021 diesel. Le pick-up le plus fiable pour la RDC. Parfait pour la livraison et le terrain.',
    status: 'available',
    featured: true,
    photos: JSON.stringify(['https://picsum.photos/seed/hilux/800/600']),
    recommendedUsage: JSON.stringify(['terrain', 'livraison']),
    isPublic: true,
  },
  {
    slug: 'honda-crv-2019',
    title: 'Honda CR-V 2019',
    brand: 'Honda',
    model: 'CR-V',
    year: 2019,
    price: 21000,
    currency: 'USD',
    mileage: 55000,
    fuelType: 'essence',
    transmission: 'automatique',
    condition: 'excellent',
    city: 'Kinshasa',
    description: 'Honda CR-V 2019 en excellent état. SUV familial confortable, économique et fiable. Parfait pour Kinshasa.',
    status: 'available',
    featured: false,
    photos: JSON.stringify(['https://picsum.photos/seed/crv/800/600']),
    recommendedUsage: JSON.stringify(['famille', 'ville']),
    isPublic: true,
  },
  {
    slug: 'hyundai-tucson-2020',
    title: 'Hyundai Tucson 2020',
    brand: 'Hyundai',
    model: 'Tucson',
    year: 2020,
    price: 16500,
    currency: 'USD',
    mileage: 48000,
    fuelType: 'essence',
    transmission: 'automatique',
    condition: 'bon',
    city: 'Kinshasa',
    description: 'Hyundai Tucson 2020. SUV moderne et bien équipé. Garantie constructeur valide. Bonne affaire !',
    status: 'reserved',
    featured: false,
    photos: JSON.stringify(['https://picsum.photos/seed/tucson/800/600']),
    recommendedUsage: JSON.stringify(['famille', 'ville']),
    isPublic: true,
  },
  {
    slug: 'kia-sportage-2018',
    title: 'Kia Sportage 2018',
    brand: 'Kia',
    model: 'Sportage',
    year: 2018,
    price: 13500,
    currency: 'USD',
    mileage: 72000,
    fuelType: 'essence',
    transmission: 'automatique',
    condition: 'bon',
    city: 'Goma',
    description: 'Kia Sportage 2018. Bon état général, entretenu régulièrement. Climatisation, navigation GPS.',
    status: 'available',
    featured: false,
    photos: JSON.stringify(['https://picsum.photos/seed/sportage/800/600']),
    recommendedUsage: JSON.stringify(['ville', 'famille', 'budget']),
    isPublic: true,
  },
]

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.vehicleInquiry.deleteMany()
  await prisma.leadNote.deleteMany()
  await prisma.activityLog.deleteMany()
  await prisma.lead.deleteMany()
  await prisma.vehicle.deleteMany()
  await prisma.user.deleteMany()

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin2024!', 12)
  const admin = await prisma.user.create({
    data: {
      name: 'Admin NkundaAuto',
      email: 'admin@nkundaauto.cd',
      password: hashedPassword,
      role: 'super_admin',
      isActive: true,
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Create vehicles
  for (const v of vehicles) {
    await prisma.vehicle.create({ data: v })
  }
  console.log(`✅ ${vehicles.length} vehicles created`)

  // Create sample leads
  const sampleLeads = [
    {
      name: 'Jean-Paul Kabila',
      phone: '+243810001001',
      whatsapp: '+243810001001',
      email: 'jk@example.com',
      city: 'Kinshasa',
      budgetMin: 15000,
      budgetMax: 25000,
      desiredBrand: 'Toyota',
      usage: 'famille',
      source: 'website',
      status: 'new',
      diaspora: false,
    },
    {
      name: 'Marie Nzinga',
      phone: '+243820002002',
      city: 'Lubumbashi',
      budgetMin: 30000,
      budgetMax: 50000,
      desiredBrand: 'Toyota',
      desiredModel: 'Land Cruiser',
      usage: 'terrain',
      source: 'whatsapp',
      status: 'contacted',
      diaspora: false,
    },
    {
      name: 'Antoine Mwamba',
      phone: '+33612345678',
      email: 'am@example.com',
      city: 'Paris',
      budgetMin: 20000,
      budgetMax: 35000,
      usage: 'famille',
      source: 'website',
      status: 'qualified',
      diaspora: true,
      notes: 'Achète pour sa famille à Kinshasa',
    },
  ]

  for (const lead of sampleLeads) {
    await prisma.lead.create({ data: lead })
  }
  console.log(`✅ ${sampleLeads.length} sample leads created`)

  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
