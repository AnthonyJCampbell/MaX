// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Tests to be carried out when the app is idle
 */
import { protoBilbo, protoPeter, protoGandalf, protoNoName } from "shared/mocks/mock-contacts";
import { expectWithinTimeout } from "test/utils/utils";
import { Key } from "test/electron-fv/utils/interface";
import { Application } from "spectron";
import { MockWispa } from "../../utils/mock-wispa";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UI } from "../utils/interface";

export const rightbar = {
  title: "Rightbar",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();
      mockWispa.data.contacts = [protoBilbo, protoPeter, protoGandalf, protoNoName];
      await app.client.refresh();
      await UI.midbar.contactList.waitForSomeContacts(4);
    });

    it("does not change when selecting a sidebar tab", async () => {
      const contacts = await UI.midbar.contactList.contacts();

      // Select a contact with an IM (so it has both chat and contact details panes) and change which
      // content pane is active for most interesting testing
      await contacts[1].click();
      await UI.auditAccessibility();
      await UI.rightbar.contactDetailsTabButton.click();
      const originalHTML = await UI.rightbar.getHTML();
      await UI.auditAccessibility();

      await UI.sidebar.callsButton.click();
      await UI.midbar.callList.waitForVisible();
      await expectWithinTimeout(
        async () => (await UI.rightbar.getHTML()) === originalHTML,
        "Rightbar has not rerendered the same"
      );

      await UI.sidebar.chatsButton.click();
      await UI.midbar.chatList.waitForVisible();
      await expectWithinTimeout(
        async () => (await UI.rightbar.getHTML()) === originalHTML,
        "Rightbar has not rerendered the same"
      );

      await UI.sidebar.contactsButton.click();
      await UI.midbar.contactList.waitForVisible();
      await expectWithinTimeout(
        async () => (await UI.rightbar.getHTML()) === originalHTML,
        "Rightbar has not rerendered the same"
      );

      await UI.sidebar.meetingsButton.click();
      await UI.midbar.meetingManagement.waitForVisible();
      await expectWithinTimeout(
        async () => (await UI.rightbar.getHTML()) === originalHTML,
        "Rightbar has not rerendered the same"
      );
    });

    it("updates when selecting a new contact", async () => {
      const [bilbo, gandalf, , peter] = await UI.midbar.contactList.contacts();

      await bilbo.click();
      await UI.rightbar.contentHeaderPanel.expectWillHaveName("Bilbo Baggins");
      await UI.rightbar.contentHeaderPanel.expectWillHavePresence(
        "Online - I'm Going On An Adventure!"
      );
      await UI.auditAccessibility();

      await peter.click();
      await UI.rightbar.contentHeaderPanel.expectWillHaveName("Peter Parker");
      await UI.rightbar.contentHeaderPanel.expectWillHavePresence("Offline");
      await UI.auditAccessibility();

      await gandalf.click();
      await UI.rightbar.contentHeaderPanel.expectWillHaveName(`Gandalf The ⚪`);
      await UI.rightbar.contentHeaderPanel.expectWillHavePresence(`In a call - 🧙‍♂️ 🔥 👹 ✔ ਅਨਾਨਾਸ`);
    });

    it("updates when on receiving a display motion from WISPA", async () => {
      const [bilbo, , ,] = await UI.midbar.contactList.contacts();
      mockWispa.data.motion = { displayContact: { uid: protoPeter.uid } };

      await bilbo.click();
      await UI.rightbar.contentHeaderPanel.expectWillHaveName("Bilbo Baggins");
      await UI.rightbar.contentHeaderPanel.expectWillHavePresence(
        "Online - I'm Going On An Adventure!"
      );
      await UI.auditAccessibility();

      // Receive motion
      mockWispa.sendDisplayContactMotion();
      await UI.rightbar.contentHeaderPanel.expectWillHaveName("Peter Parker");
      await UI.rightbar.contentHeaderPanel.expectWillHavePresence("Offline");
      await UI.auditAccessibility();
    });

    it("focuses on the message box on selecting a new contact", async () => {
      const [, gandalfButton, , peterButton] = await UI.midbar.contactList.contacts();
      const input = UI.rightbar.chatPane.messageBox.inputField;

      // Select an initial contact, and check focus jumps. This is not
      // instantaneous, so we need to explicitly wait for it to happen.
      await gandalfButton.click();

      await expectWithinTimeout(
        async () => await input.isVisible(),
        "Input field did not become visible"
      );
      await expectWithinTimeout(
        async () => await input.isActive(),
        "Input field did not become focused"
      );

      expect(await input.isActive()).toBe(true);
      await UI.auditAccessibility();

      // Select a new contact, and check focus is still present.
      await peterButton.click();

      await expectWithinTimeout(
        async () => await input.isVisible(),
        "Input field did not stay visible after selecting new contact"
      );
      await expectWithinTimeout(
        async () => await input.isActive(),
        "Input field did not stay focused after selecting new contact"
      );

      expect(await input.isActive()).toBe(true);
    });

    it("doesn't try to focus the message box on selecting a non IM contact", async () => {
      // The message box can't be navigated to for a contact without an IM. This test verifies that
      // the focus remains on the contact instead of trying to focus the non-existent message box
      const [, , nonameButton] = await UI.midbar.contactList.contacts();
      const input = UI.rightbar.chatPane.messageBox.inputField;

      await nonameButton.click();
      await expectWithinTimeout(
        async () => (await UI.rightbar.contentHeaderPanel.contact.name()) === "No name",
        "No name contact did not become the selected contact"
      );

      expect(await nonameButton.isActive()).toBe(true);
      expect(await input.isVisible()).toBe(false);
    });

    it("defaults to chat pane when switching contacts from one without IM to one with IM", async () => {
      const [, gandalf, noname] = await UI.midbar.contactList.contacts();
      const chatPane = UI.rightbar.chatPane;
      const contactPane = UI.rightbar.contactPane;

      // Select contact with no IM. This should default to contactPane.
      // Also it won't be instantaneous, so we need to wait for it to be visible.
      await noname.click();

      await expectWithinTimeout(
        async () => await contactPane.isVisible(),
        "Contact pane did not become visible"
      );

      expect(await contactPane.isVisible()).toBe(true);
      expect(await chatPane.isVisible()).toBe(false);

      await UI.auditAccessibility();

      // Select contact with an IM. We should switch to the chatPane of that contact.
      // Also it won't be instantaneous, so we need to wait for it to be visible.
      await gandalf.click();

      await expectWithinTimeout(
        async () => await chatPane.isVisible(),
        "Chat pane did not become visible"
      );

      expect(await chatPane.isVisible()).toBe(true);
      expect(await contactPane.isVisible()).toBe(false);
    });

    it("defaults to chat pane when switching from contact details pane of one contact to another contact", async () => {
      const [, gandalf, , peter] = await UI.midbar.contactList.contacts();
      const chatPane = UI.rightbar.chatPane;
      const contactPane = UI.rightbar.contactPane;
      const contactPaneTabButton = UI.rightbar.contactDetailsTabButton;

      // Select contact. This should default to chatPane.
      // Also it won't be instantaneous, so we need to wait for it to be visible.
      await gandalf.click();

      await expectWithinTimeout(
        async () => await chatPane.isVisible(),
        "Chat pane did not become visible"
      );

      expect(await chatPane.isVisible()).toBe(true);
      expect(await contactPane.isVisible()).toBe(false);

      await UI.auditAccessibility();

      // Go to contactPane. Also it won't be instantaneous, so we need to wait for it to be visible.

      await contactPaneTabButton.click();

      await expectWithinTimeout(
        async () => await contactPane.isVisible(),
        "Contact pane did not become visible"
      );

      expect(await contactPane.isVisible()).toBe(true);
      expect(await chatPane.isVisible()).toBe(false);

      await UI.auditAccessibility();

      // Select another contact. We should switch to the chatPane of that contact.
      await peter.click();

      await expectWithinTimeout(
        async () => await chatPane.isVisible(),
        "Chat pane did not become visible after selecting Peter"
      );

      expect(await chatPane.isVisible()).toBe(true);
      expect(await contactPane.isVisible()).toBe(false);
    });

    it("should not display meeting button on content header panel", async () => {
      await expectWithinTimeout(
        async () => await UI.rightbar.contentHeaderPanel.defaultMeetingButton.isVisible(),
        "Meeting Button is not visible yet"
      );

      mockWispa.data.settings = {
        ...mockWispa.data.settings,
        meetings: {
          enabled: false,
        },
      };
      mockWispa.sendSettings();

      await expectWithinTimeout(
        async () =>
          (await UI.rightbar.contentHeaderPanel.defaultMeetingButton.isVisible()) === false,
        "Meeting Button was not hide"
      );
    });

    it("should apply the navigation correctly, when meetings button is hidden", async () => {
      mockWispa.data.settings = {
        ...mockWispa.data.settings,
        meetings: {
          enabled: false,
        },
      };
      mockWispa.sendSettings();

      await UI.pressKey([Key.TAB]);
      await UI.sidebar.profileButton.waitForActive();
      await UI.pressKey([Key.TAB]);
      await UI.sidebar.addButton.waitForActive();
      await UI.pressKey([Key.TAB]);
      await UI.sidebar.contactsButton.waitForActive();
      await UI.pressKey([Key.TAB]);
      await UI.sidebar.voicemailButton.waitForActive();
      await UI.pressKey([Key.TAB]);
      await UI.sidebar.bugButton.waitForActive();
      await UI.pressKey([Key.TAB]);
      await UI.sidebar.feedbackButton.waitForActive();
      await UI.pressKey([Key.TAB]);
      await UI.midbar.searchBar.input.waitForActive();
      await UI.pressKey([Key.TAB]);
      await UI.midbar.dialpad.waitForActive();
      await UI.pressKey([Key.TAB]);

      // TODO: Fix the below workaround
      /* Expected behavior
    await expectWithinTimeout(
      async () => await UI.rightbar.contentHeaderPanel.defaultMoreButton.isActive(),
      "More buttons has not received focus"
    );
    */
    });

    it("Correctly sends basic analytic with no additional data", async () => {
      const [, gandalf, ,] = await UI.midbar.contactList.contacts();
      const chatPane = UI.rightbar.chatPane;
      const contactPane = UI.rightbar.contactPane;
      const contactPaneTabButton = UI.rightbar.contactDetailsTabButton;

      // Select contact. This should default to chatPane.
      // Also it won't be instantaneous, so we need to wait for it to be visible.
      await gandalf.click();

      await expectWithinTimeout(
        async () => await chatPane.isVisible(),
        "Chat pane did not become visible"
      );

      expect(await chatPane.isVisible()).toBe(true);
      expect(await contactPane.isVisible()).toBe(false);

      await UI.auditAccessibility();

      // Go to contactPane. Also it won't be instantaneous, so we need to wait for it to be visible.
      await contactPaneTabButton.click();

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("analytics", "action", {
            eventType: "VIEW_CONTACT_DETAILS",
            additionalData: [],
          }),
        "Mock WISPA did not receive analytics action 'VIEW_CONTACT_DETAILS' request"
      );

      expect(await contactPane.isVisible()).toBe(true);
      expect(await chatPane.isVisible()).toBe(false);

      await UI.auditAccessibility();
    });
  },
};
