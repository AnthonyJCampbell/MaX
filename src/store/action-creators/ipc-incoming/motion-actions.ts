// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import store from "store/store";
import { setSelectedContact } from "action-creators/navigation/actions";
import { selectContactWithUid } from "store/selectors/contacts";

import { DisplayContactMotion } from "src/types";
import { ipcChannels } from "shared/constants";
import { WindowTypes } from "src/shared/types";
import log from "src/renderer-logging";

/**
 * Set the selected contact from the display contact motion
 * @param {DisplayContactMotion} displayContact - The contact to display
 */
export const changeSelectedContact = (displayContact: DisplayContactMotion): void => {
  const contact = selectContactWithUid(displayContact.uid)(store.getState());

  if (!contact) return;
  log.debug(`Displaying contact from motion, with uid: ${contact.uid}`);
  store.dispatch(setSelectedContact(contact));
  const electron = window.require("electron");
  electron.ipcRenderer.send(ipcChannels.showWindow, { type: WindowTypes.main });
};
