// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Settings related Electron FV tests
 */
import { expectWithinTimeout, waitForCondition } from "test/utils/utils";
import { Key } from "test/electron-fv/utils/interface";
import { Application } from "spectron";
import { MockWispa } from "../utils/mock-wispa";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UI } from "./utils/interface";

// These numbers correspond to the idList in avatar-menu.js
const settingsIndex = 4;

export const avatarMenu = {
  title: "Avatar menu",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();

      await app.client.refresh();

      await UI.sidebar.profileButton.waitForVisible();
    });

    it('Sends a "View General Settings" request to WISPA when clicking "Settings" menu item', async () => {
      await UI.sidebar.profileButton.click();
      await waitForCondition(async () => await UI.sidebar.avatarMenu.isVisible());

      const avatarMenuRows = await UI.sidebar.avatarMenu.rows();
      await avatarMenuRows[settingsIndex].click();

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("settings", "action", {
            viewChangeAvatar: false,
            viewGeneralSettings: true,
            viewSignInToChat: false,
            viewCallParkOrbits: false,
            viewCommportalAccount: false,
            viewCommportalApps: false,
            viewCommportalGroup: false,
            viewConferenceManager: false,
            viewCallManager: false,
          }),
        "Mock WISPA did not receive settings action 'viewGeneralSettings' request"
      );
    });

    it('Sends a "View General Settings" request to WISPA when choosing Settings menu item via keyboard navigation', async () => {
      await UI.pressKey([Key.TAB]);
      await UI.sidebar.profileButton.waitForActive();

      await UI.pressKey([Key.ENTER]);
      await waitForCondition(async () => await UI.sidebar.avatarMenu.isVisible());

      const avatarMenuRows = await UI.sidebar.avatarMenu.rows();

      await avatarMenuRows[0].waitForActive();
      for (let i = 1; i <= settingsIndex; i++) {
        await UI.pressKey([Key.ARROW_DOWN]);
        await avatarMenuRows[i].waitForActive();
      }
      await UI.pressKey([Key.ENTER]);

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("settings", "action", {
            viewChangeAvatar: false,
            viewGeneralSettings: true,
            viewSignInToChat: false,
            viewCallParkOrbits: false,
            viewCommportalAccount: false,
            viewCommportalApps: false,
            viewCommportalGroup: false,
            viewConferenceManager: false,
            viewCallManager: false,
          }),
        "Mock WISPA did not receive settings action 'viewGeneralSettings' request"
      );
    });
  },
};
