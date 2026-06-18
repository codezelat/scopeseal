export function hasSensitiveContent(text: string): boolean {
  if (/\b\d{13,16}\b/.test(text)) return true;

  if (
    /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/.test(text) ||
    /\b\d{4}[\s-]?\d{6}[\s-]?\d{5}\b/.test(text)
  ) {
    return true;
  }

  const lower = text.toLowerCase();

  if (/\b\d{3}[\s-]?\d{2}[\s-]?\d{4}\b/.test(text)) {
    if (
      lower.includes("social security") ||
      lower.includes("ssn") ||
      lower.includes("ss#")
    ) {
      return true;
    }
  }

  if (/\b\d{3}[\s-]?\d{3}[\s-]?\d{4}\b/.test(text)) {
    if (
      lower.includes("password") ||
      lower.includes("pin") ||
      lower.includes("passcode")
    ) {
      return true;
    }
  }

  const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(
    text,
  );
  if (hasEmail) {
    if (
      lower.includes("password") ||
      lower.includes("ssn") ||
      lower.includes("social security")
    ) {
      return true;
    }
  }

  if (/\bnda\b/.test(lower) && lower.includes("confidential")) return true;
  if (lower.includes("confidential contract")) return true;
  if (lower.includes("non-disclosure")) return true;

  if (/\b\d{9,}\b/.test(text)) {
    if (
      lower.includes("account number") ||
      lower.includes("account id") ||
      lower.includes("customer id")
    ) {
      return true;
    }
  }

  return false;
}
