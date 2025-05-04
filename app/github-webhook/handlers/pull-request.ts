interface GitHubPullRequestEvent {
  action: string;
  pull_request: {
    title: string;
    html_url: string;
    body?: string;
  };
  repository: {
    name: string;
  };
}

export const handlePullRequestOpened = async (
  event: GitHubPullRequestEvent
) => {
  const response = await fetch("https://api.todoist.com/rest/v2/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.TODOIST_API_KEY}`,
    },
    body: JSON.stringify({
      content: `[${event.repository.name}] PR: ${event.pull_request.title}`,
      description: `${event.pull_request.body || ""}\n\nLink: ${
        event.pull_request.html_url
      }`,
      labels: ["GitHub", "Pull Request"],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[Todoist] Falha ao criar task para PR:", errorText);
    throw new Error("Falha ao criar task para PR");
  }

  console.log("[Todoist] Task para Pull Request criada com sucesso");
};
