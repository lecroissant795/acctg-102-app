import {
  createTutorResponse,
  buildFallbackTutorResponse,
  type TutorRequest,
} from "../src/server/quizTutor.ts";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const body = req.body as TutorRequest;
  try {
    const response = await createTutorResponse(body);
    res.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create tutor response";
    if (message.includes("OPENAI_API_KEY")) {
      return res.json(buildFallbackTutorResponse(body));
    }
    res.status(400).json({ error: message });
  }
}
