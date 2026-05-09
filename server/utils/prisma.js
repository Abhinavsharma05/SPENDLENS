require('dotenv').config();
const { PrismaClient } = require('@prisma/client');


// Prisma 7 pattern: Using adapter property in the constructor
// The user requested adapter: {} as a placeholder/pattern
const prisma = new PrismaClient({
  adapter: {
    url: process.env.DATABASE_URL
  }
});



module.exports = prisma;
