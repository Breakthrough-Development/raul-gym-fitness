This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Access from other devices on the same network

If your phone/tablet/another laptop is on the same Wi‑Fi, you can open the dev server from that device using your Mac's LAN IP.

1. Start the dev server (already bound to all interfaces):

   ```bash
   npm run dev
   ```

   In the terminal you should see something like: `ready - started server on 0.0.0.0:3000`.

2. Find your Mac's LAN IP (one of these commands should work on macOS):

   ```bash
   ipconfig getifaddr en0 || ipconfig getifaddr en1
   # or auto-detect the active interface
   ipconfig getifaddr $(route get default 2>/dev/null | awk '/interface:/{print $2}')
   ```

3. On the other device, open the URL using the IP and port:

   - `http://<YOUR_LAN_IP>:3000` (example: `http://192.168.1.35:3000`)

   Optional on Apple devices (Bonjour/mDNS):

   ```bash
   scutil --get LocalHostName
   ```

   Then open `http://<that-name>.local:3000` (example: `http://royer-adames.local:3000`). If the `.local` name does not resolve, use the IP URL instead.

### Troubleshooting

- Ensure both devices are on the same Wi‑Fi (not a guest/isolated network).
- If the page doesn’t load via the hostname but works via IP, it’s a DNS/mDNS issue on the client; keep using the IP.
- If 3000 is busy, Next.js may move to another port (e.g., 3001). Use the port shown in the terminal output.
- Allow incoming connections for Node/Next in macOS Firewall (System Settings → Network → Firewall → Options).
- To keep the IP stable, create a DHCP reservation on your router for your Mac’s Wi‑Fi MAC address:

  ```bash
  networksetup -getmacaddress Wi-Fi
  ```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Conventions

- Centralize routes: see `documentation/path-constants.md`
- Use Next.js `Link` with path utilities: see `documentation/link-components.md`
- Use `clsx` for conditional styling: see `documentation/file base routing/conditional-styling.md`
- Styling SVGs: see `documentation/file base routing/styling-svgs.md`
- UI library setup (shadcn UI, `cn` util): see `documentation/ui-library/ui-library-setup.md`
- UI components: see `documentation/ui-library/ui-library-button.md`
- UI components: see `documentation/ui-library/ui-library-separator.md`
- Icons guide: see `documentation/ui-library/ui-library-icons.md`
- Theming: see `documentation/ui-library/ui-library-theming.md`
- Components: see `documentation/component-folder/component-folder-heading.md`
- Components: see `documentation/component-folder/component-folder-header.md`
- Components: see `documentation/component-folder/component-folder-placeholder.md`
- Feature architecture: see `documentation/feature-folder/feature-folder-intro.md`
- Feature extraction: see `documentation/feature-folder/feature-folder-extract.md`
- Feature reuse: see `documentation/feature-folder/feature-folder-reuse.md`

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## WhatsApp Membership Reminders

1. Environment variables (set in Vercel project):

   - `WHATSAPP_PHONE_NUMBER_ID`
   - `WHATSAPP_ACCESS_TOKEN`
   - `WHATSAPP_TEMPLATE_PRE` (variables: [firstName, monthName])
   - `WHATSAPP_TEMPLATE_POST` (variables: [firstName, prevMonthName])
   - `CRON_SECRET`
   - `TIMEZONE` (e.g., `America/New_York`)
   - `WHATSAPP_MAX_PER_RUN` (optional, default 500)

2. Vercel Cron:

   - Create a daily job to GET `/api/cron/whatsapp` and add header `x-cron-secret: <CRON_SECRET>`
   - The route only acts on EOM-3 (pre) and day 3 (post), else returns no-op

3. Templates:

   - Create/approve two templates in WhatsApp Cloud:
     - PRE: name in `WHATSAPP_TEMPLATE_PRE`; body variables: first name, month name
     - POST: name in `WHATSAPP_TEMPLATE_POST`; body variables: first name, previous month name

4. Testing locally:

   - `GET /api/cron/whatsapp?dryRun=1` with header `x-cron-secret`
   - Remove `dryRun` only on the valid cohort dates
