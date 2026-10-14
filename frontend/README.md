This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Concertix surfaces

- `/` — luxury landing page with live event and artist catalog
- `/home` — authenticated customer home with profile, orders, and event recommendations
- `/splash` — dedicated splash experience; the app also shows a one-time splash on first visit
- `/login`, `/register`, `/forgot-password`, `/reset-password` — connected auth flows
- `/checkout` → `/payments/:orderId` — customer order reservation, payment proof upload, and expiry-aware payment status
- `/orders` and `/tickets` — customer order history and issued e-tickets
- `/admin` — sales dashboard, online payment verification, and offline box-office sales

The frontend reads the REST API through `NEXT_PUBLIC_API_URL` (see `.env.example`). Keep the backend running on port `5000` for local uploads and catalog data.

The public artist catalog also exposes `GET /api/artists/popular?limit=6` for curated popular Indonesian artists.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

The visual system uses the CSS font tokens and editorial display styles defined in `src/app/globals.css`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
