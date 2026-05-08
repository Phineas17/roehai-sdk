import type { RoehAIErrorCode, RoehAIErrorResponse } from "./types.js";

export class RoehAIError extends Error {
  readonly code: RoehAIErrorCode;
  readonly status?: number;
  readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    code: RoehAIErrorCode,
    status?: number,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "RoehAIError";
    this.code = code;
    this.status = status;
    this.details = details;
  }

  static fromResponse(status: number, body: RoehAIErrorResponse): RoehAIError {
    const codeMap: Record<number, RoehAIErrorCode> = {
      401: "unauthorized",
      403: "forbidden",
      404: "not_found",
      422: "invalid_params",
      429: "rate_limited",
      500: "server_error",
    };
    const code = body.code ?? codeMap[status] ?? "server_error";
    return new RoehAIError(body.error, code, status, body.details);
  }
}
