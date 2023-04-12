# Guardian

Guardian is the high-level controller of the system. It deals with start-up and shut down of the Electron and Java app, and checks that the system is healthy. Guardian owns Electron configuration.
It does this by starting the necessary node-server components, and listening to the application state.
