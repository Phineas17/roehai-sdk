import type { WebhookPayload, WebhookEventType } from "../types.js";

export type WebhookHandler<T extends WebhookPayload = WebhookPayload> = (
  payload: T
) => void | Promise<void>;

/**
 * Registre de handlers de webhooks RoehAI.
 * Utilisez-le côté serveur pour dispatcher les événements entrants.
 *
 * @example
 * const router = new WebhookRouter();
 * router.on("call.completed", async (payload) => {
 *   await updateCRM(payload.call_data);
 * });
 * // Dans Express :
 * app.post("/webhooks/roehai", (req, res) => {
 *   router.handle(req.body).then(() => res.sendStatus(200));
 * });
 */
export class WebhookRouter {
  private handlers = new Map<WebhookEventType, WebhookHandler[]>();

  on<T extends WebhookPayload>(
    event: T["event"],
    handler: WebhookHandler<T>
  ): this {
    const existing = this.handlers.get(event as WebhookEventType) ?? [];
    existing.push(handler as WebhookHandler);
    this.handlers.set(event as WebhookEventType, existing);
    return this;
  }

  async handle(payload: WebhookPayload): Promise<void> {
    const handlers = this.handlers.get(payload.event as WebhookEventType) ?? [];
    await Promise.all(handlers.map((h) => h(payload)));
  }
}

export { WebhookPayload, WebhookEventType };
