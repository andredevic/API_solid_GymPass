import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })
  it('should be able to Create Gym', async () => {
    const { gym } = await sut.execute({
      title: 'JavaScript Gym',
      description: 'A gym for JavaScript enthusiasts',
      phone: '123456789',
      latitude: -15.8357863,
      longitude: -48.0363827,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
