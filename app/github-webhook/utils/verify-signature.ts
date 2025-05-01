import crypto from "crypto";

export const verifySignature = (
  buf: Buffer,
  signature: string | null
): boolean => {
  if (!signature) return false;

  const hmac = crypto.createHmac("sha256", process.env.GITHUB_WEBHOOK_SECRET!);
  const digest = "sha256=" + hmac.update(buf).digest("hex");
  return signature === digest;
};
