# IPC wispa

IPC wispa is the layer at the bottom of the node code, that communicates with Java, through sockets. It is broken down into two sections:

- `wispa-messaging` determines the sockets for, and starts up each namespace.
- The namespaces - the namespace files handle incoming and outgoing messages to/from Java for a specific namespace, and passes incoming messages to `data-fan` for distribution to the Electron windows.
