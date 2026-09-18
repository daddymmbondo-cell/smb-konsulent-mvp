// Enkel in-memory rate-limiting for offentlige skjemaer i MVP.
// NB: fungerer kun per server-instans. Ved skalering til flere instanser
// bør dette erstattes med en delt løsning (f.eks. Redis/Upstash).

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function isRateLimited(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  bucket.count += 1;
  return bucket.count > limit;
}
