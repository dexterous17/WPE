import { existsSync, readFileSync } from "fs";

/**
 * Same data as AiAssistantService::getPersonas() (config/ai_personas.json).
 * @param {string} jsonPath
 */
export function loadPersonas(jsonPath) {
  if (!jsonPath || !existsSync(jsonPath)) {
    return {};
  }
  const raw = readFileSync(jsonPath, "utf8");
  const data = JSON.parse(raw);
  return data.personas && typeof data.personas === "object"
    ? data.personas
    : {};
}
