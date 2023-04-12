Reducers take in the state and the action, optionally execute any arbitrary amount of logic through their handlers, and then returns the next state of the app.

In essence, the Reducer's sole job is to facilitate state mutation through pre-defined cases (as indicated by the action-creator types).

`index.js` combines all the reducers into one super-reducer, for ease of use throughout the codebase. The reducers consist of:
- `contacts`, which contains the contact list and selected contact. Actions that manipulate state relating to contacts dispatch to this reducer.
- `active-calls`, which contains the active calls list. Actions that manipulate state relating to active calls dispatch to this reducer.
- `messaging`, which contains the chat list and chat message histories. Actions that manipulate state relating to messaging or chat dispatch to this reducer.
- `voicemails`, which contains the voicemail/fax count.