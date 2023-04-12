# Introduction

This article describes how WISPA messages received from Java flow through Electron to the Redux store, and back out again.

### Naming conventions

- WISPA - Messages sent between Java and Electron (Node)

- IPC - Messages sent within Electron, between Node and React (Redux)

- Hook - React uses hooks to access the Redux store

# Example Incoming Flow

**Namespace**: example

**Message type**: data

## Java

&#11015; WISPA

## Node (node-server)

**`ipc-wispa/namespaces/example.js`**: A listener on the `example` namespace decodes the WISPA `data` message, attaches the namespace to the data contained in the message, and passes the data to the callback in `data-fan.js`.

&darr;

**`data-fan.js`**: Decides which window to send the data to, and sends it via `ipc-renderer/window-messaging.js`.

&darr;

**`ipc-renderer/window-messaging.js`**: Sends an IPC `data` message to the windows instructed to by `data-fan.js` (currently only `mainWindow`).

&#11015; IPC

## Redux (src/store)

**`action-creators/ipc-incoming/listeners.js`**: A listener on the `data` channel determines the action type and payload of the data in the IPC message and dispatches the action in `action-creators/ipc-incoming/actions.js` to the Redux store.

&darr;

**`reducers/example/reducer.js`**: Interprets the action and it's payload, sends the payload to `reducers/example/handlers.js` for processing, and updates the store with the processed data.

&#11014; useSelector Hook

## React (src/components)

Any components that access the state in the Redux store that has been updated by `reducers/example/reducer.js` will automatically receive that update and re-render (where necessary).

# Example Outgoing Flow

**Namespace**: example

**Message type**: get

## React (src/components)

The user performs e.g. a click, and a component dispatches an action from `action-creators/ipc-outgoing/example-actions.js`.

&#11015; useDispatch Hook

## Redux (src/store)

**`action-creators/ipc-outgoing/example-actions.js`**: The action dispatched creates the data object for the `get` message, attaches the namespace to the data object, and sends the data in an IPC `get` message to the listeners in `ipc-re nderer/window-listeners.js`.

&#11015; IPC

## Node (node-server)

**`ipc-renderer/window-listeners.js`**: A listener on the `get` channel determines the namespace of the data in the IPC message and passes the data to the corresponding method in `ipc-wispa/namespaces/example.js`.

&darr;

**`ipc-wispa/namespaces/example.js`**: The data passed in is verified to be in the correct form for encoding, encoded if correct, and sent to Java in a `get` WISPA message.

&#11015; WISPA

## Java
