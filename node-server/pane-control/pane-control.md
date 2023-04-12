# Pane control

Pane Control is responsible for creating, destroying, hiding and showing windows.

As such, it has UI strings that it is responsible for. These are not currently handled very well -
they will need to be translatable in future, but are currently using hardcoded strings.
Where spotted, these have been flagged with TODO markers.

It also handles loading developer tools into windows.

Pane Control is broken down into multiple sections:

- Index
  - Exports the external API
- Window lifecycle
  - window-lifecycle.js
    - Methods for creating generic windows, and showing and resizing windows
  - call-window-manager
    - Manages the existence and visibility of windows declaratively based on a local copy of some bits of Redux state. This state can be updated by other parts of the App.
- Window creation
  - create-main-window.ts
    - Creates the main window using window-lifecycle
  - create-secondary-windows.ts
    - Creates secondary windows using window-lifecycle
- Menus
  - context-menu.js
    - Creates the menu to show in right-click
  - mac-app-menu.js
    - Creates the menus at the top of a Mac screen
- Types
  - TypeScript types exclusive to Pane Control
