// ─── Configuration ────────────────────────────────────────────────────────────

export interface RoehAIConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

// ─── Aria — Agent Vocal ───────────────────────────────────────────────────────

export interface TriggerCallParams {
  phone_number: string;
  business_name?: string;
  contact_name?: string;
  pain_point?: string;
  context?: string;
  from_number?: string;
  agent_user_id?: string;
}

export interface TriggerCallResult {
  success: boolean;
  call_id: string;
  status: "ringing" | "in-progress" | "completed" | "failed";
  prospect: string;
}

export interface CallStatus {
  call_id: string;
  status: "ringing" | "in-progress" | "completed" | "failed";
  duration?: number;
  transcript?: string;
  summary?: string;
  extracted_data?: Record<string, string>;
}

export interface CallListParams {
  limit?: number;
  offset?: number;
  status?: "completed" | "failed" | "in-progress";
}

export interface CallListResult {
  calls: CallStatus[];
  total: number;
}

// ─── Lead Ingestion ───────────────────────────────────────────────────────────

export interface IngestLeadParams {
  business_name: string;
  phone_number: string;
  city?: string;
  pain_point?: string;
  source?: string;
}

export interface IngestLeadResult {
  success: boolean;
  lead_id: string;
  status: "queued" | "duplicate" | "invalid";
  message?: string;
}

// ─── Léa — Agent WhatsApp ─────────────────────────────────────────────────────

export interface SendWhatsAppParams {
  to: string;
  message: string;
  conversation_id?: string;
}

export interface SendWhatsAppResult {
  success: boolean;
  message_id: string;
  status: "sent" | "delivered" | "failed";
}

export interface WhatsAppConversation {
  id: string;
  phone_number: string;
  status: "active" | "closed";
  last_message?: string;
  last_message_at?: string;
}

// ─── API Keys ─────────────────────────────────────────────────────────────────

export interface CreateApiKeyParams {
  name: string;
  permissions?: string[];
}

export interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  permissions: string[];
  created_at: string;
  last_used_at?: string;
}

export interface CreateApiKeyResult {
  api_key: string;
  key_info: ApiKey;
}

// ─── Webhooks — Types d'événements ────────────────────────────────────────────

export type WebhookEventType =
  | "call.completed"
  | "call.failed"
  | "call.started"
  | "lead.qualified"
  | "lead.ingested"
  | "whatsapp.message_received"
  | "whatsapp.message_sent";

export interface WebhookCallCompletedPayload {
  event: "call.completed";
  call_data: {
    call_id: string;
    prospect_phone: string;
    duration: number;
    transcript: string;
    summary: string;
    extracted_data: {
      qualification_level?: "Chaud" | "Tiède" | "Froid";
      budget?: string;
      objection?: string;
      next_step?: string;
      [key: string]: string | undefined;
    };
    agent_id?: string;
    timestamp: string;
  };
}

export interface WebhookCallFailedPayload {
  event: "call.failed";
  call_data: {
    call_id: string;
    prospect_phone: string;
    reason: "no-answer" | "busy" | "invalid-number" | "error";
    timestamp: string;
  };
}

export interface WebhookCallStartedPayload {
  event: "call.started";
  call_data: {
    call_id: string;
    prospect_phone: string;
    timestamp: string;
  };
}

export interface WebhookLeadQualifiedPayload {
  event: "lead.qualified";
  lead_data: {
    lead_id: string;
    business_name: string;
    phone_number: string;
    qualification_level: "Chaud" | "Tiède" | "Froid";
    summary: string;
    timestamp: string;
  };
}

export interface WebhookWhatsAppMessagePayload {
  event: "whatsapp.message_received";
  message_data: {
    from: string;
    message: string;
    conversation_id: string;
    timestamp: string;
  };
}

export type WebhookPayload =
  | WebhookCallCompletedPayload
  | WebhookCallFailedPayload
  | WebhookCallStartedPayload
  | WebhookLeadQualifiedPayload
  | WebhookWhatsAppMessagePayload;

// ─── Erreurs ──────────────────────────────────────────────────────────────────

export type RoehAIErrorCode =
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "rate_limited"
  | "invalid_params"
  | "server_error"
  | "network_error"
  | "timeout";

export interface RoehAIErrorResponse {
  error: string;
  code?: RoehAIErrorCode;
  details?: Record<string, unknown>;
}
