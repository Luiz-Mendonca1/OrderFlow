// vai permitir a manipulação do banco de dados através do Prisma Client

import dotenv from "dotenv";
import { resolve } from "node:path";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { getOrganizationId } from "./tenantContext";

dotenv.config({ path: resolve(__dirname, "../../.env") });

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg(connectionString);

const prismaClient = new PrismaClient({ adapter }).$extends({
	query: {
		$allModels: {
			$allOperations({ model, operation, args, query }) {
				const organizationId = getOrganizationId();
				if (!organizationId || !["Category", "Product", "Order"].includes(model ?? "")) {
					return query(args);
				}

				const scopedArgs = args as Record<string, unknown>;
				const where = (scopedArgs.where ?? {}) as Record<string, unknown>;
				const scopedWhere = { ...where, organizationId };

				if (["create", "createMany"].includes(operation)) {
					const data = scopedArgs.data;
					scopedArgs.data = Array.isArray(data)
						? data.map((entry) => ({ ...(entry as Record<string, unknown>), organizationId }))
						: { ...(data as Record<string, unknown>), organizationId };
				} else if (operation === "upsert") {
					scopedArgs.where = scopedWhere;
					scopedArgs.create = { ...(scopedArgs.create as Record<string, unknown>), organizationId };
				} else if (operation.startsWith("find") || ["count", "aggregate", "groupBy", "update", "updateMany", "delete", "deleteMany"].includes(operation)) {
					scopedArgs.where = scopedWhere;
				}

				return query(scopedArgs as typeof args);
			},
		},
	},
});

export default prismaClient;