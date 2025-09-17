# Dynamic Kanban Board (Vanilla JS)

A modular, dependency-free Kanban app with three columns (To Do, In Progress, Done). Tasks are persisted in `localStorage`, and you can drag and drop tasks between columns.

## Run

- Open `index.html` directly in a modern browser (Chrome, Edge, Safari, Firefox). No build step required.

## Features

- Create tasks via a form (title + optional description)
- Drag & drop tasks between columns
- Persist tasks across reloads using `localStorage`
- Modular code structure with reusable utilities
.j
## Structure

```
.
├── index.html            # App HTML and module bootstrap
├── styles.css            # App styling
├── src/
│   ├── app.js            # App bootstrap, state, wiring
│   ├── dnd/
│   │   └── index.js      # Drag & drop behavior
│   ├── events/
│   │   └── index.js      # DOM events: form submit, delete
│   ├── render/
│   │   ├── board.js      # Render columns and mount task cards
│   │   └── taskCard.js   # Create task card DOM
│   ├── storage/
│   │   └── index.js      # Storage wrapper over localStorage
│   └── utils/
│       ├── dom.js        # DOM helpers and event delegation
│       └── id.js         # ID generator utility
└── README.md
```

## Design Notes

- Separation of concerns:
  - Storage layer: `src/storage` handles persistence, immutable updates
  - Rendering layer: `src/render` creates DOM for tasks and columns
  - DnD layer: `src/dnd` encapsulates drag events and drop targets
  - Events layer: `src/events` binds form and delete actions
  - App wiring: `src/app.js` orchestrates state and re-renders
- Reusable utilities:
  - `utils/dom.js` (querying, creation, delegation)
  - `utils/id.js` (stable ID generator)
- Scalability: New columns or fields can be added by extending `TaskStatus`, updating column mapping and renderers. Storage and rendering are decoupled via plain objects.

## Browser Support

- Requires ES modules and `localStorage`. Tested with modern browsers.

## Future Extensions

- Edit tasks inline
- Reorder within a column
- Keyboard accessibility for drag & drop
- Filters and search
