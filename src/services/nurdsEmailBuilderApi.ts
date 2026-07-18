const API_ORIGIN = (process.env.NURDS_API_ORIGIN || "https://api.sandbox.nurds.com").replace(/\/$/, "");
const CLIENT_ID = process.env.CLIENT_ID || "NURDS_STAGING";

let session: { token: string; expiresAt: number } | null = null;

async function getSessionToken(): Promise<string> {
  if (session && session.expiresAt > Date.now() + 30_000) return session.token;

  const response = await fetch(`${API_ORIGIN}/api/v1/public/email-builder/session`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ client_id: CLIENT_ID }),
  });
  if (!response.ok) throw new Error(`Unable to start email builder session (${response.status})`);
  const data = await response.json() as { access_token: string; expires_in: number };
  session = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return session.token;
}

async function authorizedFetch(path: string, init: RequestInit): Promise<Response> {
  const token = await getSessionToken();
  const headers = new Headers(init.headers);
  headers.set("authorization", `Bearer ${token}`);
  let response = await fetch(`${API_ORIGIN}${path}`, { ...init, headers });
  if (response.status === 401) {
    session = null;
    headers.set("authorization", `Bearer ${await getSessionToken()}`);
    response = await fetch(`${API_ORIGIN}${path}`, { ...init, headers });
  }
  return response;
}

export async function uploadEmailBuilderAsset(file: Blob): Promise<string> {
  const form = new FormData();
  form.append("file", file, file instanceof File ? file.name : "email-image.png");
  const response = await authorizedFetch("/api/v1/public/email-builder/assets", { method: "POST", body: form });
  if (!response.ok) throw new Error(`Image upload failed (${response.status})`);
  const data = await response.json() as { url: string };
  return data.url;
}

export async function generateEmailBuilderText(messages: unknown[]): Promise<{ content: string; role: string }> {
  const response = await authorizedFetch("/api/v1/public/email-builder/ai/generate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!response.ok) throw new Error(`AI generation failed (${response.status})`);
  return response.json();
}

export async function streamEmailBuilderAgent(request: {
  signal?: AbortSignal;
  message: string;
  images?: unknown[];
  template: unknown;
  history?: unknown;
  editorContext?: unknown;
  decisionResponse?: unknown;
}): Promise<Response> {
  return authorizedFetch("/api/v1/public/email-builder/ai/respond-stream", {
    method: "POST",
    headers: { "content-type": "application/json" },
    signal: request.signal,
    body: JSON.stringify({
      sessionId: "nurds-email-builder",
      prompt: { text: request.message },
      images: request.images || [],
      template: request.template,
      history: request.history || {},
      editorContext: request.editorContext || {},
      decisionResponse: request.decisionResponse,
    }),
  });
}
