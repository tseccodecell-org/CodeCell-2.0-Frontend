import { vi } from "vitest";

export function mockJson(body: unknown, init: { status?: number } = {}) {
  const status = init.status ?? 200;

  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? "OK" : "Error",
    text: async () => (body === undefined ? "" : JSON.stringify(body)),
  } as Response;
}

export function mockFetchOnce(body: unknown, init: { status?: number } = {}) {
  const fetchMock = globalThis.fetch as ReturnType<typeof vi.fn>;
  fetchMock.mockResolvedValueOnce(mockJson(body, init));
  return fetchMock;
}

export function lastFetchCall() {
  const fetchMock = globalThis.fetch as ReturnType<typeof vi.fn>;
  return fetchMock.mock.calls.at(-1) as [string, RequestInit];
}

export function envelope(data: unknown) {
  return { success: true, data };
}
