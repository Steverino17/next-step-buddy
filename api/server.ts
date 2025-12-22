import type { VercelRequest, VercelResponse } from "@vercel/node";

function normalize(s: unknown) {
  return String(s ?? "").trim();
}

function isVagueGoal(goal: string) {
  const words = goal.split(/\s+/).filter(Boolean);
  if (goal.length < 12) return true;
  if (words.length < 2) return true;
  // super-generic “goals”
  const generic = ["improve", "grow", "get better", "be better", "work on", "fix"];
  const lower = goal.toLowerCase();
  return generic.some((g) => lower === g || lower.startsWith(g + " "));
}

function buildClarifyThenNextStep(goal: string, blocker: string) {
  const hasBlocker = blocker.length > 0;

  // ONE clarifying question, then actionable paths immediately (no multi-turn UI needed).
  const question = hasBlocker
    ? `Quick question before I suggest your next step: which is the bigger constraint right now — TIME, CLARITY, MOTIVATION, or FEAR?`
    : `Quick question before I suggest your next step: what’s MOST in the way right now — TIME, CLARITY, MOTIVATION, or FEAR?`;

  const steps = [
    `If TIME: set a 10-minute timer and do the smallest “start” action (open the doc, create the file, write the first 3 bullets). Stop at 10 minutes.`,
    `If CLARITY: write a 2-sentence definition of “done” for "${goal}" (what it is + what it is not). Then list the first milestone.`,
    `If MOTIVATION: lower the bar—commit to a “bad first draft” version and finish it today. Perfection is banned.`,
    `If FEAR: do the safest test—run a tiny experiment that can’t “fail” (share with one person, ship a private version, do a dry-run).`,
  ];

  const context = hasBlocker
    ? `Context: you said the blocker is "${blocker}".`
    : `Context: you didn’t add a blocker (totally fine).`;

  return `${question}\n\n${context}\n\nDo this next (pick ONE path):\n- ${steps.join("\n- ")}`;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Helpful GET response (so pasting /api/server in a browser shows "alive")
  if (req.method !== "POST") {
    return res.status(200).json({
      name: "Next Step Buddy",
      status: "alive",
      message: "Send a POST request with { goal, blocker }",
    });
  }

  const goal = normalize((req.body as any)?.goal);
  const blocker = normalize((req.body as any)?.blocker);

  if (!goal) {
    return res.status(400).json({ error: "Missing 'goal'" });
  }

  // Ask ONE clarifying question only when it materially helps:
  // - no blocker provided, OR
  // - goal is vague
  const shouldClarify = !blocker || isVagueGoal(goal);

  if (shouldClarify) {
    return res.status(200).json({
      result: buildClarifyThenNextStep(goal, blocker),
    });
  }

  // Otherwise: normal direct next step
  const blockerText = blocker ? ` (even if "${blocker}" is still there)` : "";
  return res.status(200).json({
    result: `Do this next: take one small action that moves "${goal}" forward${blockerText}.`,
  });
}
