// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Controls the app icon in the taskbar or doc.
 */

/* eslint-disable i18next/no-literal-string */

import log from "src/renderer-logging";

import { PresenceState } from "src/types";
import { getOperatingSystem } from "src/components/utils/common";

/**
 * Mac Dock icon images displaying each supported presence state.
 *
 * Note that Mac doesn't currently support the "in a meeting" state -
 * this is only triggered by Outlook integration on Windows.  It is
 * imported here as we do still have a Mac icon for it and it is
 * included in the presence enum that is shared between Windows and
 * Mac, so if support is added for it later, it will just work.
 */
import MacDockAway from "assets/shared/dock-away.png";
import MacDockBusy from "assets/shared/dock-busy.png";
import MacDockDnd from "assets/shared/dock-dnd.png";
import MacDockOffline from "assets/shared/dock-offline.png";
import MacDockOnline from "assets/shared/dock-online.png";
import MacDockOnThePhone from "assets/shared/dock-onthephone.png";
import MacDockInAMeeting from "assets/shared/dock-inameeting.png";

const isDev = window.require("electron-is-dev");
const path = window.require("path");
const { app } = window.require("@electron/remote");

/**
 * Keeps track of the most recent presence that we have set so that
 * we'll only actually update the app icon if the presence has changed.
 */
let latestPresence = PresenceState.UNKNOWN;

/**
 * Update the dock/taskbar icon to display the user's current presence status.
 * @param {PresenceState} presenceState - current presence state.
 */
export const setAppIcon = (presenceState: PresenceState): void => {
  if (presenceState !== latestPresence) {
    log.info(`Setting app icon with PresenceState: ${presenceState}`);

    if (getOperatingSystem() === "windows") {
      setWindowsAppIcon(presenceState);
    } else {
      setMacAppIcon(presenceState);
    }

    latestPresence = presenceState;
  }
};

const setMacAppIcon = (presenceState: PresenceState): void => {
  const iconImagePath = macIconImagePath(presenceState);
  try {
    app.dock.setIcon(iconImagePath);
    log.info(`Finished setting Mac app icon to: ${iconImagePath}`);
  } catch (error) {
    log.error(`Failed to set Mac app icon to: ${iconImagePath}, Error = ${error.message}`);
  }
};

const setWindowsAppIcon = (presenceState: PresenceState): void => {
  log.info(
    `Setting Windows app icon based on presence not yet implemented.  Current presence: ${presenceState}`
  );
};

const macIconImagePath = (presenceState: PresenceState): string => {
  switch (presenceState) {
    case PresenceState.AWAY:
      return isDev ? devImagePath("away") : prodImagePath(MacDockAway);
    case PresenceState.BUSY:
      return isDev ? devImagePath("busy") : prodImagePath(MacDockBusy);
    case PresenceState.DO_NOT_DISTURB:
      return isDev ? devImagePath("dnd") : prodImagePath(MacDockDnd);
    case PresenceState.OFFLINE:
      return isDev ? devImagePath("offline") : prodImagePath(MacDockOffline);
    case PresenceState.ONLINE:
      return isDev ? devImagePath("online") : prodImagePath(MacDockOnline);
    case PresenceState.IN_A_CALL:
      return isDev ? devImagePath("onthephone") : prodImagePath(MacDockOnThePhone);
    case PresenceState.IN_A_MEETING:
      return isDev ? devImagePath("inameeting") : prodImagePath(MacDockInAMeeting);
    default:
      return isDev ? devImagePath("online") : prodImagePath(MacDockOnline);
  }
};

/**
 * Converts image imported on React to a path that can be used by the node process.
 * @param {string} image - image path from importing on React.
 */
const prodImagePath = (image: string): string => {
  log.debug(`Looking for path for image: ${image}`);
  const fullPath = path.join(app.getAppPath(), "build", image);
  log.debug(`Returning image path: ${fullPath}`);
  return fullPath;
};

/**
 * The dev client gets the images directly from the codebase.
 * @param {string} presenceString a string representing the user's presence.
 * @returns the full path to the app icon image that displays the given presence.
 */
const devImagePath = (presenceString: string): string => {
  return `./src/assets/shared/dock-${presenceString}.png`;
};
