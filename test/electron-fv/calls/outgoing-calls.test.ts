// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Electron FV tests related to making outgoing calls.
 */
import each from "jest-each";

import { formatPhoneNumber } from "components/utils/phone-formatter";

import { protoBilbo, protoGandalf, protoPeter } from "shared/mocks/mock-contacts";
import { protoBilboCall, protoGandalfCall } from "shared/mocks/mock-active-calls";
import { mutableCloneDeep } from "shared/mocks/ts-utils";

import { Key } from "test/electron-fv/utils/interface";
import { waitForCondition, expectWithinTimeout, pause } from "test/utils/utils";
import { Application } from "spectron";
import { MockWispa } from "../../utils/mock-wispa";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UI } from "../utils/interface";

export const callButton = {
  title: "Call button",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();
      mockWispa.data.contacts = [protoBilbo, protoPeter, protoGandalf];
      await app.client.refresh();
      await UI.midbar.contactList.waitForSomeContacts(3);
    });

    it("makes a call to contact with one number", async () => {
      const contacts = await UI.midbar.contactList.contacts();
      // Select Bilbo, who only has one number
      await contacts[0].click();
      await waitForCondition(async () => {
        return (await UI.rightbar.contentHeaderPanel.contact.name()) === "Bilbo Baggins";
      });

      mockWispa.createDataStore.activeCalls = [protoBilboCall];
      const callButton = UI.rightbar.contentHeaderPanel.callButton;
      await expectWithinTimeout(
        async () => await callButton.isVisible(),
        "Call button did not become visible"
      );
      await callButton.click();

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("activecalls", "create", {
            uid: "",
            remoteParty: protoBilbo.phone[0].value,
            datetimeStarted: "",
          }),
        "Mock WISPA did not receive create call request"
      );
    });

    it("makes a call from menu to a contact with two numbers", async () => {
      const contacts = await UI.midbar.contactList.contacts();
      // Select Gandalf, who has two numbers
      await contacts[1].click();
      await waitForCondition(async () => {
        return (await UI.rightbar.contentHeaderPanel.contact.name()) === "Gandalf The ⚪";
      });

      const callButton = UI.rightbar.contentHeaderPanel.callButton;
      const callMenu = UI.rightbar.contentHeaderPanel.callButton.menu;

      await expectWithinTimeout(
        async () => await callButton.isVisible(),
        "Call button did not become visible"
      );
      await callButton.click();

      await expectWithinTimeout(
        async () => await callMenu.isVisible(),
        "Call menu did not become visible"
      );
      expect(await callMenu.rowTexts()).toEqual([
        formatPhoneNumber(protoGandalf.phone[0].value, "GB"),
        formatPhoneNumber(protoGandalf.phone[1].value, "GB"),
      ]);

      const callMenuRows = await callMenu.rows();

      mockWispa.createDataStore.activeCalls = [protoGandalfCall];
      await callMenuRows[0].click();

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("activecalls", "create", {
            uid: "",
            remoteParty: protoGandalf.phone[0].value,
            datetimeStarted: "",
          }),
        "Mock WISPA did not receive create call request"
      );
    });
  },
};

