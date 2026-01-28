# Video Editor Challenge

A take-home challenge focused on a video editor: timeline, text overlays, clip reordering, and rendering. You’ll work across the frontend (Next.js) and backend (render server) and can go as far as you like through the levels below.

---

## What You’re Building

A simple video editor where users can arrange clips, add text, and render a video. The repo is a monorepo: a **Next.js app** (UI + tRPC) and a **render server** (Express). Right now the UI is in place and the render flow is stubbed; your job is to implement behavior and polish it through the levels. **All rendering must use Remotion** (the render server already includes a Remotion project; you define the composition and props).

---

## Current State vs Goal

**Current state:** The app has a video editor UI (clips, zoom, text overlay, text dock for animations, add/remove clips). The “Render” action and the render server are placeholders, no real API call or rendering yet. Text doesn’t snap to clips or drive the final render; clips can’t be reordered; only one text block exists.

**Goal:** Implement the render pipeline (backend + frontend), improve text behavior (e.g. dynamic position, snap to clips), add clip reordering and optional multi-text support, then clean up and test. How far you go depends on you, all levels are optional; do as many as you can.

---

## Levels (All Optional)

**Level 1 — Text & render**
- User should be able to have text behave well on the timeline
    - text ui component must snap to a clip's card start and end and can cover multiple clips at the same time (plays throughout multiple clips).
    - text must be draggable around.
    - must support timeline zoom feature
- User should be able to render the final video with the text component included on top of the clips in the center.

**Level 2 — Reorder clips**
- User should be able to reorder clips (single or multiple).
- User should see text position stay correct when clips are moved.
- Shouldn't break with zoom feature

**Level 3 — Multiple text**
- User should be able to add more than one text by clicking on the text timeline.
- User should not be able to have text components overlap.
- Shouldn't break with zoom feature

**Level 4 — Polish**
- Code should be clean and maintainable.
- The feature should have test coverage (E2E and/or unit tests).

**Level 5 — Improve UX**
- User should see clear feedback during long actions (e.g. render progress, loading states).
- User should understand what’s happening at each step (success/error messages, status).
- Consider other improvements (e.g. keyboard shortcuts, undo/redo, accessibility, clearer empty states, tooltips).
- Be creative, surprise us with UX ideas that make the editor feel better to use.

You can stop at any level. Going further is encouraged but not required.

---

## How to Run the Project

1. **Install (from repo root)**  
   `pnpm install`

2. **Env (if you need it)**  
   Copy the example env files where you run the app:
   - `apps/app/.env.example` → `apps/app/.env`
   - `apps/render/.env.example` → `apps/render/.env`  
   
3. **Start everything (from repo root)**  
   `pnpm run dev`  
   This runs the Next.js app and the render server (e.g. app on port 3000, render server on 3001).

---

## Project Layout (High Level)

- **`apps/app`** — Next.js app: video editor page, components (clips, text overlay, text dock, magnifier), tRPC API (e.g. text templates). This is where you’ll wire the “Render” button and any new UI.
- **`apps/render`** — Express render server and Remotion project. All video rendering must be done with Remotion. You’ll add the render API and job/queue logic here, and implement the Remotion composition (props, clips, text, etc.). You can store output under `apps/render/renders` (that folder is in `.gitignore`).

No need to change tooling or repo structure unless you want to; focus on implementation and UX where it helps.

---

## Submission

1. **Fork** this repo and do all your work in your fork.
2. **Implement** as many levels as you can (and any extra UX you like).
3. **Record a short video** of you using your final version (screen only is fine; voice or camera is optional but welcome, especially if you changed the UX).
4. **Send** the fork link and the video (link or attachment) **by email** by the deadline.

**Deadline:** Monday 2nd February, 12:00 AM Morocco time.

---

## Notes

- **Rendering must use Remotion**, no other render pipeline or export method for the final video.
- You’re welcome to store render output under `apps/render/renders` (already in `.gitignore`).
- Feel free to improve the UX in any way that fits the challenge.

Good luck.
