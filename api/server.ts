import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(200).json({
      name: "Next Step Buddy",
      status: "alive",
      message: "Send a POST request with { goal, blocker }"
    });
  }

  const { goal, blocker } = req.body || {};

  if (!goal) {
    return res.status(400).json({
      error: "Missing 'goal'"
    });
  }

  const blockerText = blocker
    ? ` (even if "${blocker}" is still there)`
    : "";

  return res.status(200).json({
    result: `Do this next: take one small action that moves "${goal}" forward${blockerText}.`
  });
}
