import { GetUserMetricsUseCase } from '../get-user-metrics'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repositoryt'

export function makeGetUserMatricsUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const authenticateUseCase = new GetUserMetricsUseCase(checkInsRepository)

  return authenticateUseCase
}
