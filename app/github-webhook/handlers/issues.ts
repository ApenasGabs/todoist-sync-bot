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

export const handleIssueOpened = async (event: GitHubIssueEvent) => {
  const response = await fetch("https://api.todoist.com/rest/v2/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.TODOIST_API_KEY}`,
    },
    body: JSON.stringify({
      content: `[${event.repository.name}] ${event.issue.title}`,
      description: `${event.issue.body || ""}\n\nLink: ${event.issue.html_url}`,
      labels: ["GitHub"],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[Todoist] Falha ao criar task:", errorText);
    throw new Error("Falha ao criar task");
  }

  console.log("[Todoist] Task criada com sucesso");
}
