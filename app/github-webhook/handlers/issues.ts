interface GitHubIssueEvent {
  action: string;
  issue: {
    title: string;
    html_url: string;
    body?: string;
    number: number;
  };
  repository: {
    name: string;
  };
}

export const handleIssueOpened = async (event: GitHubIssueEvent) => {
  // Verificar se é uma subissue (pode ser identificada pelo corpo ou título da issue)
  const isSubIssue =
    event.issue.body?.includes("Parent issue:") ||
    event.issue.title.toLowerCase().includes("sub:") ||
    event.issue.title.toLowerCase().includes("sub-issue:");

  const taskContent = isSubIssue
    ? `[${event.repository.name}] Sub-issue: ${event.issue.title}`
    : `[${event.repository.name}] ${event.issue.title}`;

  const labels = isSubIssue ? ["GitHub", "Sub-issue"] : ["GitHub"];

  const response = await fetch("https://api.todoist.com/rest/v2/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.TODOIST_API_KEY}`,
    },
    body: JSON.stringify({
      content: taskContent,
      description: `${event.issue.body || ""}\n\nLink: ${
        event.issue.html_url
      }\nIssue #${event.issue.number}`,
      labels: labels,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[Todoist] Falha ao criar task:", errorText);
    throw new Error("Falha ao criar task");
  }

  console.log("[Todoist] Task criada com sucesso");
};
