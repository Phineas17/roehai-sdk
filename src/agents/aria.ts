import { request } from "../http.js";
import type {
  TriggerCallParams,
  TriggerCallResult,
  CallStatus,
  CallListParams,
  CallListResult,
  IngestLeadParams,
  IngestLeadResult,
} from "../types.js";

export class AriaAgent {
  constructor(
    private readonly baseUrl: string,
    private readonly apiKey: string,
    private readonly timeout: number
  ) {}

  /**
   * Déclenche un appel sortant IA vers un numéro de téléphone.
   * L'agent Aria appelle le numéro et conduit la conversation selon votre configuration.
   */
  async triggerCall(params: TriggerCallParams): Promise<TriggerCallResult> {
    return request<TriggerCallResult>(
      this.baseUrl,
      this.apiKey,
      "trigger-outbound-call",
      params,
      this.timeout
    );
  }

  /**
   * Récupère le statut et les données d'un appel par son ID.
   */
  async getCallStatus(callId: string): Promise<CallStatus> {
    return request<CallStatus>(
      this.baseUrl,
      this.apiKey,
      "trigger-outbound-call",
      { action: "get_call_status", call_id: callId },
      this.timeout
    );
  }

  /**
   * Liste les appels récents avec filtres optionnels.
   */
  async listCalls(params: CallListParams = {}): Promise<CallListResult> {
    return request<CallListResult>(
      this.baseUrl,
      this.apiKey,
      "trigger-outbound-call",
      { action: "list_calls", ...params },
      this.timeout
    );
  }

  /**
   * Ajoute un prospect à la file d'appels automatique.
   * L'agent Aria l'appellera selon la disponibilité.
   */
  async ingestLead(params: IngestLeadParams): Promise<IngestLeadResult> {
    return request<IngestLeadResult>(
      this.baseUrl,
      this.apiKey,
      "ingest-lead",
      params,
      this.timeout
    );
  }
}
