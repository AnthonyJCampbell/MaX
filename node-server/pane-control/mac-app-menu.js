// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Application menu shown on menu bar on Mac OS
 */
"use strict";

import i18n from "i18next";
import isDev from "electron-is-dev";

import { Menu, shell } from "../electron-wrapper";
import { send } from "../ipc-wispa/wispa-client";
import log from "../main-logging";
import { WispaRequest } from "../../src/shared/types";

const separator = { type: "separator" };

export function initMacMenu() {
  if (process.platform === "darwin") {
    /** Preferences template */
    const wispaSettingsRequest = new WispaRequest();
    wispaSettingsRequest.payload = { action: { settingsAction: { viewGeneralSettings: true } } };
    const preferencesTemplate = {
      label: i18n.t("preferences"),
      accelerator: "Command+,",
      click() {
        log.user_action("Pressed preferences. Opening Options window");
        send(wispaSettingsRequest);
      },
    };

    const wispaAboutRequest = new WispaRequest();
    wispaAboutRequest.payload = { action: { coreAction: { viewAbout: true } } };
    const aboutTemplate = {
      label: i18n.t("aboutWithAppName"),
      click() {
        log.user_action("Pressed About");
        send(wispaAboutRequest);
      },
    };

    /**
     * AppMenu template
     * Copied from the default appmenu, with preferences added in
     */
    const appMenu = {
      role: "appmenu",
      submenu: [
        aboutTemplate,
        separator,
        preferencesTemplate,
        separator,
        { role: "services" },
        separator,
        { role: "hide" },
        { role: "hideothers" },
        { role: "unhide" },
        separator,
        { role: "quit" },
      ],
    };

    /**
     * ViewMenu template
     * Copied from the default view menu, with 'Toggle Developer Tools' removed if we're not running
     * a dev build
     * TODO BRANDING: We can re-enable dev tools for a dev bundled installer once we have a separate
     * dev branding for the electron side of the app.
     */
    const viewMenu = {
      role: "viewMenu",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        ...(isDev ? [{ role: "toggleDevTools" }] : []),
        separator,
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        separator,
        { role: "togglefullscreen" },
      ],
    };

    /**
     * Help template
     * Copied from the default help menu, with 'report a bug' and 'send feedback' added in
     */
    const help = {
      role: "help",
      submenu: [
        {
          label: i18n.t("sendFeedback"),
          click() {
            shell.openExternal(
              "https://forms.office.com/Pages/ResponsePage.aspx?id=61aenRP2202ye7_N8Uss27WAwjLbn0pNu25EM5EN1FFUNjBZVE9XQUM3MlNMVFFXSjE3T081UkdXMS4u"
            );
          },
        },
      ],
    };

    /**
     * Generate the application menu, to be shown on Mac OS.
     */
    const macAppMenu = Menu.buildFromTemplate([
      appMenu,
      {
        role: "filemenu",
      },
      {
        role: "editmenu",
      },
      viewMenu,
      {
        role: "windowmenu",
      },
      help,
    ]);

    Menu.setApplicationMenu(macAppMenu);
  }
}
