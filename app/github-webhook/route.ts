import { NextRequest } from "next/server";
import { handleIssueOpened } from "./handlers/issues";
import { handlePullRequestOpened } from "./handlers/pull-request";
import { verifySignature } from "./utils/verify-signature";

async function buffer(req: Request): Promise<Buffer> {
  const reader = req.body?.getReader();
  const chunks = [];

  if (!reader) return Buffer.from([]);

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get("x-hub-signature-256");
  const eventName = req.headers.get("x-github-event") || "";
  const buf = await buffer(req);

  console.log("[Webhook] Evento recebido:", eventName);

  if (!verifySignature(buf, sig)) {
    console.warn("[Webhook] Assinatura inválida");
    return new Response(JSON.stringify({ error: "Assinatura inválida" }), {
      status: 401,
    });
  }

  const event = JSON.parse(buf.toString());
  console.log("[Webhook] Payload:", JSON.stringify(event, null, 2));

  try {
    switch (eventName) {
      case "issues":
        if (event.action === "opened") {
          console.log("[Webhook] Issue criada:", event.issue.title);
          await handleIssueOpened(event);
        } else {
          console.log("[Webhook] Ação de issue ignorada:", event.action);
        }
        break;

      case "pull_request":
        if (event.action === "opened") {
          console.log(
            "[Webhook] Pull Request criado:",
            event.pull_request.title
          );
          await handlePullRequestOpened(event);
        } else {
          console.log("[Webhook] Ação de pull request ignorada:", event.action);
        }
        break;

      default:
        console.log("[Webhook] Evento não tratado:", eventName);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (err) {
    console.error("[Webhook] Erro ao processar evento:", err);
    return new Response(JSON.stringify({ error: "Erro interno" }), {
      status: 500,
    });
  }
}
