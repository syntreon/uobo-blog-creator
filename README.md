# webscrapper-2

## Uobo Blog Creator

I built a simple tool to help me create blog posts faster. I can either:

- Analyze a competitor’s blog post and generate my own draft from it.
- Start a brand new blog from a topic and optional research.
- (Beta) Scrape a URL’s first page content for quick reference.

The app runs as a web UI with three tabs: Create Blog from Competitor, Create New Blog, and Scrape Blog URL.

## Features

- Create a blog draft from competitor content.
- Create a new blog from scratch with optional research.
- Render results in Markdown with copy support.
- Light/Dark theme toggle.

## Tech Stack

- Next.js 15, React 19
- Tailwind CSS 4
- Radix UI components

## Environment Variables

Create a `.env.local` (or `.env`) file and set:

- NEXT_PUBLIC_WEBHOOK_URL: Endpoint to process URL scraping requests.
- NEXT_PUBLIC_BLOG_SUBMIT_WEBHOOK_URL: Endpoint to process competitor-based blog generation.
- NEXT_PUBLIC_NEW_BLOG_URL: Endpoint to process new blog creation requests.

These endpoints should accept POST JSON payloads and return Markdown in `markdown` or plain text.

## Getting Started

1. Install dependencies
   - pnpm install
   - or npm install
2. Run the dev server
   - pnpm dev
   - or npm run dev
3. Open http://localhost:3000 or whatever port you set

## Usage

- Create Blog from Competitor: Paste a topic and the full competitor blog content, then generate a draft.
- Create New Blog: Enter a topic, optional details, and choose whether to run research before generating.
- Scrape Blog URL (Beta): Enter a URL; the tool sends it to the webhook and shows the first-page content.

## Project Structure

- app/page.tsx: Main UI with tabs and results rendering.
- components/forms/: Form components for each feature.
- components/MarkdownViewer.tsx: Renders markdown results.
- components/BlogOutput.tsx: Displays generated content with actions.
- lib/request.ts: Centralized request logic and timeouts to the configured webhooks.

## Scripts

- dev: Start the development server
- build: Build the production bundle
- start: Start the production server
- lint: Run Next.js lint

## Deployment

Deploy anywhere that supports Next.js apps. Set the three environment variables in your hosting provider.