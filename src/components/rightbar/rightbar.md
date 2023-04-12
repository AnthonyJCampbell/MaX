# Rightbar

## Behaviour

This component is the right-hand pane in the main window (also known as Pane C).
It contains a `ContentHeaderPanel`, which displays the name and status of the selected contact, as well as several buttons to initiate or control calls and chats, etc.
The design for `ContentHeaderPanel` is [here](./content-header-panel/content-header-panel.md)

It also contains a `ContentPanel` component, which holds a number of buttons/tabs, which toggles the component that is visible in the rest of the ContentPanel:

- `chat-pane`: tthe chat conversation with the selected contact
- `contact-pane`: the user's contact info, and call history and the like.

## Design

The different views for `ContentPanel` each have their own component, which gets toggled by a state-change in the encapsulating `ContentPanel` component.
