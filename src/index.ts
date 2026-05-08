import { AriaAgent } from "./agents/aria.js";
import { LeaAgent } from "./agents/lea.js";
import { DEFAULT_BASE_URL, DEFAULT_TIMEOUT } from "./http.js";
import type { RoehAIConfig } from "./types.js";

export { RoehAIError } from "./errors.js";
export { WebhookRouter } from "./webhooks/index.js";
export * from "./types.js";

/**
 * Client principal du SDK RoehAI.
 *
 * @example
 * import { RoehAI } from "@roehai/sdk";
 *
 * const client = new RoehAI({ apiKey: "sk_votre_cle" });
 *
 * // Déclencher un appel vocal IA
 * const call = await client.aria.triggerCall({
 *   phone_number: "+33612345678",
 *   contact_name: "Jean Dupont",
 *   context: "Prospect depuis le formulaire web",
 * });
 *
 * // Envoyer un WhatsApp
 * await client.lea.sendMessage({
 *   to: "+33612345678",
 *   message: "Bonjour Jean, Aria a essayé de vous appeler !",
 * });
 */
export class RoehAI {
  readonly aria: AriaAgent;
  readonly lea: LeaAgent;

  private readonly config: Required<RoehAIConfig>;

  constructor(config: RoehAIConfig) {
    if (!config.apiKey) {
      throw new Error("RoehAI SDK: apiKey is required");
    }
    this.config = {
      apiKey: config.apiKey,
      baseUrl: config.baseUrl ?? DEFAULT_BASE_URL,
      timeout: config.timeout ?? DEFAULT_TIMEOUT,
    };

    this.aria = new AriaAgent(
      this.config.baseUrl,
      this.config.apiKey,
      this.config.timeout
    );
    this.lea = new LeaAgent(
      this.config.baseUrl,
      this.config.apiKey,
      this.config.timeout
    );
  }
}
