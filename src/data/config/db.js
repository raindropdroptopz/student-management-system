const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = prisma
// You can now use `prisma` to interact with your database
