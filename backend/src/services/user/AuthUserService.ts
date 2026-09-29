import bcrypt from "bcryptjs";
import prismaClient from "../../prisma";
import { sign } from "jsonwebtoken";

interface AuthUserServiceProps {
    email: string;
    password: string;
}

class AuthUserService {
    async execute({ email, password }: AuthUserServiceProps) {
        // Lógica para autenticar o usuário
        const user = await prismaClient.user.findFirst({
            where: {
                email
            }
        });

        if (!user) {
            throw new Error('User not found or invalid credentials');
        }

        // verifica se a senha fornecida corresponde à senha armazenada no banco de dados
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw new Error('Invalid password');
        }

        const token = sign({
            userId: user.id,
            organizationId: user.organizationId,
            role: user.role,
        },
         process.env.JWT_SECRET as string, 
        {
            subject: user.id,
            expiresIn: '30d'
        });

        return { 
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            organizationId: user.organizationId,
            token
        };
    }
}

export { AuthUserService };