import { test, expect } from "@playwright/test";

/**
 * ScopeSeal E2E — acceptance criteria + QA scenarios from SPEC.md
 */

test.describe("Landing page", () => {
  test("renders hero, project types, and CTAs", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/ScopeSeal/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Seal the gaps");
    // Project types visible
    for (const pt of ["Website", "SEO", "Mobile App", "General Service"]) {
      await expect(page.getByText(pt).first()).toBeVisible();
    }
  });

  test("footer links navigate to legal pages", async ({ page }) => {
    await page.goto("/");
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    const privacyLink = page.getByRole("link", { name: "Privacy" }).first();
    await privacyLink.click();
    await expect(page).toHaveURL(/\/privacy/);
    await expect(page.getByRole("heading", { name: "Privacy Policy" })).toBeVisible();
  });
});

test.describe("Analyze flow — SPEC acceptance criteria", () => {
  test("accepts pasted text and produces a score", async ({ page }) => {
    await page.goto("/analyze");
    // Use the aria-label
    const textarea = page.getByLabel("Scope text input");
    await textarea.fill(
      "We need a simple website for our business. Make it quick and modern. We want unlimited revisions and ongoing support. Just a few pages, basic website.",
    );
    // Click the analyze button
    await page.getByRole("button", { name: "Analyze scope" }).click();
    // Wait for result to appear (score ring or result section)
    await expect(page.locator("text=/\\/\\s*100|score|clarity/i").first()).toBeVisible({
      timeout: 15_000,
    });
    // Page should not show an error
    await expect(page.locator("body")).not.toContainText("Application error");
  });
});

test.describe("QA scenarios from SPEC", () => {
  const scenarios = [
    { name: "vague website brief", text: "We need a simple website for our business. Make it quick. Just a few pages, basic website, we can decide details later." },
    { name: "detailed website scope", text: "Scope: 6-page corporate website (Home, About, Services, Blog, Contact, Privacy). Timeline: 6 weeks, launch by July 31. 2 revision rounds included. Payment: 30% deposit, 40% on approval, 30% on launch. Client provides all copy and brand assets. Hosting and domain on client account. 3 months post-launch support. Out of scope: e-commerce. Change requests billed per hour. Communication via email." },
    { name: "SEO monthly package", text: "Monthly SEO: keyword research, on-page optimization, 4 blog posts per month, monthly reporting. Contract: 6 months. Reporting metrics: organic traffic, keyword rankings. Payment: monthly retainer $2000. Client provides brand assets and content." },
    { name: "social media package", text: "Social media management: 12 posts per month across Instagram and Facebook. Content calendar provided monthly. 2 rounds of revisions per month. Payment: $1500/month. Client provides brand assets. Out of scope: paid advertising management." },
    { name: "software feature list", text: "Build a custom dashboard with user authentication, role-based access control, data visualization charts, export to CSV, API integration with Stripe. Timeline: 3 months. React frontend, Node.js backend. 2 revision rounds included." },
    { name: "maintenance request", text: "Monthly maintenance: security updates, bug fixes, performance monitoring, backup verification. Response time: 24 hours. Up to 10 hours per month included. Excludes: new feature development. Payment: $500/month retainer." },
    { name: "short WhatsApp message", text: "hey can you make a simple website like quick? maybe 3-4 pages. unlimited revisions ok? ongoing support also needed. basic website nothing fancy." },
    { name: "professional proposal section", text: "Project Scope: The agency will design and develop a responsive corporate website consisting of 8 pages. Timeline: 8 weeks from project kickoff. Deliverables include design mockups (2 revision rounds), frontend development, CMS integration, and 30 days of post-launch support. Payment terms: 25% deposit, 50% at development milestone, 25% on final delivery. Client responsibilities: provide all written content, brand guidelines, and photography. Hosting and domain registration to be handled by client. Out of scope: e-commerce functionality, custom API development, and mobile applications." },
    { name: "very long text", text: "This is a detailed project scope document for a comprehensive website redesign project. ".repeat(200) + " Timeline: 6 weeks. 2 revision rounds. Payment: 50% deposit, 50% on completion. Client provides content and brand assets." },
  ];

  for (const scenario of scenarios) {
    test(`analyzes "${scenario.name}" without errors`, async ({ page }) => {
      await page.goto("/analyze");
      await page.getByLabel("Scope text input").fill(scenario.text);
      await page.getByRole("button", { name: "Analyze scope" }).click();
      // Wait for processing
      await page.waitForTimeout(5000);
      // Page should not crash
      await expect(page.locator("body")).toBeVisible();
      await expect(page.locator("body")).not.toContainText("Application error");
    });
  }

  test("empty text keeps button disabled", async ({ page }) => {
    await page.goto("/analyze");
    const btn = page.getByRole("button", { name: "Analyze scope" });
    await expect(btn).toBeDisabled();
  });
});

test.describe("Auth", () => {
  test("signin page renders with form fields", async ({ page }) => {
    await page.goto("/signin");
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
  });

  test("signup page renders with form fields", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.getByRole("heading", { name: /create your account/i })).toBeVisible();
  });
});

test.describe("No legal advice claims", () => {
  test("landing page does not mention legal advice", async ({ page }) => {
    await page.goto("/");
    const body = await page.locator("body").textContent();
    expect(body).not.toContain("legal advice");
    expect(body).not.toContain("attorney");
    expect(body).not.toContain("contract is invalid");
  });
});

test.describe("Public pages", () => {
  test("privacy page renders with content", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { name: "Privacy Policy" })).toBeVisible();
    await expect(page.locator("body")).toContainText("Chrome extension");
    await expect(page.locator("body")).toContainText("Not legal advice");
  });

  test("terms page renders with content", async ({ page }) => {
    await page.goto("/terms");
    await expect(page.getByRole("heading", { name: "Terms of Service" })).toBeVisible();
    await expect(page.locator("body")).toContainText("No legal advice");
  });

  test("support page renders with content", async ({ page }) => {
    await page.goto("/support");
    await expect(page.getByRole("heading", { name: "Support" })).toBeVisible();
  });

  test("robots.txt is served with correct rules", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response?.status()).toBe(200);
    const content = await response?.text();
    expect(content?.toLowerCase()).toContain("user-agent");
    expect(content).toContain("Disallow: /app");
  });

  test("sitemap.xml is served", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
  });

  test("manifest.webmanifest is served", async ({ page }) => {
    const response = await page.goto("/manifest.webmanifest");
    expect(response?.status()).toBe(200);
  });

  test("404 page renders branded not-found", async ({ page }) => {
    await page.goto("/this-does-not-exist");
    await expect(page.getByText("404")).toBeVisible();
  });
});
