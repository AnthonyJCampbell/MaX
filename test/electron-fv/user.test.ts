// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * User related Electron FV tests
 */
import each from "jest-each";

import { PresenceState } from "shared/types";
import { CallManagerType } from "protobuf-wispa/dist/settings";
import * as pb from "protobuf-wispa";

import { expectWithinTimeout, waitForCondition } from "test/utils/utils";
import { Application } from "spectron";
import { MockWispa } from "../utils/mock-wispa";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UI } from "./utils/interface";
import { mutableCloneDeep } from "shared/mocks/ts-utils";

const presenceIndex = 0;
const customStatusIndex = 1;

export const presence = {
  title: "Presence",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();

      await app.client.refresh();

      await UI.sidebar.profileButton.waitForVisible();
    });

    each([
      ["Online", 0, PresenceState.ONLINE, CallManagerType.NONE],
      ["Busy", 1, PresenceState.BUSY, CallManagerType.ICM],
      ["Do not disturb", 2, PresenceState.DO_NOT_DISTURB, CallManagerType.BCM],
    ]).it(
      "Sends an update to user presence over WISPA and updates local state when selecting %s in the Presence sub-menu",
      async (status, index, presenceState, callManagerType) => {
        const callSettings = mockWispa.data.settings.call
          ? mutableCloneDeep(mockWispa.data.settings.call)
          : pb.settings.CallSettings.fromPartial({});
        callSettings.callManagerType = callManagerType;

        mockWispa.data.settings = {
          ...mockWispa.data.settings,
          call: callSettings,
        };

        await app.client.refresh();
        await UI.sidebar.profileButton.waitForVisible();
        await UI.sidebar.profileButton.click();
        await expectWithinTimeout(
          async () => await UI.sidebar.avatarMenu.isVisible(),
          "Avatar menu did not become visible"
        );

        const avatarMenuRows = await UI.sidebar.avatarMenu.rows();
        await avatarMenuRows[presenceIndex].click();
        await expectWithinTimeout(
          async () => await UI.sidebar.presenceMenu.isVisible(),
          "Presence menu did not become visible"
        );

        const presenceMenuRows = await UI.sidebar.presenceMenu.rows();
        await presenceMenuRows[index].click();
        await expectWithinTimeout(
          () =>
            mockWispa.hasReceivedRequest("user", "update", {
              presence: {
                customStatus: "",
                state: presenceState,
              },
            }),
          "Mock WISPA did not receive user request 'updateUser' with state: " + status
        );
        await expectWithinTimeout(
          async () => (await UI.sidebar.avatarMenu.isVisible()) === false,
          "Avatar menu did not disappear"
        );

        await UI.sidebar.profileButton.click();
        await expectWithinTimeout(
          async () => await UI.sidebar.avatarMenu.isVisible(),
          "Avatar menu did not become visible"
        );

        // Check the presence state has updated
        const presenceMenuText = await (
          await UI.sidebar.avatarMenu.rows()
        )[presenceIndex].getText();
        expect(presenceMenuText).toEqual(status);
      }
    );

    it("Sends an update to user presence over Wispa and updates local status when setting new custom status", async () => {
      const newCustomStatus = "New custom status";

      await UI.sidebar.profileButton.click();
      await expectWithinTimeout(
        async () => await UI.sidebar.avatarMenu.isVisible(),
        "Avatar menu did not become visible"
      );
      const avatarMenuRows = await UI.sidebar.avatarMenu.rows();
      await avatarMenuRows[customStatusIndex].click();

      await expectWithinTimeout(
        async () => await UI.sidebar.customStatus.textArea.isVisible(),
        "Custom status text field did not become visible"
      );
      await UI.sidebar.customStatus.typeMessage(newCustomStatus);

      await expectWithinTimeout(
        async () => await UI.sidebar.customStatus.saveButton.isVisible(),
        "Save button did not become visible"
      );
      await UI.sidebar.customStatus.saveButton.click();
      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("user", "update", {
            presence: {
              customStatus: newCustomStatus,
              state: PresenceState.ONLINE,
            },
          }),
        "Mock WISPA did not receive user request 'updateUser' with custom status: " +
          newCustomStatus
      );
      await expectWithinTimeout(
        async () => (await UI.sidebar.avatarMenu.isVisible()) === false,
        "Avatar menu did not disappear after saving custom status"
      );

      await UI.sidebar.profileButton.click();
      await expectWithinTimeout(
        async () => await UI.sidebar.avatarMenu.isVisible(),
        "Avatar menu did not re-appear after clicking profile picture"
      );
      await expectWithinTimeout(
        async () => (await UI.sidebar.customStatus.getText()).includes(newCustomStatus),
        "Custom status box did not contain previously saved custom status"
      );
    });

    it("Receiving user data over wispa is correctly displayed in the UI", async () => {
      await UI.sidebar.profileButton.click();
      await waitForCondition(async () => await UI.sidebar.avatarMenu.isVisible());

      let presenceMenuText = await (await UI.sidebar.avatarMenu.rows())[presenceIndex].getText();
      expect(presenceMenuText).toContain("Online");

      let inputAreaText = await UI.sidebar.customStatus.getText();
      expect(inputAreaText).toEqual("Set custom status");

      // Empty string for customStatus doesn't update custom status UI
      mockWispa.sendUser({ presence: { customStatus: "", state: PresenceState.BUSY } });

      presenceMenuText = await (await UI.sidebar.avatarMenu.rows())[presenceIndex].getText();
      expect(presenceMenuText).toContain("Busy");

      inputAreaText = await UI.sidebar.customStatus.getText();
      expect(inputAreaText).toEqual("Set custom status");

      // Receiving new data from wispa can change both presence state and custom status simultaneously
      mockWispa.sendUser({
        presence: { customStatus: "Out for lunch", state: PresenceState.DO_NOT_DISTURB },
      });

      presenceMenuText = await (await UI.sidebar.avatarMenu.rows())[presenceIndex].getText();
      expect(presenceMenuText).toContain("Do not disturb");

      inputAreaText = await UI.sidebar.customStatus.getText();
      expect(inputAreaText).toContain("Out for lunch");
    });
  },
};

