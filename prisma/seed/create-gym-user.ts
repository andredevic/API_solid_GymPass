import { z } from 'zod'
import { makeCreateGymsUseCase } from '@/use-cases/factories/make-create-gym-use-case'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'
import { Role } from '@prisma/client'

const gym = {
  title: 'academia javascript',
  description: 'fadsfsad',
  phone: '907234',
  latitude: -15.8357863,
  longitude: -48.0363827,
}

const userAdmin = {
  name: 'andre',
  email: 'andre@andre.com',
  password: '123456',
  role: Role.ADMIN,
}

export default async function create() {
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
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

  const registerUseCase = makeRegisterUseCase()

  await registerUseCase.execute(userAdmin)

  console.log('user created')
}
