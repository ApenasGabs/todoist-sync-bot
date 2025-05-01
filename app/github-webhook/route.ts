import { NextRequest } from "next/server";
import { handleIssueOpened } from "./handlers/issues";
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

  if (!verifySignature(buf, sig)) {
    return new Response(JSON.stringify({ error: "Assinatura inválida" }), {
      status: 401,
    });
  }

  const event = JSON.parse(buf.toString());

  try {
    switch (eventName) {
      case "issues":
        if (event.action === "opened") {
          await handleIssueOpened(event);
        }
        break;

      // Futuro: outros eventos
      // case "pull_request":
      //   if (event.action === "opened") await handlePullRequestOpened(event);
      //   break;

      default:
        console.log("Evento ignorado:", eventName);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Erro interno" }), {
      status: 500,
    });
  }
}
