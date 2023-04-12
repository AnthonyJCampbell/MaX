// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the store, which is to be passed into <Provider /> at the root of the app
 */
import { createStore, combineReducers, applyMiddleware, compose } from "redux";

import thunk from "redux-thunk";

// Import all separate reducers
import {
  activeCallsReducer,
  callHistoryReducer,
  contactReducer,
  coreReducer,
  paneManagementReducer,
  messagingReducer,
  meetingReducer,
  settingsReducer,
  voicemailsReducer,
  userReducer,
  windowReducer,
} from "reducers/index";

/**
 * Will return one combined rootReducer, made up of all separate reducers
 */
//
export const rootReducer = combineReducers({
  activeCallsReducer,
  callHistoryReducer,
  contactReducer,
  coreReducer,
  paneManagementReducer,
  messagingReducer,
  meetingReducer,
  settingsReducer,
  voicemailsReducer,
  userReducer,
  windowReducer,
});

/**
 * Window to be casted as any to include __REDUX_DEVTOOLS_EXTENSION__ for
 * a store enhancer
 */
const store = createStore(
  rootReducer,
  {},
  compose(
    applyMiddleware(thunk),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ((window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__REDUX_DEVTOOLS_EXTENSION__()) ||
      applyMiddleware(thunk)
  )
);

// Store to be imported in index.js
export default store;
