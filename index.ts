// Bun auto-loads .env — set OPENAI_API_KEY for AI quiz planning.
import index from "./index.html";
import { getServerEnvStatus, logServerEnvWarnings } from "./src/server/env.ts";
import { createQuizPlan, type QuizPlanRequest } from "./src/server/quizPlanner.ts";
import {
  buildFallbackPracticeQuiz,
  createPracticeQuiz,
  shouldUsePracticeFallback,
  type PracticeQuizRequest,
} from "./src/server/practiceQuizGenerator.ts";
import {
  buildFallbackTutorResponse,
  createTutorResponse,
  shouldUseTutorFallback,
  type TutorRequest,
} from "./src/server/quizTutor.ts";

const server = Bun.serve({
  routes: {
    "/": index,
    "/auth": index,
    "/stats": index,
    "/quiz/*": index,
    "/api/config": {
      GET() {
        return Response.json(getServerEnvStatus());
      },
    },
    "/api/quiz-plan": {
      async POST(req) {
        try {
          const body = (await req.json()) as QuizPlanRequest;
          const plan = await createQuizPlan(body);
          return Response.json(plan);
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to create quiz plan";
          const status = message.includes("OPENAI_API_KEY") ? 503 : 400;
          return Response.json({ error: message }, { status });
        }
      },
    },
    "/api/practice-quiz": {
      async POST(req) {
        const body = (await req.json()) as PracticeQuizRequest;

        try {
          const quiz = await createPracticeQuiz(body);
          return Response.json(quiz);
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to create practice quiz";
          if (shouldUsePracticeFallback(message)) {
            return Response.json(buildFallbackPracticeQuiz(body));
          }
          return Response.json({ error: message }, { status: 400 });
        }
      },
    },
    "/api/quiz-tutor": {
      async POST(req) {
        const body = (await req.json()) as TutorRequest;

        try {
          const response = await createTutorResponse(body);
          return Response.json(response);
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to create tutor response";
          if (shouldUseTutorFallback(message)) {
            return Response.json(buildFallbackTutorResponse(body));
          }
          return Response.json({ error: message }, { status: 400 });
        }
      },
    },
  },
  development: {
    hmr: true,
    console: true,
  },
});

logServerEnvWarnings();
console.log(`ACCTG 102 Exam Prep running at http://localhost:${server.port}`);
