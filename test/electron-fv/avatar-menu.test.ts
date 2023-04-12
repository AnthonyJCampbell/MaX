// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Avatar menu Electron FV tests
 */
import { expectWithinTimeout, waitForCondition, itMaybeWin } from "test/utils/utils";
import { Key } from "test/electron-fv/utils/interface";

import { Application } from "spectron";
import { MockWispa } from "../utils/mock-wispa";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UI } from "./utils/interface";
import { LoginState } from "node-server/types";

// These numbers correspond to the idList in avatar-menu.js
const avatarIndex = 2;
const passwordIndex = 3;
const updatesIndex = 10;
const aboutIndex = 11;
const helpIndex = 12;
const logOutIndex = 13;

export const avatarMenu = {
  title: "Avatar menu",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();

      await app.client.refresh();

      await UI.sidebar.profileButton.waitForVisible();
    });

    it('Sends a "View About" request to WISPA when clicking "About" menu item', async () => {
      await UI.sidebar.profileButton.click();
      await waitForCondition(async () => await UI.sidebar.avatarMenu.isVisible());

      const avatarMenuRows = await UI.sidebar.avatarMenu.rows();
      await avatarMenuRows[aboutIndex].click();

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("core", "action", {
            viewChangePassword: false,
            shutdown: false,
            viewAbout: true,
            viewHelp: false,
            viewCheckForUpdates: false,
          }),
        "Mock WISPA did not receive core action 'viewAbout' request"
      );
    });

    it('Sends a "View About" request to WISPA when choosing "About" menu item via keyboard navigation', async () => {
      await UI.pressKey([Key.TAB]);
      await UI.sidebar.profileButton.waitForActive();

      await UI.pressKey([Key.ENTER]);
      await waitForCondition(async () => await UI.sidebar.avatarMenu.isVisible());

      const avatarMenuRows = await UI.sidebar.avatarMenu.rows();

      await avatarMenuRows[0].waitForActive();
      for (let i = 1; i <= aboutIndex; i++) {
        await UI.pressKey([Key.ARROW_DOWN]);
        await avatarMenuRows[i].waitForActive();
      }
      await UI.pressKey([Key.ENTER]);

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("core", "action", {
            viewChangePassword: false,
            shutdown: false,
            viewAbout: true,
            viewHelp: false,
            viewCheckForUpdates: false,
          }),
        "Mock WISPA did not receive settings action 'viewAbout' request"
      );
    });

    // No point being overly repetitive in our testing.
    // Although we test one item ("about") using both click and keyboard navigation,
    // it is sufficient to just test clicking for the other items

    it('Sends a "Change Avatar" request to WISPA when clicking that menu item', async () => {
      await UI.sidebar.profileButton.click();
      await waitForCondition(async () => await UI.sidebar.avatarMenu.isVisible());

      const avatarMenuRows = await UI.sidebar.avatarMenu.rows();
      await avatarMenuRows[avatarIndex].click();

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("settings", "action", {
            viewChangeAvatar: true,
            viewGeneralSettings: false,
            viewSignInToChat: false,
            viewCallParkOrbits: false,
            viewCommportalAccount: false,
            viewCommportalApps: false,
            viewCommportalGroup: false,
            viewConferenceManager: false,
            viewCallManager: false,
          }),
        "Mock WISPA did not receive setting action 'viewChangeAvatar' request"
      );
    });

    it('Sends a "Change password" request to WISPA when clicking that menu item', async () => {
      await UI.sidebar.profileButton.click();
      await waitForCondition(async () => await UI.sidebar.avatarMenu.isVisible());

      const avatarMenuRows = await UI.sidebar.avatarMenu.rows();
      await avatarMenuRows[passwordIndex].click();

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("core", "action", {
            viewChangePassword: true,
            shutdown: false,
            viewAbout: false,
            viewHelp: false,
            viewCheckForUpdates: false,
          }),
        "Mock WISPA did not receive core action 'viewChangePassword' request"
      );
    });

    it('Sends a "View help" request to WISPA when clicking that menu item', async () => {
      await UI.sidebar.profileButton.click();
      await waitForCondition(async () => await UI.sidebar.avatarMenu.isVisible());

      const avatarMenuRows = await UI.sidebar.avatarMenu.rows();
      await avatarMenuRows[helpIndex].click();

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("core", "action", {
            viewChangePassword: false,
            shutdown: false,
            viewAbout: false,
            viewHelp: true,
            viewCheckForUpdates: false,
          }),
        "Mock WISPA did not receive core action 'viewHelp' request"
      );
    });

    itMaybeWin('Sends a "View Updates" request to WISPA when clicking that menu item', async () => {
      await UI.sidebar.profileButton.click();
      await waitForCondition(async () => await UI.sidebar.avatarMenu.isVisible());

      const avatarMenuRows = await UI.sidebar.avatarMenu.rows();
      await avatarMenuRows[updatesIndex].click();

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("core", "action", {
            viewChangePassword: false,
            shutdown: false,
            viewAbout: false,
            viewHelp: false,
            viewCheckForUpdates: true,
          }),
        "Mock WISPA did not receive core action 'viewCheckForUpdate' request"
      );
    });

    it('Sends a "Log out" request to WISPA when clicking that menu item', async () => {
      await UI.sidebar.profileButton.click();
      await waitForCondition(async () => await UI.sidebar.avatarMenu.isVisible());

      const avatarMenuRows = await UI.sidebar.avatarMenu.rows();
      await avatarMenuRows[logOutIndex].click();
      await UI.confirmLogOut.waitForVisible();

      const confirmLogOutButtons = await UI.confirmLogOut.buttons();
      await confirmLogOutButtons[0].click();

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("core", "update", {
            loginState: LoginState.LOGGED_OUT,
          }),
        "Mock WISPA did not receive settings action 'logOut' request"
      );
    });
  },
};
