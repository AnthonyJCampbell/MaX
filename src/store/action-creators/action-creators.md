# Redux actions

Actions are plain JavaScript objects that describe what happens after a particular event. This will often involve state updates, but may also include IPC.

We make a distinction between two different types of IPC-related actions: incoming and outgoing.

- Outgoing IPC actions initiate IPC communications from React to Node whenever they are called. For example, when `listContacts` gets invoked, an IPC message gets sent to IPCMain.
- Incoming IPC actions are actions that are called in response to an incoming message from Node to React (IPCRenderer). For example, when Node sends a list of contacts, the listener will call the incoming-ipc action `onIPCAction`, which then triggers the contacts-reducer and state mutation.

Navigation actions are actions called due to the user navigating through the app.

## The `dispatch()` callback

We use the builtin `dispatch()` method throughout our actions, e.g.

```JavaScript
export const setActiveMidPane = (activeMidPane) => (dispatch) => {
  dispatch({
    type: ActionTypes.SET_ACTIVE_MID_PANE,
    payload: {
      activeMidPane,
    },
  });
};
```

This sends an action to the Redux store where it will be passed on to reducers as appropriate. In combination with [redux-thunk](https://github.com/reduxjs/redux-thunk) this allows the triggering of actions from components (and therefore state updates) to be asynchronous.
