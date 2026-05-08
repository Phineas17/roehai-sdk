import { RoehAIError } from "./errors.js";
import type { RoehAIErrorResponse } from "./types.js";

export const DEFAULT_BASE_URL = "https://www.roehai.com/api/v1";
export const DEFAULT_TIMEOUT = 30_000;

export async function request<T>(
  baseUrl: string,
  apiKey: string,
  path: string,
  body: unknown,
  timeout: number = DEFAULT_TIMEOUT
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  let response: Response;
  try {
    response = await fetch(`${baseUrl}/${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "x-roehai-sdk": "js/1.0.0",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") {
      throw new RoehAIError("Request timed out", "timeout");
    }
    throw new RoehAIError(
      `Network error: ${(err as Error).message}`,
      "network_error"
    );
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    let errorBody: RoehAIErrorResponse;
    try {
      errorBody = await response.json();
    } catch {
      errorBody = { error: `HTTP ${response.status}` };
    }
    throw RoehAIError.fromResponse(response.status, errorBody);
  }

  return response.json() as Promise<T>;
}
