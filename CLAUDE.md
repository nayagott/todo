# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install        # install dependencies
npm run dev        # start dev server (http://localhost:5173)
npm run build      # type-check + production build
npm run preview    # preview production build
```

## Architecture

React + TypeScript + Vite SPA. No backend — data persists in `localStorage`.

```
src/
  hooks/useTodos.ts       # all state logic + localStorage persistence
  components/
    TodoInput.tsx          # new-todo input + toggle-all button
    TodoItem.tsx           # single item: checkbox, label, inline edit, delete
    Footer.tsx             # filter tabs, item count, clear-completed
  App.tsx                  # composes the above; derives empty-state message
  types.ts                 # Todo interface, Filter type
  index.css                # single global stylesheet (no CSS modules)
```

**State flow**: `useTodos` owns all state and exposes handlers. `App` threads them down as props — no context or external state library.

**Inline editing**: double-click a label → `TodoItem` enters local edit mode. `Enter` commits, `Esc` cancels, blur commits. Saving empty text deletes the item.
