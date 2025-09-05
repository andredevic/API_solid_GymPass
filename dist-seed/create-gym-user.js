"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createGymAndAdmin;
const zod_1 = require("zod");
const make_create_gym_use_case_1 = require("@/use-cases/factories/make-create-gym-use-case");
const make_register_use_case_1 = require("@/use-cases/factories/make-register-use-case");
const client_1 = require("@prisma/client");
const prisma_1 = require("@/lib/prisma");
const gym = {
    title: 'Academia JavaScript',
    description: 'Academia criada pelo seed',
    phone: '907234',
    latitude: -15.8357863,
    longitude: -48.0363827,
};
const userAdmin = {
    name: 'André',
    email: 'andre@andre.com',
    password: '123456',
    role: client_1.Role.ADMIN,
};
async function createGymAndAdmin() {
    // 1. Criar usuário admin
    const registerUseCase = (0, make_register_use_case_1.makeRegisterUseCase)();
    await registerUseCase.execute(userAdmin);
    const admin = await prisma_1.prisma.user.findUnique({
        where: { email: userAdmin.email },
    });
    if (!admin) {
        throw new Error('❌ Admin não foi criado no seed');
    }
    console.log('✅ Admin criado:', admin.email);
    // 2. Criar academia (sem precisar autenticar via rota, chamando caso de uso direto)
    const createGymBodySchema = zod_1.z.object({
        title: zod_1.z.string(),
        description: zod_1.z.string().nullable(),
        phone: zod_1.z.string().nullable(),
        latitude: zod_1.z.number().refine((value) => Math.abs(value) <= 90),
        longitude: zod_1.z.number().refine((value) => Math.abs(value) <= 180),
    });
    const { title, description, phone, latitude, longitude } = createGymBodySchema.parse(gym);
    const makeCreateGymUseCase = (0, make_create_gym_use_case_1.makeCreateGymsUseCase)();
    await makeCreateGymUseCase.execute({
        title,
        description,
        phone,
        latitude,
        longitude,
    });
    console.log('✅ Academia criada:', gym.title);
}
