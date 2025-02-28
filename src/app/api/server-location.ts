export default async function handler(req, res) {
  res.json({ region: process.env.VERCEL_REGION || "Unknown" });
}
