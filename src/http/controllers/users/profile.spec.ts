import { afterAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../../../app'
import { before } from 'node:test'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Profile Controller', () => {
  before(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to get an user profile', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: 'johndoe@example.com',
      }),
    )
  })
})
