// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Controls the badge in the app icon in the taskbar or doc.
 */

import i18n from "i18next";
import log from "src/renderer-logging";

import { getOperatingSystem } from "src/components/utils/common";
import Overlay1 from "assets/shared/notification-overlay-1.ico";
import Overlay2 from "assets/shared/notification-overlay-2.ico";
import Overlay3 from "assets/shared/notification-overlay-3.ico";
import Overlay4 from "assets/shared/notification-overlay-4.ico";
import Overlay5 from "assets/shared/notification-overlay-5.ico";
import Overlay6 from "assets/shared/notification-overlay-6.ico";
import Overlay7 from "assets/shared/notification-overlay-7.ico";
import Overlay8 from "assets/shared/notification-overlay-8.ico";
import Overlay9 from "assets/shared/notification-overlay-9.ico";
import Overlay9Plus from "assets/shared/notification-overlay-9-plus.ico";
import { ipcChannels } from "shared/constants";

const isDev = window.require("electron-is-dev");
const path = window.require("path");
const { app } = window.require("@electron/remote");
const { ipcRenderer } = window.require("electron");

/**
 * Add an unread notifications badge to the app icon in the taskbar or dock.
 * @param {number} unreadCount - number of unread notifications
 */
export const setAppBadge = (unreadCount) => {
  log.info(`Setting app badge with unreadCount: ${unreadCount}`);

  if (getOperatingSystem() === "windows") {
    setWindowsAppBadge(unreadCount);
  } else {
    setMacAppBadge(unreadCount);
  }
};

const setMacAppBadge = (unreadCount) => {
  app.dock.setBadge(macBadgeText(unreadCount));
};

const macBadgeText = (unreadCount) => {
  if (unreadCount === 0) {
    return "";
  } else if (unreadCount > 9) {
    return "9+";
  } else {
    return unreadCount.toString();
  }
};

const setWindowsAppBadge = (unreadCount) => {
  // The description is only for screen readers.
  ipcRenderer.send(ipcChannels.setOverlayIcon, {
    overlayPath: overlayImagePath(unreadCount),
    overlayDescription: overlayDescription(unreadCount),
  });
};

const overlayDescription = (unreadCount) => {
  return i18n.t("notification_interval", { postProcess: "interval", count: unreadCount });
};

const overlayImagePath = (unreadCount) => {
  return isDev ? devOverlayImagePath(unreadCount) : prodOverlayImagePath(unreadCount);
};

const devOverlayImagePath = (unreadCount) => {
  if (unreadCount === 0) {
    return null;
  } else if (unreadCount > 9) {
    // eslint-disable-next-line i18next/no-literal-string
    return "./src/assets/shared/notification-overlay-9-plus.ico";
  } else {
    // eslint-disable-next-line i18next/no-literal-string
    return `./src/assets/shared/notification-overlay-${unreadCount}.ico`;
  }
};

const prodOverlayImagePath = (unreadCount) => {
  switch (unreadCount) {
    case 0:
      return null;
    case 1:
      return prodImagePath(Overlay1);
    case 2:
      return prodImagePath(Overlay2);
    case 3:
      return prodImagePath(Overlay3);
    case 4:
      return prodImagePath(Overlay4);
    case 5:
      return prodImagePath(Overlay5);
    case 6:
      return prodImagePath(Overlay6);
    case 7:
      return prodImagePath(Overlay7);
    case 8:
      return prodImagePath(Overlay8);
    case 9:
      return prodImagePath(Overlay9);
    default:
      return prodImagePath(Overlay9Plus);
  }
};

/**
 * Converts image imported on React to a path that can be used by the node process.
 * @param {string} image - image path from importing on React.
 */
const prodImagePath = (image) => {
  return path.join(app.getAppPath(), "build", image);
};
