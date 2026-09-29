import { Request, Response } from "express";
import prismaClient from "../../prisma";
import { CreateStaffUserService } from "../../services/user/CreateStaffUserService";

class TeamController {
  async list(req: Request, res: Response) {
    const users = await prismaClient.user.findMany({
      where: { organizationId: req.organization_id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });
    return res.json(users);
  }

  async create(req: Request, res: Response) {
    try {
      const user = await new CreateStaffUserService().execute({
        ...req.body,
        organizationId: req.organization_id,
      });
      return res.status(201).json(user);
    } catch (error) {
      if (error instanceof Error && "statusCode" in error) {
        return res.status(Number(error.statusCode)).json({ error: error.message });
      }
      return res.status(500).json({ error: "Não foi possível cadastrar o membro da equipe." });
    }
  }
}

export { TeamController };