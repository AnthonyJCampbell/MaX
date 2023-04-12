// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/** File exports one object containing all reducers for easy importing in store.js */

import { activeCallsReducer } from "./active-calls/reducer";
import { callHistoryReducer } from "./call-history/reducer";
import { contactReducer } from "./contacts/reducer";
import { coreReducer } from "./core/reducer";
import { paneManagementReducer } from "./pane-management/reducer";
import { messagingReducer } from "./messaging/reducer";
import { meetingReducer } from "./meetings/reducer";
import { settingsReducer } from "./settings/reducer";
import { voicemailsReducer } from "./voicemails/reducer";
import { userReducer } from "./user/reducer";
import { windowReducer } from "./window/reducer";

export {
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
};
