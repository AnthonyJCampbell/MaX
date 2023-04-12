# Components

The entire app (`mainWindow` as defined by Electron) is primarily made up of three panes that contain the majority of the functionality.

- The left-hand `Sidebar`, which contains the buttons to switch between different tabs on the `Midbar`. This pane is the primary driver of user behaviour.
- The `Midbar` is a scrollable list containing the contacts/call history/chat messages/meeting controls, which can change the contents of `Rightbar` when clicked.
- The `Rightbar` is the primary information pane. It shows the contact details for the contact selected in `Midbar`.

`Avatar` is a component shared between the three main panes.