export const callManager = {
  title: "Call Manager",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();
      await app.client.refresh();
      await UI.sidebar.profileButton.waitForVisible();
    });

    it("Asks to show the call manager", async () => {
      const callSettings = mockWispa.data.settings.call
        ? mutableCloneDeep(mockWispa.data.settings.call)
        : pb.settings.CallSettings.fromPartial({});
      callSettings.callManagerType = CallManagerType.ECM;

      mockWispa.data.settings = {
        ...mockWispa.data.settings,
        call: callSettings,
      };

      await app.client.refresh();
      await UI.sidebar.profileButton.waitForVisible();
      await UI.sidebar.profileButton.click();
      await expectWithinTimeout(
        async () => await UI.sidebar.avatarMenu.isVisible(),
        "Avatar menu did not become visible"
      );

      const avatarMenuRows = await UI.sidebar.avatarMenu.rows();
      await avatarMenuRows[presenceIndex].click();
      await expectWithinTimeout(
        async () => await UI.sidebar.presenceMenu.isVisible(),
        "Presence menu did not become visible"
      );

      const presenceMenuRows = await UI.sidebar.presenceMenu.rows();
      await presenceMenuRows[3].click();
      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("settings", "action", {
            viewChangeAvatar: false,
            viewGeneralSettings: false,
            viewSignInToChat: false,
            viewCallParkOrbits: false,
            viewCommportalAccount: false,
            viewCommportalApps: false,
            viewCommportalGroup: false,
            viewConferenceManager: false,
            viewCallManager: true,
          }),
        "Mock WISPA did not receive settings action 'viewCallManager' request"
      );
      await expectWithinTimeout(
        async () => (await UI.sidebar.avatarMenu.isVisible()) === false,
        "Avatar menu did not disappear"
      );
    });
  },
};
