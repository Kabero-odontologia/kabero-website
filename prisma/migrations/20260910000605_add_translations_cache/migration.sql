-- AlterTable
ALTER TABLE "CaseStudy" ADD COLUMN "translations" JSONB;

-- AlterTable
ALTER TABLE "FAQ" ADD COLUMN "translations" JSONB;

-- AlterTable
ALTER TABLE "PageSection" ADD COLUMN "translations" JSONB;

-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN "translations" JSONB;

-- AlterTable
ALTER TABLE "TeamMember" ADD COLUMN "translations" JSONB;

-- AlterTable
ALTER TABLE "Treatment" ADD COLUMN "translations" JSONB;

-- AlterTable
ALTER TABLE "TreatmentOffer" ADD COLUMN "translations" JSONB;
