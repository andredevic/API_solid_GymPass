import createGymAndAdmin from './create-gym-user'

async function seed() {
  await createGymAndAdmin()
}

seed()
