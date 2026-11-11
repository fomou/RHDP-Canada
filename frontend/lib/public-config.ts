export type StripeKeyStatus = "missing" | "placeholder" | "configured";

export function stripePublishableKeyStatus(): StripeKeyStatus {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
  if (key.length === 0) {
    return "missing";
  }
  if (!key.startsWith("pk_") || key.includes("replace_me")) {
    return "placeholder";
  }
  return "configured";
}

export function publicApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
  return url.replace(/\/$/, "");
}
