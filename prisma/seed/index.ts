import createGymUser from './create-gym-user'
import { prisma } from '@/lib/prisma'

async function seed() {
  await createGymUser()
}
seed()
