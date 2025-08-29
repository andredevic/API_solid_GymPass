import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-use-case'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = checkInHistoryQuerySchema.parse(request.query)

  const FetchHistoryCheckInsUseCase = makeFetchUserCheckInsHistoryUseCase()

  const { checkIns } = await FetchHistoryCheckInsUseCase.execute({
    userId: request.user.sub, // Assuming the user ID is stored in the request object after JWT verification
    page,
  })

  return reply.status(200).send({
    checkIns,
  })
}
