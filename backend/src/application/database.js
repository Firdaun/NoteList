import 'dotenv/config'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from "../../generated/prisma/index.js"

const isProduction = process.env.NODE_ENV === 'production'

const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: { rejectUnauthorized: isProduction }
})

export const prismaClient = new PrismaClient({
    adapter,
    log: ['query', 'error', 'info', 'warn'],
})


