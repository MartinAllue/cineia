import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL
  
  if (!connectionString) {
    console.warn('DATABASE_URL not set - running in demo mode')
    return null
  }

  return new PrismaClient({
    datasources: {
      db: {
        url: connectionString
      }
    }
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export const isDemoMode = !process.env.DATABASE_URL

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
