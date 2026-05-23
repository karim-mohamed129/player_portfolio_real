export function isTurnstileEnabled() {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

export async function verifyTurnstileToken(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: true, skipped: true };

  if (!token || typeof token !== "string" || token.length > 4096) {
    return { ok: false, error: "Security challenge is required." };
  }

  const formData = new URLSearchParams();
  formData.append("secret", secret);
  formData.append("response", token);
  if (ip && ip !== "unknown") formData.append("remoteip", ip);

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
      cache: "no-store"
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      return { ok: false, error: "Security challenge failed." };
    }
    return { ok: true };
  } catch (error) {
    console.error("[Turnstile verify failed]", error);
    return { ok: false, error: "Security challenge could not be verified." };
  }
}
