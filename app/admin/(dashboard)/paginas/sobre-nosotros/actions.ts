"use server";

import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { centeredHeroContentSchema, ctaBandContentSchema } from "@/lib/page-sections/shared";
import {
  historiaContentSchema,
  fundadorContentSchema,
  equipoIntroContentSchema,
  laboratorioContentSchema,
  diferencialesContentSchema,
} from "@/lib/page-sections/sobre-nosotros";

export interface SectionFormState {
  error?: string;
  success?: boolean;
}

function revalidateSobreNosotros() {
  revalidatePath("/sobre-nosotros");
}

async function upsertSection(key: string, content: object, visible: boolean) {
  await prisma.pageSection.upsert({
    where: { page_key: { page: "sobre-nosotros", key } },
    update: { content, visible },
    create: { page: "sobre-nosotros", key, content, visible },
  });
}

function firstIssueMessage(error: { issues: { message: string }[] }): string {
  return error.issues[0]?.message ?? "Revisá los campos, algo no es válido.";
}

function readVisible(formData: FormData): boolean {
  return formData.get("visible") === "on";
}

export async function updateSobreNosotrosEncabezado(
  _prevState: SectionFormState,
  formData: FormData
): Promise<SectionFormState> {
  await requireAdminSession();

  const parsed = centeredHeroContentSchema.safeParse({
    eyebrow: String(formData.get("eyebrow") ?? ""),
    title: String(formData.get("title") ?? ""),
    subtitle: String(formData.get("subtitle") ?? ""),
  });
  if (!parsed.success) return { error: firstIssueMessage(parsed.error) };

  await upsertSection("centered-hero", parsed.data, readVisible(formData));
  revalidateSobreNosotros();
  return { success: true };
}

export async function updateHistoriaSection(
  _prevState: SectionFormState,
  formData: FormData
): Promise<SectionFormState> {
  await requireAdminSession();

  const parsed = historiaContentSchema.safeParse({
    eyebrow: String(formData.get("eyebrow") ?? ""),
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    photo: String(formData.get("photo") ?? ""),
  });
  if (!parsed.success) return { error: firstIssueMessage(parsed.error) };
  if (!parsed.data.photo) return { error: "Subí la foto de esta sección." };

  await upsertSection("historia", parsed.data, readVisible(formData));
  revalidateSobreNosotros();
  return { success: true };
}

export async function updateFundadorSection(
  _prevState: SectionFormState,
  formData: FormData
): Promise<SectionFormState> {
  await requireAdminSession();

  const tags = formData
    .getAll("tag")
    .map(String)
    .map((t) => t.trim())
    .filter(Boolean);

  const parsed = fundadorContentSchema.safeParse({
    eyebrow: String(formData.get("eyebrow") ?? ""),
    sectionTitle: String(formData.get("sectionTitle") ?? ""),
    name: String(formData.get("name") ?? ""),
    role: String(formData.get("role") ?? ""),
    bio: String(formData.get("bio") ?? ""),
    tags,
    photo: String(formData.get("photo") ?? ""),
  });
  if (!parsed.success) return { error: firstIssueMessage(parsed.error) };
  if (!parsed.data.photo) return { error: "Subí la foto del fundador." };

  await upsertSection("fundador", parsed.data, readVisible(formData));
  revalidateSobreNosotros();
  return { success: true };
}

export async function updateEquipoIntroSection(
  _prevState: SectionFormState,
  formData: FormData
): Promise<SectionFormState> {
  await requireAdminSession();

  const parsed = equipoIntroContentSchema.safeParse({
    eyebrow: String(formData.get("eyebrow") ?? ""),
    title: String(formData.get("title") ?? ""),
    subtitle: String(formData.get("subtitle") ?? ""),
  });
  if (!parsed.success) return { error: firstIssueMessage(parsed.error) };

  await upsertSection("equipo-intro", parsed.data, readVisible(formData));
  revalidateSobreNosotros();
  return { success: true };
}

export async function updateLaboratorioSection(
  _prevState: SectionFormState,
  formData: FormData
): Promise<SectionFormState> {
  await requireAdminSession();

  const parsed = laboratorioContentSchema.safeParse({
    eyebrow: String(formData.get("eyebrow") ?? ""),
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    photo: String(formData.get("photo") ?? ""),
  });
  if (!parsed.success) return { error: firstIssueMessage(parsed.error) };
  if (!parsed.data.photo) return { error: "Subí la foto de esta sección." };

  await upsertSection("laboratorio", parsed.data, readVisible(formData));
  revalidateSobreNosotros();
  return { success: true };
}

export async function updateDiferencialesSection(
  _prevState: SectionFormState,
  formData: FormData
): Promise<SectionFormState> {
  await requireAdminSession();

  const titles = formData.getAll("itemTitle").map(String);
  const descs = formData.getAll("itemDesc").map(String);
  const items = titles.map((title, i) => ({ title, desc: descs[i] ?? "" }));

  const parsed = diferencialesContentSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    items,
  });
  if (!parsed.success) return { error: firstIssueMessage(parsed.error) };

  await upsertSection("diferenciales", parsed.data, readVisible(formData));
  revalidateSobreNosotros();
  return { success: true };
}

export async function updateSobreNosotrosCtaBand(
  _prevState: SectionFormState,
  formData: FormData
): Promise<SectionFormState> {
  await requireAdminSession();

  const parsed = ctaBandContentSchema.safeParse({
    headline: String(formData.get("headline") ?? ""),
    subtitle: String(formData.get("subtitle") ?? ""),
    buttonLabel: String(formData.get("buttonLabel") ?? ""),
    buttonHref: String(formData.get("buttonHref") ?? ""),
    backgroundImage: String(formData.get("backgroundImage") ?? "").trim() || null,
    backgroundFrom: String(formData.get("backgroundFrom") ?? "").trim() || null,
    backgroundTo: String(formData.get("backgroundTo") ?? "").trim() || null,
  });
  if (!parsed.success) return { error: firstIssueMessage(parsed.error) };

  await upsertSection("cta-band", parsed.data, readVisible(formData));
  revalidateSobreNosotros();
  return { success: true };
}
