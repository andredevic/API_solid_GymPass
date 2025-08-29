import { afterAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../../../app'
import { before } from 'node:test'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Create Check-in Controller', () => {
  before(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'JavaScript Gym',
        latitude: -15.8357863,
        longitude: -48.0363827,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -15.8357863,
        longitude: -48.0363827,
      })

    expect(response.statusCode).toEqual(201)
  })
})
