# Redux store

This directory contains all code used for implementing the Redux state store.

For an introduction to working with Redux take a look at [this tutorial](https://redux.js.org/basics/basic-tutorial).

The large majority of state within the Electron UI is stored in Redux including e.g. the entire list of contacts, the active tab and the selected contact.

React components pull any state they need to render from the Redux store by passing a reducer to the `useSelector()` hook.

State updates are made by components `dispatch()`ing actions.

The actions and reducers mentioned above live in the subdirectories `actions` and `reducers` respectively.
