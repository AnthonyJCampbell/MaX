# Midbar

## Behaviour

This component is the middle pane in the main window.
It contains a search bar at the top, and a scrollable list below.

Depending on the tab selected in `Sidebar`, the scrollable list contains:

- `contact-list`: the user's contacts.
- `call-list`: the user's call history, and voicemail.
- `chat-list`: the user's chats.
- `meeting-management`: the control buttons for meetings (not a scrollable list).

Clicking an item in the scrollable list causes `Rightbar` to display the contact details for that contact.

## Design

The different midbar views each have their own component. The `<Midbar>` component decides which one to render based on Redux state.

`contact-list`, `call-list`, and `chat-list` are constucted using individual 'blocks'. A block is the rectangle that contains the avatar, name, and other information ( e.g. in `call-list` phone number of call and time of call) - multiple blocks make up the list.

In the future, the search bar will be able to filter the contents of the scrollable list (and show real data).
