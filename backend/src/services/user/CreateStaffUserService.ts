import bcrypt from "bcryptjs";
import prismaClient from "../../prisma";

interface CreateStaffUserProps {
  name: string;
  email: string;
  password: string;
  organizationId: string;
}

class CreateStaffUserService {
  async execute({ name, email, password, organizationId }: CreateStaffUserProps) {
    const existingUser = await prismaClient.user.findUnique({ where: { email } });
    if (existingUser) {
      const error = new Error("Este e-mail já foi cadastrado.") as Error & { statusCode: number };
      error.statusCode = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 8);
    return prismaClient.user.create({
      data: { name, email, password: passwordHash, role: "STAFF", organizationId },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
  }
}

export { CreateStaffUserService };