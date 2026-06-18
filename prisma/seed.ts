import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

async function main() {
  // Settings
  const settings = [
    { key: "aiModeEnabled", value: { value: false } },
    { key: "guestQuota", value: { value: Number(process.env.GUEST_REPORT_QUOTA ?? 3) } },
    { key: "rateLimit", value: { windowSeconds: 60, maxRequests: 10 } },
    { key: "branding", value: { name: "ScopeSeal", publisher: "Codezela Technologies" } },
  ];
  for (const s of settings) {
    await db.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log(`✓ ${settings.length} settings`);

  // Admin user
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@codezela.com";
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.warn(
      "⚠ ADMIN_PASSWORD not set — skipping admin user. Set it in .env and re-run `pnpm db:seed`.",
    );
  } else {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await db.user.upsert({
      where: { email: adminEmail },
      update: { passwordHash, role: "ADMIN" },
      create: { email: adminEmail, passwordHash, role: "ADMIN", name: "ScopeSeal Admin" },
    });
    console.log(`✓ admin user (${adminEmail})`);
  }

  // Default templates
  const templates = [
    {
      projectType: "website",
      title: "Corporate website scope",
      body: "Scope: [N]-page website ([pages]). Timeline: [X] weeks. [N] revision rounds included. Payment: [milestones]. Content provided by client. Hosting/domain on client account. [N] months post-launch support. Out of scope: [items].",
      sortOrder: 1,
    },
    {
      projectType: "seo",
      title: "Monthly SEO package",
      body: "Monthly deliverables: [keyword research], [on-page optimization], [N blog posts], [report]. Reporting cadence: monthly. Success metrics: [KPIs]. Term: [N] months. Cancellation: [notice]. Out of scope: paid ads management.",
      sortOrder: 2,
    },
    {
      projectType: "maintenance",
      title: "Maintenance & support plan",
      body: "Maintenance scope: [bug fixes, updates, monitoring]. Response time: [SLA]. Hours included: [N]/month. Excludes: new feature development. Term: monthly retainer. Communication: [channel].",
      sortOrder: 3,
    },
    {
      projectType: "general",
      title: "General service scope",
      body: "Deliverables: [list]. Timeline: [dates]. Revisions: [N] rounds. Payment: [schedule]. Client responsibilities: [list]. Out of scope: [items].",
      sortOrder: 4,
    },
  ];
  for (const t of templates) {
    const existing = await db.template.findFirst({
      where: { projectType: t.projectType, title: t.title },
    });
    if (!existing) await db.template.create({ data: t });
  }
  console.log(`✓ ${templates.length} templates`);
}

main()
  .then(() => db.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
