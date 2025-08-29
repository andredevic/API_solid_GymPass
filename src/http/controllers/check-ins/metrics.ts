import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetUserMatricsUseCase } from '@/use-cases/factories/make-get-user-matrics-use-case'

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const GetUserMatricsUseCase = makeGetUserMatricsUseCase()

  const { checkInsCount } = await GetUserMatricsUseCase.execute({
    userId: request.user.sub, // Assuming the user ID is stored in the request object after JWT verification
  })

  return reply.status(200).send({
    checkInsCount,
  })
}
