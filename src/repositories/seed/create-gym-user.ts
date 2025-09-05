import { z } from 'zod'
import { makeCreateGymsUseCase } from '@/use-cases/factories/make-create-gym-use-case'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'
import { Role } from '@prisma/client'
import { prisma } from '@/lib/prisma'

const gym = {
  title: 'Academia JavaScript',
  description: 'Academia criada pelo seed',
  phone: '907234',
  latitude: -15.8357863,
  longitude: -48.0363827,
}

const userAdmin = {
  name: 'André',
  email: 'andre@andre.com',
  password: '123456',
  role: Role.ADMIN,
}

export default async function createGymAndAdmin() {
  const existAdmin = await prisma.user.findUnique({
    where: { email: userAdmin.email },
  })
  if (existAdmin) {
    return
  }
  // 1. Criar usuário admin
  const registerUseCase = makeRegisterUseCase()
  await registerUseCase.execute(userAdmin)

  const admin = await prisma.user.findUnique({
    where: { email: userAdmin.email },
  })

  if (!admin) {
    throw new Error('❌ Admin não foi criado no seed')
  }

  console.log('✅ Admin criado:', admin.email)

  // 2. Criar academia (sem precisar autenticar via rota, chamando caso de uso direto)
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.number().refine((value) => Math.abs(value) <= 180),
  })

  const { title, description, phone, latitude, longitude } =
    createGymBodySchema.parse(gym)

  const makeCreateGymUseCase = makeCreateGymsUseCase()

  await makeCreateGymUseCase.execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  })

  console.log('✅ Academia criada:', gym.title)
}
