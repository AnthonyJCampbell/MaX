# Node Server

The top level `node-server` directory contains all the code for the Node backend part of Electron.

It has 3 major responsibilities:

- Creating and destroying UI windows
- App lifecycle (launch/shutdown etc)
- Passing data to and from the Redux store and WISPA

These responsibilities are performed by three components, `Pane Control`, `Guardian` and `Data Fan` respectively. Each of these components live within their own subdirectory.

There are also two key APIs, one to communicate with WISPA (`/ipc-wispa`) and one to communicate with the Renderer process(es) (`/ipc-renderer`). These are kept in `node-server`.
