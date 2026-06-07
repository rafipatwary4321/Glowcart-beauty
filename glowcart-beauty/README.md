# GlowCart Beauty

Premium cosmetic e-commerce frontend built with Next.js, TypeScript, Tailwind CSS, and ShadCN UI.

## Project location

Run all commands from this folder:

```text
C:\Cursor\cosmetic shop\glowcart-beauty
```

## Getting started

Install dependencies (first time only):

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Production build:

```bash
npm run build
npm start
```

## Stop an old dev server

If port 3000 is already in use or you see the default Next.js starter page:

1. Stop the terminal running `npm run dev` with `Ctrl + C`
2. Or force-stop all Node processes:

```powershell
taskkill /F /IM node.exe
```

3. Restart from the correct folder:

```powershell
cd "C:\Cursor\cosmetic shop\glowcart-beauty"
npm run dev
```

## Homepage sections

- Announcement bar
- Navbar
- Hero banner
- Featured categories
- Top brands
- Trending products
- Skin concerns
- Promotional banner
- Newsletter
- Footer

## Commit changes

```powershell
cd "C:\Cursor\cosmetic shop\glowcart-beauty"
git add .
git status
git commit -m "Your commit message here"
```

Example:

```powershell
git commit -m "Fix homepage layout and sync GlowCart Beauty frontend"
```

## Tech stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- ShadCN UI
- Dummy data (no backend yet)
