// detalhes do usuario logado
import prismaClient from "../../prisma";

class DetailUserService {
    async execute(user_id: string) {
        // Lógica para obter os detalhes do usuário logado
        const user = await prismaClient.user.findUnique({
            where: {
                id: user_id
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                organizationId: true,
                createdAt: true,
            }
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }
}

export { DetailUserService };