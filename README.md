# Social Media Bill Tracker

Tracks US state and federal legislation related to social media regulation. Powers [bill-of-wrongs.com](https://bill-of-wrongs.com).

Built with [Hono](https://hono.dev) on [Cloudflare Workers](https://workers.cloudflare.com), using D1 (SQLite) for storage and KV for sessions. Server-rendered HTML, no frontend framework.

## Setup

```bash
npm install
```

Create the Cloudflare resources and update `wrangler.toml` with your IDs:

```bash
wrangler d1 create sm-bill-tracker
wrangler kv namespace create SESSIONS
wrangler r2 bucket create sm-bill-tracker-texts
```

Set up the local database:

```bash
npm run db:schema
npm run db:seed
```

Add your LegiScan API key to `.dev.vars`:

```
LEGISCAN_API_KEY=your_key_here
```

## Development

```bash
npm run dev      # local dev server
npm test         # run tests
npm run deploy   # deploy to Cloudflare Workers
```

## License

MIT
