# Glance

**Context-Aware AI That Sees What You Need**

> Built for the [Second Nature Hackathon](https://batch0.org/challenges/win-meta-ai-glasses-challenge-3-second-nature) — Meta AI Glasses Challenge

## The Problem

AI assistants require users to carefully craft prompts. They cannot see what you are looking at, cannot perceive the context of your current task, and cannot adapt to your situation in real-time. The gap between what a user intends and what software delivers remains wide.

## The Solution

Glance is a context-aware AI product that understands visual context from screenshots, photos, and camera captures. Users simply drop an image — no prompt required. Glance:

1. **Perceives** — Vision AI analyzes the full content of the image: error messages, code, spreadsheets, forms, documents, designs, and more
2. **Understands intent** — Infers what the user is trying to accomplish based on visual context alone
3. **Adapts** — Adjusts its response based on the detected context type, urgency, and complexity
4. **Takes the next step** — Provides specific, actionable suggestions rather than generic descriptions

## How It Works

```
User drops image → VLM analyzes visual context → Context classified → Intent inferred → Actionable suggestions generated
```

Glance detects 12+ context types: error messages, code/IDE, spreadsheets, forms, documents, design files, physical objects, screen captures, presentations, charts, email, and chat conversations.

## Tech Stack

- **Next.js 16** with App Router
- **Vision Language Model (VLM)** via z-ai-web-dev-sdk for image understanding
- **TypeScript** throughout
- **Tailwind CSS 4** + shadcn/ui for the interface

## Try It

```bash
npm install
npm run dev
```

Open `http://localhost:3000`, drop any image, and Glance tells you what you need.

## What Context Does Glance Understand?

Glance processes the raw visual content of any image:

- **Text in the image** — error messages, code, form fields, document text, chart labels
- **Visual structure** — layout, hierarchy, spatial relationships between elements
- **Visual indicators** — color-coded severity, icons, UI patterns, progress bars
- **Application context** — terminal windows, IDE interfaces, spreadsheet grids, email clients

From these signals, Glance infers the user's activity and provides domain-specific assistance.

## Privacy & Safety

- Images are processed in real-time and **never stored** on any server
- No user accounts, no history, no tracking
- The VLM processes only the image content — no metadata about the user is collected
- Users retain full control: they choose what to share, and can clear it instantly
- No custom hardware required — runs in any modern browser

## Real-World Use Case

**User:** A developer encounters a build error in their terminal. Instead of copying the error text, switching to ChatGPT, and typing a prompt, they simply screenshot the terminal and drop it into Glance.

**What Glance does:**
- Identifies the context as a build error (98% confidence)
- Detects the specific TypeError and file location (UserProfile.tsx:42)
- Infers the user wants to fix the build-breaking error
- Suggests: (1) check the data source initialization, (2) add optional chaining, (3) add console.log debugging

The entire interaction takes seconds, requires zero prompt crafting, and delivers specific, actionable help.

## Demo Video

See `assets/Glance_Demo.mp4` — a 90-second walkthrough of the error detection flow.

## User Feedback & Iteration

**Test user feedback:** "The suggestions are good but I want to know which one to try first."

**Improvement made:** Added urgency level (low/medium/high) to help users prioritize. High-urgency contexts like build errors now display a red urgency badge and sort the most critical suggestion first.

## License

MIT