# Stock Manager

Inventory management PWA for small businesses.

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS 4, shadcn/ui
- **Backend:** Supabase (PostgreSQL, Auth, Realtime)
- **Hosting:** Cloudflare Pages
- **PWA:** vite-plugin-pwa

## Setup

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Create a Supabase project at [supabase.com](https://supabase.com) and copy the project URL and anon key.

3. Create `.env` from the example:
   ```bash
   cp .env.example .env
   ```
   Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

4. Apply database migrations:
   ```bash
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   ```

5. Start the dev server:
   ```bash
   npm run dev
   ```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run linter |

## Database Migrations

SQL migrations are in `supabase/migrations/`. Apply them to your Supabase project with:

```bash
npx supabase db push
```

## Deployment

Connect the GitHub repo to Cloudflare Pages:
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
