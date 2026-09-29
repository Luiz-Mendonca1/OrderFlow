CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

INSERT INTO "organizations" ("id", "name", "slug")
VALUES ('00000000-0000-0000-0000-000000000001', 'Organização legada', 'organizacao-legada');

ALTER TABLE "users" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "categories" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "products" ADD COLUMN "organizationId" TEXT;
ALTER TABLE "orders" ADD COLUMN "organizationId" TEXT;

UPDATE "users" SET "organizationId" = '00000000-0000-0000-0000-000000000001';
UPDATE "categories" SET "organizationId" = '00000000-0000-0000-0000-000000000001';
UPDATE "products" SET "organizationId" = '00000000-0000-0000-0000-000000000001';
UPDATE "orders" SET "organizationId" = '00000000-0000-0000-0000-000000000001';

ALTER TABLE "users" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "categories" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "products" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "orders" ALTER COLUMN "organizationId" SET NOT NULL;

DROP INDEX "categories_name_key";
CREATE UNIQUE INDEX "categories_organizationId_name_key" ON "categories"("organizationId", "name");
CREATE UNIQUE INDEX "categories_id_organizationId_key" ON "categories"("id", "organizationId");

ALTER TABLE "users" ADD CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "categories" ADD CONSTRAINT "categories_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "products" ADD CONSTRAINT "products_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "orders" ADD CONSTRAINT "orders_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "products" DROP CONSTRAINT "products_categoryId_fkey";
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_organizationId_fkey" FOREIGN KEY ("categoryId", "organizationId") REFERENCES "categories"("id", "organizationId") ON DELETE CASCADE ON UPDATE CASCADE;