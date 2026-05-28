import {
  createPracticeQuiz,
  buildFallbackPracticeQuiz,
  shouldUsePracticeFallback,
  type PracticeQuizRequest,
} from "../src/server/practiceQuizGenerator.ts";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const body = req.body as PracticeQuizRequest;
  try {
    const quiz = await createPracticeQuiz(body);
    res.json(quiz);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create practice quiz";
    if (shouldUsePracticeFallback(message)) {
      return res.json(buildFallbackPracticeQuiz(body));
    }
    res.status(400).json({ error: message });
  }
}
