import { request } from "../http.js";
import type {
  SendWhatsAppParams,
  SendWhatsAppResult,
  WhatsAppConversation,
} from "../types.js";

export class LeaAgent {
  constructor(
    private readonly baseUrl: string,
    private readonly apiKey: string,
    private readonly timeout: number
  ) {}

  /**
   * Envoie un message WhatsApp proactif via l'agent Léa.
   */
  async sendMessage(params: SendWhatsAppParams): Promise<SendWhatsAppResult> {
    return request<SendWhatsAppResult>(
      this.baseUrl,
      this.apiKey,
      "lea-whatsapp-send",
      params,
      this.timeout
    );
  }

  /**
   * Liste les conversations WhatsApp actives gérées par Léa.
   */
  async listConversations(params: {
    limit?: number;
    status?: "active" | "closed";
  } = {}): Promise<WhatsAppConversation[]> {
    return request<WhatsAppConversation[]>(
      this.baseUrl,
      this.apiKey,
      "lea-whatsapp-send",
      { action: "list_conversations", ...params },
      this.timeout
    );
  }
}
