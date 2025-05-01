import crypto from "crypto";

interface GitHubIssueEvent {
  action: string;
  issue: {
    title: string;
    html_url: string;
    body?: string;
  };
  repository: {
    name: string;
  };
}

// Utilitário para ler o corpo como buffer

async function buffer(readable: Request) {
  const chunks = [];

  const reader = readable.body?.getReader();
  if (!reader) return Buffer.from([]);

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const buf = await buffer(req);
  const sig = req.headers.get("x-hub-signature-256");

  const hmac = crypto.createHmac("sha256", process.env.GITHUB_WEBHOOK_SECRET!);
  const digest = "sha256=" + hmac.update(buf).digest("hex");

  if (sig !== digest) {
    return new Response(JSON.stringify({ error: "Assinatura inválida" }), {
      status: 401,
    });
  }

  const event: GitHubIssueEvent = JSON.parse(buf.toString());

  if (
    req.headers.get("x-github-event") === "issues" &&
    event.action === "opened"
  ) {
    try {
      const response = await fetch("https://api.todoist.com/rest/v2/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.TODOIST_API_KEY}`,
        },
        body: JSON.stringify({
          content: `[${event.repository.name}] ${event.issue.title}`,
          description: `${event.issue.body || ""}\n\nLink: ${
            event.issue.html_url
          }`,
          labels: ["GitHub"],
        }),
      });

      if (!response.ok) throw new Error("Falha ao criar task");

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
      });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: "Erro interno" }), {
        status: 500,
      });
    }
  }

  return new Response(null, { status: 200 });
}
