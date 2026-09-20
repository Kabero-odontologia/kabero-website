-- AlterTable
ALTER TABLE "Admin" ADD COLUMN "email" TEXT;
ALTER TABLE "Admin" ADD COLUMN "resetTokenHash" TEXT;
ALTER TABLE "Admin" ADD COLUMN "resetTokenExpiry" DATETIME;

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_resetTokenHash_key" ON "Admin"("resetTokenHash");
