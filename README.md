# HSC Helper

A simple NSW Year 11 and 12 assignment helper for HSC students.

## What It Includes

- Assignment Studio workflow
- HSC Chat
- NSW Stage 6 assignment helper
- Official NESA past paper links
- AI tools directory
- Tasks, focus timer and goal tracking

## Run Locally

```powershell
& 'C:\Users\tomji\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' server.mjs
```

Then open:

```text
http://127.0.0.1:4174/
```

## Enable ChatGPT Answers

HSC Chat can call the OpenAI API when an API key is set on the server.

```powershell
$env:OPENAI_API_KEY="your_api_key_here"
& 'C:\Users\tomji\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' server.mjs
```

Optional model override:

```powershell
$env:OPENAI_MODEL="gpt-4o-mini"
```

Do not put your API key into `index.html` or `app.js`.

## Enable ChatGPT On Netlify

This project includes a Netlify Function at:

```text
netlify/functions/chat.js
```

The website sends chat questions to `/api/chat`, and `netlify.toml` redirects that to the Netlify Function.

After deploying on Netlify:

1. Open your Netlify site dashboard.
2. Go to Site configuration > Environment variables.
3. Add:
   `OPENAI_API_KEY`
4. Paste your OpenAI API key as the value.
5. Redeploy the site.

Optional:

```text
OPENAI_MODEL=gpt-4o-mini
```

The chat will work only after the environment variable is added and the site is redeployed.

Important: ChatGPT needs the Netlify Function to deploy. If drag-and-drop only publishes the static page for your account, connect the folder to GitHub and deploy from the Git repository, or deploy with Netlify CLI. Static-only hosting cannot keep the OpenAI API key secret.

## Make It Public

### Option 1: Netlify Drop

1. Go to https://app.netlify.com/drop
2. Drag this project folder into the page:
   `C:\Users\tomji\Documents\Codex\2026-05-16\build-me-a-futuristic-ai-productivity`
3. Netlify will give you a public URL.
4. Add `OPENAI_API_KEY` in Netlify environment variables, then redeploy to activate ChatGPT.

### Option 2: Vercel

1. Go to https://vercel.com/new
2. Import this folder/project.
3. Keep the default static settings.
4. Deploy.

### Option 3: GitHub Pages

1. Create a GitHub repository.
2. Upload `index.html`, `styles.css`, `app.js`, `server.mjs`, `README.md`, and `netlify.toml`.
3. In GitHub, go to Settings > Pages.
4. Set the source to the main branch root.
5. GitHub will create a public URL.
