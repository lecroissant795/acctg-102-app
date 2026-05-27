import { createQuizPlan, type QuizPlanRequest } from "../src/server/quizPlanner.ts";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const body = req.body as QuizPlanRequest;
    const plan = await createQuizPlan(body);
    res.json(plan);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create quiz plan";
    const status = message.includes("OPENAI_API_KEY") ? 503 : 400;
    res.status(status).json({ error: message });
  }
}
