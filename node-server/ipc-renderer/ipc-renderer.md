# IPC renderer

IPC renderer is the layer at the top of the node code, that communicates with the windows provided by `pane-control`. It is broken down into two sections:

- `window-messaging` accesses, names, and sends data to the windows.
- `window-listeners` listens out for messages from the windows, determines the namespace, and sends the messages onto the corresponding `ipc-wispa/namespaces` component.
