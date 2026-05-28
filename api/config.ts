import { getServerEnvStatus } from "../src/server/env.ts";

export default function handler(req: any, res: any) {
  res.json(getServerEnvStatus());
}
