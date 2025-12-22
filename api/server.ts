import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Health / quick check in browser
  if (req.method !== "POST") {
    return res.status(200).json({
      name: "Next Step Buddy",
      status: "alive",
      message: "Send a POST request with { goal, blocker }",
    });
  }

  const body = req.body ?? {};
  const goal = typeof body.goal === "string" ? body.goal.trim() : "";
  const blocker =
    typeof body.blocker === "string" ? body.blocker.trim() : "";

  if (!goal) {
    return res.status(400).json({ error: "Missing 'goal'" });
  }

  const blockerText = blocker ? ` (even if "${blocker}" is still there)` : "";

  // Option A: ALWAYS return ONE next step (no questions)
  // Keep it simple and consistent.
  const result = `Do this next: take one small action that moves "${goal}" forward${blockerText}.`;

  return res.status(200).json({ result });
}
