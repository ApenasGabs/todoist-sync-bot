# 🧩 todoist-sync-bot

[![Deploy on Vercel](https://vercelbadge.vercel.app/api/ApenasGabs/todoist-sync-bot)](https://todoist-sync-bot.vercel.app)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Issues](https://img.shields.io/github/issues/ApenasGabs/todoist-sync-bot)](https://github.com/ApenasGabs/todoist-sync-bot/issues)
[![Stars](https://img.shields.io/github/stars/ApenasGabs/todoist-sync-bot?style=social)](https://github.com/ApenasGabs/todoist-sync-bot)
[![Forks](https://img.shields.io/github/forks/ApenasGabs/todoist-sync-bot?style=social)](https://github.com/ApenasGabs/todoist-sync-bot/fork)
[![GitHub](https://img.shields.io/github/license/ApenasGabs/todoist-sync-bot)](LICENSE)
[![LivePix - Apoie este projeto](https://img.shields.io/badge/💖%20Apoie-via%20LivePix-ff69b4?style=flat-square)](https://livepix.gg/apenasgabs)

## 📝 Descrição

Crie tarefas automaticamente no [Todoist](https://todoist.com) a partir de issues abertas em repositórios GitHub – simples, rápido e gratuito. Ideal para quem quer integrar planejamento pessoal com fluxo de desenvolvimento.

## ✨ O que ele faz?

Quando uma issue é aberta em um repositório GitHub conectado, o bot cria automaticamente uma tarefa no seu Todoist com:

- O título da issue (como nome da tarefa)
- O corpo da issue (como descrição da tarefa)
- Um link direto para a issue
- Uma label `GitHub` para organização
  
## ⚙️ Como usar sem fazer deploy (usando o GitHub App)

Você pode usar essa integração **sem clonar nada ou fazer deploy manual**. Basta:

1. **Instalar o GitHub App**:

   👉 [Clique aqui para instalar o todoist-sync-bot](https://github.com/apps/todoist-sync-bot/installations/new)

2. **Configurar sua chave do Todoist**:

   Após instalar, o app tentará enviar as tarefas para o seu Todoist. Para isso funcionar, você precisa fornecer sua chave de API do Todoist.

   Hoje, como a versão pública não possui interface de configuração, você pode:
   - Fazer seu próprio deploy (veja abaixo) com sua própria `TODOIST_API_KEY`
   - Ou abrir uma [issue](https://github.com/ApenasGabs/todoist-sync-bot/issues/new) com sugestões sobre como quer autenticar sua conta Todoist

## 🚀 Deploy rápido com Vercel

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/ApenasGabs/todoist-sync-bot.git
   cd todoist-sync-bot
   ```

2. **Configure as variáveis de ambiente:**

   Na Vercel ou localmente (`.env.local`):

   ```
   GITHUB_WEBHOOK_SECRET=uma-senha-secreta
   TODOIST_API_KEY=sua-chave-do-todoist
   ```

   - [Consiga sua chave de API do Todoist aqui](https://developer.todoist.com/rest/v2/#authentication).

3. **Crie um webhook no GitHub:**

   No repositório que deseja integrar:
   - Vá em **Settings > Webhooks**
   - URL: `https://seu-projeto.vercel.app/github-webhook`
   - Content type: `application/json`
   - Secret: a mesma que está em `GITHUB_WEBHOOK_SECRET`
   - Evento: selecione **Issues** (ou “Let me select individual events” e marque “Issues”)

4. **Pronto!** Sempre que uma issue for aberta, uma task será criada no seu Todoist 🎯

## 🛠 Tecnologias usadas

- [Next.js 14](https://nextjs.org/)
- API Routes com `app/` directory (v3 routing)
- TypeScript
- Deploy na [Vercel](https://vercel.com/)
- Integração com [Todoist REST API v2](https://developer.todoist.com/rest/v2/)

## 🤝 Contribuição

Este projeto é open-source e gratuito para todos. Se quiser sugerir melhorias ou corrigir algo, fique à vontade para abrir uma issue ou um PR.

## 📄 Licença

MIT — use como quiser 🙌

---

Feito com 💛 por [@ApenasGabs](https://github.com/ApenasGabs)