export const searchBar = {
  title: "Search bar",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();
      await app.client.refresh();
    });

    it('is focused when "New call" Add menu item is clicked', async () => {
      const input = UI.midbar.searchBar.input;

      await UI.sidebar.addButton.waitForVisible();
      await UI.sidebar.addButton.click();
      await waitForCondition(async () => await UI.sidebar.addMenu.isVisible());

      const addMenuRows = await UI.sidebar.addMenu.rows();
      await addMenuRows[0].click();

      await expectWithinTimeout(
        async () => await input.isActive(),
        "Search box is not selected within timeout"
      );
    });

    each([
      ["123456789", "123456789"],
      ["(+98) 765-4321", "+987654321"],
    ]).it(
      "creates a call when ENTER key is pressed and a valid phone number is inputted",
      async (searchInput, numberToDial) => {
        const searchInputBox = UI.midbar.searchBar.input;

        // Prepare the returned activeCall from mock wispa
        const activeCall = mutableCloneDeep(protoBilboCall);
        activeCall.remoteParty = numberToDial;
        mockWispa.createDataStore.activeCalls = [activeCall];

        // Type in the phone number into the search bar and move focus to the search bar
        await searchInputBox.waitForVisible();
        await searchInputBox.click();
        await expectWithinTimeout(
          async () => await searchInputBox.isActive(),
          "Search box did not become focused"
        );

        await searchInputBox.setValue(searchInput);
        await UI.auditAccessibility();
        await searchInputBox.waitForVisible();
        // Move the cursor back to the input box after a11y audit
        await searchInputBox.click();
        await searchInputBox.waitForActive();
        await expectWithinTimeout(
          async () => await UI.midbar.searchBar.callButton.isVisible(),
          "Search bar call button did not become visible"
        );
        await expectWithinTimeout(
          async () => await UI.midbar.searchBar.smsButton.isVisible(),
          "Search bar SMS button did not become visible"
        );

        await UI.pressKey([Key.ENTER]);
        await expectWithinTimeout(
          () =>
            mockWispa.hasReceivedRequest("activecalls", "create", {
              uid: "",
              remoteParty: numberToDial,
              datetimeStarted: "",
            }),
          "Mock WISPA did not receive create call request"
        );
        await UI.rightbar.contentHeaderPanel.expectToBeInCall();
        await UI.rightbar.contentHeaderPanel.expectWillHaveName(
          formatPhoneNumber(numberToDial, "GB")
        );
      }
    );

    each(["", "John Doe", "10 Downing Street"]).it(
      "does not create a call when ENTER key is pressed and search term is not phone number",
      async (searchInput) => {
        const searchInputBox = UI.midbar.searchBar.input;

        // Type in the phone number into the search bar and move focus to the search bar
        await searchInputBox.waitForVisible();
        await searchInputBox.click();
        await searchInputBox.waitForActive();

        await searchInputBox.setValue(searchInput);

        await UI.auditAccessibility();
        await searchInputBox.waitForVisible();
        await searchInputBox.click();
        await searchInputBox.waitForActive();

        // Should not have prompt to press enter to make a call
        expect(await UI.midbar.searchBar.getText()).not.toContain("Enter to call");

        await UI.pressKey([Key.ENTER]);

        // Wait for 1s, then check that WISPA has not received any request to create a new call.
        await pause(1000);
        expect(mockWispa.hasReceivedRequest("activecalls", "create")).toBe(false);
        await UI.rightbar.contentHeaderPanel.expectToBeOutOfCall();
      }
    );
  },
};

export const dialpad = {
  title: "Dialpad",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();
      await app.client.refresh();
    });

    it("Show dialpad", async () => {
      const dialpad = UI.midbar.dialpad;

      await expectWithinTimeout(
        async () => await dialpad.isVisible(),
        "Dialpad key button is visible"
      );
      await dialpad.click();
      await expectWithinTimeout(
        async () => await dialpad.dialpadContainer.isVisible(),
        "Dialpad is visible"
      );
    });

    it("Should call contact when pressing pressing call button in dialpad", async () => {
      const numberToDial = "+987654321";
      const activeCall = mutableCloneDeep(protoBilboCall);
      const searchInputBox = UI.midbar.searchBar.input;
      const dialpad = UI.midbar.dialpad;

      // Prepare the returned activeCall from mock wispa
      activeCall.remoteParty = numberToDial;
      mockWispa.createDataStore.activeCalls = [activeCall];

      await searchInputBox.setValue(numberToDial);

      await dialpad.click();
      await expectWithinTimeout(
        async () => await dialpad.dialpadCallButton.isVisible(),
        "Dialpad did not became visible"
      );
      await dialpad.dialpadCallButton.click();
      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("activecalls", "create", {
            uid: "",
            remoteParty: numberToDial,
            datetimeStarted: "",
          }),
        "Mock WISPA did not receive create call request"
      );
    });
  },
};
