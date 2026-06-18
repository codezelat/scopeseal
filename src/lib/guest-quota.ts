import { cookies } from "next/headers";

const COOKIE_NAME = "ss_guest_count";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function getGuestCount(): Promise<number> {
  const c = (await cookies()).get(COOKIE_NAME);
  return c ? Number(c.value) || 0 : 0;
}

export async function incrementGuestCount(): Promise<number> {
  const store = await cookies();
  const next = (Number(store.get(COOKIE_NAME)?.value) || 0) + 1;
  store.set(COOKIE_NAME, String(next), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return next;
}

export async function getGuestQuota(): Promise<number> {
  return Number(process.env.GUEST_REPORT_QUOTA ?? 3);
}

export async function checkGuestQuota(): Promise<{
  allowed: boolean;
  used: number;
  quota: number;
}> {
  const used = await getGuestCount();
  const quota = await getGuestQuota();
  return { allowed: used < quota, used, quota };
}
