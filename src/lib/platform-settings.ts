import { db } from "@/lib/db";

export async function getPlatformSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    const setting = await db.setting.findUnique({ where: { key }, select: { value: true } });
    return setting?.value === undefined || setting.value === null ? fallback : setting.value as T;
  } catch {
    return fallback;
  }
}
