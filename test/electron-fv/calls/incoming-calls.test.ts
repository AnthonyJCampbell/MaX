// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Electron FV tests related to receiving incoming calls
 */

import { formatPhoneNumber } from "components/utils/phone-formatter";
import { CallStatus } from "shared/types";

import { protoBilbo, protoGandalf, protoPeter } from "shared/mocks/mock-contacts";
import { protoBilboCall } from "shared/mocks/mock-active-calls";
import { mutableCloneDeep } from "shared/mocks/ts-utils";

import { WindowType } from "test/electron-fv/utils/interface";
import { waitForCondition, expectWithinTimeout } from "test/utils/utils";
import { Application } from "spectron";
import { MockWispa } from "../../utils/mock-wispa";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UI } from "../utils/interface";

export const incomingCallWindow = {
  title: "Incoming Call Window",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();
      mockWispa.data.contacts = [protoBilbo, protoPeter, protoGandalf];

      await app.client.refresh();
      await app.client.windowByIndex(0);
      await UI.midbar.contactList.waitForSomeContacts(3);

      const contacts = await UI.midbar.contactList.contacts();
      // Set selectedcontact to Peter (to verify that a new contact gets selected when clicking
      // 'accept' and that nothing happens in mainwindow when clicking 'decline')
      await contacts[2].click();
      await waitForCondition(async () => {
        return (await UI.rightbar.contentHeaderPanel.contact.name()) === "Peter Parker";
      });
    });

    it("Opens up a call window", async () => {
      const protoBilboIncoming = mutableCloneDeep(protoBilboCall);
      protoBilboIncoming.status = CallStatus.INCOMING;
      // Setup & send data for activeCalls
      mockWispa.data.activeCalls = [protoBilboIncoming];
      mockWispa.sendActiveCall(protoBilboIncoming.uid);

      // Wait for Incoming Call Window to appear
      await waitForCondition(async () => {
        return (await app.client.getWindowCount()) === 2;
      });
      await app.client.windowByIndex(1);
      await UI.incomingCallFrame.waitForVisible();

      expect(await UI.incomingCallFrame.isVisible()).toBe(true);
      expect(await UI.incomingCallFrame.acceptButton.isVisible()).toBe(true);
      expect(await UI.incomingCallFrame.rejectButton.isVisible()).toBe(true);
    });

    it("Can accept a call and show the main window", async () => {
      const panel = UI.rightbar.contentHeaderPanel;

      // Setup & send data for activeCalls
      const protoBilboIncoming = mutableCloneDeep(protoBilboCall);
      protoBilboIncoming.status = CallStatus.INCOMING;
      mockWispa.data.activeCalls = [protoBilboIncoming];

      mockWispa.sendActiveCall(protoBilboIncoming.uid);
      await expectWithinTimeout(
        async () => (await app.client.getWindowCount()) === 2,
        "Incoming call window did not appear"
      );
      await app.client.windowByIndex(1);
      await UI.incomingCallFrame.waitForVisible();
      await UI.auditAccessibility();

      mockWispa.data.activeCalls = [protoBilboCall];
      await UI.incomingCallFrame.acceptButton.click();

      // Switch to mainWindow & wait for in-call UI to be visible
      await app.client.windowByIndex(0);
      await UI.rightbar.waitForVisible();
      await UI.auditAccessibility();
      await panel.expectToBeInCall();
      await panel.expectWillHaveName("Bilbo Baggins");

      // Check that we've got the main window and the in-call window. The in-call window may be hidden
      // but that doesn't matter
      await expectWithinTimeout(
        async () => (await app.client.getWindowCount()) === 2,
        "Window count did not become 2"
      );
      await app.client.windowByIndex(0);
      await expectWithinTimeout(
        async () => (await UI.windowType()) === WindowType.MAIN,
        "Window was not of type 'main'"
      );
      await app.client.windowByIndex(1);
      await expectWithinTimeout(
        async () => (await UI.windowType()) === WindowType.IN_CALL,
        "Window was not of type 'inCall'"
      );
    });

    it("Can accept a call from a non-contact and show the main window", async () => {
      const panel = UI.rightbar.contentHeaderPanel;

      // Setup & send data for activeCalls
      const protoNonContactIncoming = mutableCloneDeep(protoBilboCall);
      protoNonContactIncoming.status = CallStatus.INCOMING;
      protoNonContactIncoming.remoteParty = "01773299423";

      const protoNonContactCurrent = mutableCloneDeep(protoNonContactIncoming);
      protoNonContactCurrent.status = CallStatus.CURRENT;
      mockWispa.data.activeCalls = [protoNonContactIncoming];

      mockWispa.sendActiveCall(protoNonContactIncoming.uid);
      await expectWithinTimeout(
        async () => (await app.client.getWindowCount()) === 2,
        "Incoming call window did not appear"
      );
      await app.client.windowByIndex(1);
      await UI.incomingCallFrame.waitForVisible();
      await UI.auditAccessibility();

      mockWispa.data.activeCalls = [protoNonContactCurrent];
      await UI.incomingCallFrame.acceptButton.click();

      // Switch to mainWindow & wait for in-call UI to be visible
      await app.client.windowByIndex(0);
      await UI.rightbar.waitForVisible();
      await UI.auditAccessibility();
      await panel.expectToBeInCall();
      await panel.expectWillHaveName(formatPhoneNumber(protoNonContactCurrent.remoteParty, "GB"));

      // Check that we've got the main window and the in-call window. The in-call window may be hidden
      // but that doesn't matter
      await expectWithinTimeout(
        async () => (await app.client.getWindowCount()) === 2,
        "Window count did not become 2"
      );
      await app.client.windowByIndex(0);
      await expectWithinTimeout(
        async () => (await UI.windowType()) === WindowType.MAIN,
        "Window was not of type 'main'"
      );
      await app.client.windowByIndex(1);
      await expectWithinTimeout(
        async () => (await UI.windowType()) === WindowType.IN_CALL,
        "Window was not of type 'inCall'"
      );
    });

    it("Can decline a call without affecting the main window", async () => {
      const panel = UI.rightbar.contentHeaderPanel;

      // Setup & send data for activeCalls
      const protoBilboIncoming = mutableCloneDeep(protoBilboCall);
      protoBilboIncoming.status = CallStatus.INCOMING;
      mockWispa.data.activeCalls = [protoBilboIncoming];

      mockWispa.sendActiveCall(protoBilboIncoming.uid);
      await expectWithinTimeout(
        async () => (await app.client.getWindowCount()) === 2,
        "Incoming call window did not appear"
      );

      await app.client.windowByIndex(1);
      await UI.incomingCallFrame.waitForVisible();
      await UI.auditAccessibility();
      mockWispa.data.activeCalls = [protoBilboCall];

      await UI.incomingCallFrame.rejectButton.click();
      await app.client.windowByIndex(0);
      await UI.rightbar.waitForVisible();
      await UI.auditAccessibility();

      // Verify that the incall UI is not showing
      await panel.expectToBeOutOfCall();
      await panel.expectWillHaveName("Peter Parker");

      // Should end up with just the main window, no incoming call window
      await expectWithinTimeout(
        async () => (await app.client.getWindowCount()) === 1,
        "Window count did not become 1"
      );
      await expectWithinTimeout(
        async () => (await UI.windowType()) === WindowType.MAIN,
        "Window was not of type 'main'"
      );
    });
  },
};
