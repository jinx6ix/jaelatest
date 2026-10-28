# JaeTravel (Payload CMS): read this first, every session
1. Read docs/build/BUILD_STATE.md, then the rows of docs/build/04-DESIGN-MATRIX.md for the current phase.
2. Rules and protocol: docs/build/00-OPERATING-RULES.md. Architecture: 02. SEO: 03. Data and services: 01.
3. The designs in /design are the target. Match section order, content and behaviour.
4. Never hardcode content, colours, URLs or visible strings. Everything is Payload data.
5. Return only new and changed files. Never claim you ran something you did not run.
6. Payload skill: .claude/skills/payload/ (if present).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
