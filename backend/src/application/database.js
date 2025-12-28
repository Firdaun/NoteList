import 'dotenv/config'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from "../../generated/prisma/index"

const adapter = new PrismaMariaDb(process.env.DATABASE_URL)

export const prismaClient = new PrismaClient({
    adapter,
    log: ['query', 'error', 'info', 'warn'],
})


