import prismaClient from "../../prisma/index";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import { randomUUID } from "node:crypto";

interface CreateUserProps {
    name: string;
    email: string;
    password: string;
    organizationName: string;
}

class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
    }
}

// Lógica para criar um usuário
class CreateUserService {
    async execute({ name, email, password, organizationName }: CreateUserProps) {
        const userAlreadyExists = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        });

        if (userAlreadyExists) {
            throw new AppError("Este e-mail já foi cadastrado.", 409);
        }

        const passwordHash = await bcrypt.hash(password, 8);

        const baseSlug = organizationName
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "") || "estabelecimento";
        const result = await prismaClient.$transaction(async (transaction) => {
            const organization = await transaction.organization.create({
                data: { name: organizationName.trim(), slug: `${baseSlug}-${randomUUID().slice(0, 8)}` },
            });
            const user = await transaction.user.create({
                data: { name, email, password: passwordHash, role: "ADMIN", organizationId: organization.id },
                select: { id: true, name: true, email: true, role: true, organizationId: true, createdAt: true },
            });
            return { organization, user };
        });

        const token = sign({
            userId: result.user.id,
            organizationId: result.organization.id,
            role: result.user.role,
        }, process.env.JWT_SECRET as string, { subject: result.user.id, expiresIn: "30d" });

        return { ...result.user, token };
    }
}

export { CreateUserService };