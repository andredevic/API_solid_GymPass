import { FetchUserCheckInHistoryUseCase } from '../fetch-user-check-ins-histoy'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repositoryt'

export function makeFetchUserCheckInsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const useCase = new FetchUserCheckInHistoryUseCase(checkInsRepository)

  return useCase
}
