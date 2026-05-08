import { describe, it, expect, vi, beforeEach } from "vitest";
import { RoehAI, RoehAIError, WebhookRouter } from "../src/index.js";

// ─── Mock fetch ───────────────────────────────────────────────────────────────

const mockFetch = vi.fn();
global.fetch = mockFetch;

function mockSuccess(data: unknown) {
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(data),
  });
}

function mockError(status: number, body: unknown) {
  mockFetch.mockResolvedValueOnce({
    ok: false,
    status,
    json: () => Promise.resolve(body),
  });
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("RoehAI", () => {
  it("throws if apiKey is missing", () => {
    expect(() => new RoehAI({ apiKey: "" })).toThrow("apiKey is required");
  });

  it("instantiates with valid config", () => {
    const client = new RoehAI({ apiKey: "sk_test_123" });
    expect(client.aria).toBeDefined();
    expect(client.lea).toBeDefined();
  });
});

describe("aria.triggerCall", () => {
  beforeEach(() => mockFetch.mockReset());

  it("returns call result on success", async () => {
    const client = new RoehAI({ apiKey: "sk_test" });
    mockSuccess({
      success: true,
      call_id: "call_abc",
      status: "ringing",
      prospect: "+33612345678",
    });

    const result = await client.aria.triggerCall({ phone_number: "+33612345678" });
    expect(result.call_id).toBe("call_abc");
    expect(result.status).toBe("ringing");
  });

  it("throws RoehAIError on 401", async () => {
    const client = new RoehAI({ apiKey: "sk_invalid" });
    mockError(401, { error: "Unauthorized" });

    await expect(
      client.aria.triggerCall({ phone_number: "+33612345678" })
    ).rejects.toThrow(RoehAIError);
  });

  it("sends Authorization header", async () => {
    const client = new RoehAI({ apiKey: "sk_test_xyz" });
    mockSuccess({ success: true, call_id: "x", status: "ringing", prospect: "+1" });

    await client.aria.triggerCall({ phone_number: "+1" });
    const [, options] = mockFetch.mock.calls[0];
    expect(options.headers["Authorization"]).toBe("Bearer sk_test_xyz");
  });
});

describe("WebhookRouter", () => {
  it("dispatches events to registered handlers", async () => {
    const router = new WebhookRouter();
    const handler = vi.fn();

    router.on("call.completed", handler);

    await router.handle({
      event: "call.completed",
      call_data: {
        call_id: "c1",
        prospect_phone: "+1",
        duration: 60,
        transcript: "...",
        summary: "ok",
        extracted_data: {},
        timestamp: new Date().toISOString(),
      },
    });

    expect(handler).toHaveBeenCalledOnce();
  });

  it("ignores events with no registered handler", async () => {
    const router = new WebhookRouter();
    await expect(
      router.handle({
        event: "call.failed",
        call_data: {
          call_id: "c2",
          prospect_phone: "+1",
          reason: "busy",
          timestamp: new Date().toISOString(),
        },
      })
    ).resolves.toBeUndefined();
  });
});
