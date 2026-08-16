import { test, expect } from "@playwright/test";
import { randomUUID } from "node:crypto";

try {
  process.loadEnvFile(".env");
} catch {
  // CI provides environment variables directly.
}

/**
 * ScopeSeal E2E — acceptance criteria + QA scenarios from SPEC.md
 */

test.describe("Landing page", () => {
  test("renders hero, product features, and CTAs", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/ScopeSeal/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Seal the gaps/i);
    for (const feature of ["Clarity Score", "Missing Item Detection", "Risk Detection", "Clear Suggestions"]) {
      await expect(page.getByText(feature).first()).toBeVisible();
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

  test("public navigation uses real routes and safe external links", async ({ page }) => {
    await page.goto("/");

    const primaryNavigation = page.getByRole("navigation", { name: "Primary navigation" });
    await expect(primaryNavigation.getByRole("link", { name: "Features" })).toHaveAttribute("href", "/features");
    await expect(primaryNavigation.getByRole("link", { name: "How It Works" })).toHaveAttribute("href", "/how-it-works");
    await expect(primaryNavigation.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact");
    await expect(page.getByRole("link", { name: "Sign in" }).first()).toHaveAttribute("href", "/signin");

    const codezelaLink = page.getByRole("link", { name: "Codezela Technologies" }).last();
    await expect(codezelaLink).toHaveAttribute("href", "https://codezela.com/");
    await expect(codezelaLink).toHaveAttribute("target", "_blank");
    await expect(codezelaLink).toHaveAttribute("rel", /noopener/);

    const linkedIn = page.getByRole("link", { name: /LinkedIn, Codezela Technologies/ });
    await expect(linkedIn).toHaveAttribute("href", "https://www.linkedin.com/company/codezela-technologies/");
    await expect(linkedIn).toHaveAttribute("target", "_blank");
  });

  test("profile carousel advances and light mode uses the light extension artwork", async ({ page }) => {
    await page.goto("/");

    const profiles = page.locator("#profiles");
    await profiles.scrollIntoViewIfNeeded();
    await profiles.getByRole("button", { name: "Next profile" }).click();
    await expect(profiles.getByRole("button", { name: "Show Adrian Cole" })).toHaveAttribute(
      "aria-current",
      "true",
    );

    await page.getByRole("button", { name: "Use light theme" }).click();
    const extensionVisual = page.getByRole("img", {
      name: /ScopeSeal Chrome extension open in Chrome/i,
    });
    await extensionVisual.scrollIntoViewIfNeeded();
    const lightArtwork = extensionVisual.locator("img").first();
    await expect(lightArtwork).toBeVisible();
    await expect(lightArtwork).toHaveAttribute("src", /extension-realistic-light\.webp/);
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
      await expect(page).toHaveURL(/\/result\//, { timeout: 15_000 });
      await expect(
        page.getByRole("heading", { name: /Clear scope|Needs review|High risk/ }),
      ).toBeVisible();
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
    await expect(page.getByRole("link", { name: "Forgot password?" })).toHaveAttribute(
      "href",
      "/forgot-password",
    );
  });

  test("signup page renders with form fields", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.getByRole("heading", { name: /create your account/i })).toBeVisible();
  });

  test("forgot-password page renders the recovery form", async ({ page }) => {
    await page.goto("/forgot-password");
    await expect(page).toHaveTitle(/Forgot password/);
    await expect(page.getByRole("heading", { name: "Forgot password?" })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByRole("button", { name: "Send reset link" })).toBeVisible();
  });

  test("invalid reset links fail closed", async ({ page }) => {
    await page.goto("/reset-password?token=invalid");
    await expect(page).toHaveTitle(/Reset password/);
    await expect(page.getByRole("heading", { name: "Link unavailable" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Request a new link" })).toHaveAttribute(
      "href",
      "/forgot-password",
    );
    await expect(page.getByLabel("New password")).toHaveCount(0);
  });

  test("signin confirms a completed reset without exposing the token", async ({ page }) => {
    await page.goto("/signin?reset=success");
    await expect(page.getByRole("status")).toContainText(
      "Password updated. Sign in with your new password.",
    );
    await expect(page).not.toHaveURL(/token=/);
  });
});

test.describe("Authenticated application", () => {
  test("completes the private review and account lifecycle", async ({ page, browser }) => {
    const id = randomUUID();
    const email = `scope-e2e-${id}@example.com`;
    const password = `Scope-${id}-A1!`;
    const newPassword = `Changed-${id}-B2!`;

    await page.goto("/signup");
    await page.getByLabel("Name").fill("Scope E2E User");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page).toHaveURL(/\/app$/, { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: /Welcome, Scope/ })).toBeVisible();

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/app$/);

    await page.getByRole("link", { name: "Templates" }).click();
    await expect(page.getByRole("heading", { name: "Templates" })).toBeVisible();
    await page.getByRole("link", { name: "Use template" }).first().click();
    await expect(page).toHaveURL(/\/analyze\?template=/);

    await page.getByLabel("Scope text input").fill(
      "Build a six-page website in eight weeks with two revision rounds. Payment is 50% upfront and 50% at launch. The client supplies copy and brand assets. Hosting stays in the client account. Acceptance requires signed UAT. Out of scope is e-commerce. Contact email: client@example.com password: TemporarySecret123.",
    );
    await page.getByRole("button", { name: "Analyze scope" }).click();
    await expect(page).toHaveURL(/\/result\//, { timeout: 15_000 });
    await expect(page.getByText("This brief may contain sensitive content.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Enable sharing" })).toBeVisible();

    const resultUrl = page.url();
    const anonymousContext = await browser.newContext();
    const anonymousPage = await anonymousContext.newPage();
    await anonymousPage.goto(resultUrl);
    await expect(anonymousPage.getByText("404")).toBeVisible();

    await page.getByRole("button", { name: "Enable sharing" }).click();
    await expect(page.getByRole("button", { name: "Make private" })).toBeVisible();
    await anonymousPage.goto(resultUrl);
    await expect(anonymousPage.getByRole("heading", { name: /Clear scope|Needs review|High risk/ })).toBeVisible();

    await page.getByRole("button", { name: "Make private" }).click();
    await expect(page.getByRole("button", { name: "Enable sharing" })).toBeVisible();
    await anonymousPage.goto(resultUrl);
    await expect(anonymousPage.getByText("404")).toBeVisible();
    await anonymousContext.close();

    await page.goto("/app/reviews");
    await expect(page.getByRole("heading", { name: "Reviews" })).toBeVisible();
    await expect(page.getByText("1 saved")).toBeVisible();
    await expect(page.getByRole("row")).toHaveCount(2);

    await page.goto("/app/settings");
    await page.getByLabel("Name").fill("Scope Verified");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Name updated")).toBeVisible();

    await page.getByLabel("Current password").fill(password);
    await page.getByLabel("New password").fill(newPassword);
    await page.getByLabel("Confirm password").fill(newPassword);
    await page.getByRole("button", { name: "Change password" }).click();
    await expect(page).toHaveURL(/\/signin\?reset=success/, { timeout: 15_000 });

    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(newPassword);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/app$/, { timeout: 15_000 });

    await page.goto("/app/settings");
    await page.getByRole("button", { name: "Delete account" }).click();
    await page.getByLabel("Password").last().fill(newPassword);
    await page.getByRole("button", { name: "Delete permanently" }).click();
    await expect(page).toHaveURL(/\/$/, { timeout: 15_000 });
    await page.goto("/app");
    await expect(page).toHaveURL(/\/signin$/);
  });

  test("rejects protected APIs without a session", async ({ request }) => {
    expect((await request.get("/api/admin/settings")).status()).toBe(403);
    expect((await request.patch("/api/user/update-name", { data: { name: "No session" } })).status()).toBe(401);
    expect((await request.delete("/api/reviews/not-a-review")).status()).toBe(401);
  });

  test("renders every admin workspace for a configured administrator", async ({ page }) => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    test.skip(!adminEmail || !adminPassword, "Admin seed credentials are not configured");

    await page.goto("/signin");
    await page.getByLabel("Email").fill(adminEmail!);
    await page.getByLabel("Password").fill(adminPassword!);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/app$/, { timeout: 15_000 });

    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "Overview" })).toBeVisible();
    await page.goto("/admin/users");
    await expect(page.getByRole("heading", { name: "Users", exact: true })).toBeVisible();
    await page.goto("/admin/settings");
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
    await page.goto("/admin/ai-config");
    await expect(page.getByRole("heading", { name: "AI Configuration" })).toBeVisible();
    expect((await page.request.get("/api/admin/settings")).status()).toBe(200);
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
    await expect(page.getByRole("heading", { name: "How can we help?" })).toBeVisible();
  });

  test("features page renders the product overview", async ({ page }) => {
    await page.goto("/features");
    await expect(page.getByRole("heading", { name: "Know what the brief missed." })).toBeVisible();
    await expect(page.getByRole("link", { name: /Analyze a brief/ })).toHaveAttribute("href", "/analyze");
  });

  test("how-it-works page renders all three steps", async ({ page }) => {
    await page.goto("/how-it-works");
    await expect(page.getByRole("heading", { name: "From vague to clear in three steps." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Paste the brief" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Run the check" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Act on the report" })).toBeVisible();
  });

  test("contact page renders an accessible contact form", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByRole("heading", { name: "Let’s talk scope." })).toBeVisible();
    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Subject")).toBeVisible();
    await expect(page.getByLabel("Message")).toBeVisible();
    await expect(page.getByRole("button", { name: "Send message" })).toBeVisible();
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
