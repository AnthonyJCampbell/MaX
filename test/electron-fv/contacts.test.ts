// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Contacts related Electron FV tests
 */

import * as pb from "protobuf-wispa";

import { Key } from "test/electron-fv/utils/interface";
import { formatPhoneNumber } from "components/utils/phone-formatter";
import { PresenceState, CallStatus, MessageType } from "shared/types";

import { protoBilbo, protoPeter, protoGandalf, protoNoName } from "shared/mocks/mock-contacts";
import { protoInboundHistoricCall } from "shared/mocks/mock-historic-calls";
import { protoChatWithNewMessageToGandalf } from "shared/mocks/mock-chats";
import { protoGandalfCall } from "shared/mocks/mock-active-calls";
import { mutableCloneDeep } from "shared/mocks/ts-utils";

import { expectWithinTimeout, waitForCondition } from "test/utils/utils";
import { Application } from "spectron";
import { MockWispa } from "../utils/mock-wispa";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UI } from "./utils/interface";
import { toLocalDateTimeString, toLocalTimeString } from "./utils/date-formatter";

export const contactList = {
  title: "Contact list",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();
      await app.client.refresh();
    });

    it("deletes a non-empty contact", async () => {
      mockWispa.data.contacts = [protoBilbo, protoPeter, protoGandalf];
      mockWispa.sendContactsList();
      await UI.midbar.contactList.waitForSomeContacts(3);

      mockWispa.deleteContact(protoPeter.uid);

      await UI.midbar.contactList.expectToBe(["Bilbo Baggins", "Gandalf The ⚪"]);
    });

    it("does not add an empty contact", async () => {
      mockWispa.data.contacts = [protoBilbo];
      mockWispa.sendContactsList();
      await UI.midbar.contactList.waitForSomeContacts(1);

      mockWispa.sendEmptyContact();
      await UI.midbar.contactList.expectToBe(["Bilbo Baggins"]);
    });

    it("does not delete an empty contact", async () => {
      mockWispa.data.contacts = [protoBilbo];
      mockWispa.sendContactsList();
      await UI.midbar.contactList.waitForSomeContacts(1);

      mockWispa.deleteEmptyContact();
      await UI.midbar.contactList.expectToBe(["Bilbo Baggins"]);
    });

    it("updates a non-empty contact", async () => {
      const gandalf = mutableCloneDeep(protoGandalf);
      mockWispa.data.contacts = [protoBilbo, protoPeter, gandalf];
      mockWispa.sendContactsList();
      await UI.midbar.contactList.waitForSomeContacts(3);

      await UI.midbar.contactList.expectToBe(["Bilbo Baggins", "Gandalf The ⚪", "Peter Parker"]);

      await UI.midbar.contactList.expectPresenceToBe([
        "Online - I'm Going On An Adventure!",
        "In a call - 🧙‍♂️ 🔥 👹 ✔ ਅਨਾਨਾਸ",
        "Offline",
      ]);

      gandalf.identity.lastName = "The White";
      gandalf.presence.customStatus = "";
      mockWispa.sendContactUid(gandalf.uid);

      await UI.midbar.contactList.expectToBe([
        "Bilbo Baggins",
        "Gandalf The White",
        "Peter Parker",
      ]);
      await UI.midbar.contactList.expectPresenceToBe([
        "Online - I'm Going On An Adventure!",
        "In a call",
        "Offline",
      ]);

      gandalf.presence.customStatus = "You Shall Not Pass!";
      mockWispa.sendContactUid(gandalf.uid);

      await UI.midbar.contactList.expectToBe([
        "Bilbo Baggins",
        "Gandalf The White",
        "Peter Parker",
      ]);
      await UI.midbar.contactList.expectPresenceToBe([
        "Online - I'm Going On An Adventure!",
        "In a call - You Shall Not Pass!",
        "Offline",
      ]);
    });
  },
};

export const contactUpdates = {
  title: "Contact updates",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();
      mockWispa.data.contacts = [protoBilbo, protoPeter, protoGandalf, protoNoName];

      await app.client.refresh();
      await UI.midbar.contactList.waitForSomeContacts(4);
    });

    it("remembers focus when contacts update", async () => {
      const [bilbo, gandalf, noName, peter] = await UI.midbar.contactList.contacts();
      await bilbo.waitForVisible();
      await gandalf.waitForVisible();
      await noName.waitForVisible();
      await peter.waitForVisible();

      // Arrow down to the desired contact
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
      await bilbo.waitForActive();
      await UI.pressKey([Key.ARROW_DOWN]);
      await gandalf.waitForActive();
      await UI.pressKey([Key.ARROW_DOWN]);
      await noName.waitForActive();

      // Now receive contact updates
      mockWispa.deleteContact(protoBilbo.uid);
      await UI.midbar.contactList.expectToBe(["Gandalf The ⚪", "No name", "Peter Parker"]);

      // We should still be on the same contact, even though another has gone.
      await expectWithinTimeout(
        async () => await noName.isActive(),
        "Focus is not the same within timeout"
      );
    });
  },
};

export const notifyWhenAvailable = {
  title: "Notify when available ",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    let contact: pb.contacts.Contact;

    beforeEach(async () => {
      // Start with a new clone
      contact = mutableCloneDeep(protoGandalf);
      contact.notifyWhenAvailable = false;
      if (contact.presence) contact.presence.state = PresenceState.AWAY;

      mockWispa.reset();
      mockWispa.data.contacts = [contact];
      await app.client.refresh();
      mockWispa.sendContactsList();
      await UI.midbar.contactList.waitForSomeContacts(1);

      const contacts = await UI.midbar.contactList.contacts();
      await contacts[0].click();
      await UI.rightbar.contentHeaderPanel.expectWillHaveName("Gandalf The ⚪");
    });

    it("button updated after receiving contact update", async () => {
      const checkTooltip = async (on: boolean): Promise<void> => {
        const indicatorText = on ? "Stop watching availability" : "Notify when available";
        await UI.rightbar.contentHeaderPanel.notifyButton.hover();

        await expectWithinTimeout(async () => {
          // Wrap `getText` in a try/catch statement so that we don't error out if the tooltip does't
          // exist yet. It's not sufficient to wait for the tooltip to exist and then try to get its
          // text as if its the tooltip from the previous button then it's very possible for it to
          // disappear in between checking that it is shown and getting its text.
          try {
            return (await UI.tooltip.getText()) === indicatorText;
          } catch (err) {
            return false;
          }
        }, `Notify when available tooltip did not display text "${indicatorText}"`);
      };

      await checkTooltip(false);

      // Contact is updated on the backend, sending the data over via WISPA
      contact.notifyWhenAvailable = true;
      mockWispa.sendContactUid(contact.uid);

      await checkTooltip(true);
    });

    it("more menu updated after receiving contact update", async () => {
      const moreButton = UI.rightbar.contentHeaderPanel.defaultMoreButton;
      await moreButton.click();

      await expectWithinTimeout(
        async () => (await moreButton.menu.rowTexts()).includes("Notify when available"),
        "More menu row did not update to 'Notify when available"
      );

      // Contact is updated on the backend, sending the data over via WISPA
      contact.notifyWhenAvailable = true;
      mockWispa.sendContactUid(contact.uid);

      await expectWithinTimeout(
        async () => (await moreButton.menu.rowTexts()).includes("Stop watching availability"),
        "More menu row did not update to 'Stop watching availability"
      );
    });

    it("sends contact update request when notify when available button is clicked ", async () => {
      await UI.rightbar.contentHeaderPanel.notifyButton.click();

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("contacts", "update", {
            uid: contact.uid,
            notifyWhenAvailable: true,
            isTyping: false,
            phone: [],
            postal: [],
            email: [],
            identity: {
              firstName: "",
              lastName: "",
              nickname: "",
              jobTitle: "",
              organisation: "",
              profilePicture: Buffer.from(""),
            },
          }),
        "Mock WISPA did not receive update contact request"
      );
    });

    it("sends contact update request when the 'Notify when available' button in more menu is clicked ", async () => {
      const moreButton = UI.rightbar.contentHeaderPanel.defaultMoreButton;
      await moreButton.click();
      await expectWithinTimeout(
        async () => (await moreButton.menu.isVisible()) || false,
        "More button menu did not become visible"
      );
      expect(await moreButton.menu.rowTexts()).toEqual([
        "View chat history",
        "Add to favourites",
        "Notify when available",
        "Edit contact",
        "Delete contact",
      ]);

      const menuRows = await moreButton.menu.rows();
      await menuRows[2].click();

      await expectWithinTimeout(() => {
        return mockWispa.hasReceivedRequest("contacts", "update", {
          uid: contact.uid,
          notifyWhenAvailable: true,
          isTyping: false,
          phone: [],
          postal: [],
          email: [],
          identity: {
            firstName: "",
            lastName: "",
            nickname: "",
            jobTitle: "",
            organisation: "",
            profilePicture: Buffer.from(""),
          },
        });
      }, "Mock WISPA did not receive update contact request");
    });
  },
};

export const favourites = {
  title: "Favourites",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    let contact: pb.contacts.Contact;

    beforeEach(async () => {
      // Start with a new clone
      contact = mutableCloneDeep(protoGandalf);
      contact.isFavourite = false;
      if (contact.presence) contact.presence.state = PresenceState.AWAY;

      mockWispa.reset();
      mockWispa.data.contacts = [contact];
      await app.client.refresh();
      mockWispa.sendContactsList();
      await UI.midbar.contactList.waitForSomeContacts(1);

      const contacts = await UI.midbar.contactList.contacts();
      await contacts[0].click();
      await UI.rightbar.contentHeaderPanel.expectWillHaveName("Gandalf The ⚪");
    });

    it("favourite button should update when add/remove as favourite", async () => {
      const checkTooltip = async (on: boolean): Promise<void> => {
        const indicatorText = on ? "Remove from favourites" : "Add to favourites";

        await UI.rightbar.contentHeaderPanel.favouritesButton.hover();

        await expectWithinTimeout(
          async () => await UI.tooltip.isVisible(),
          "Add to favourites isn't visible"
        );

        await expectWithinTimeout(
          async () => (await UI.tooltip.getText()) === indicatorText,
          `Tooltip did not display ${indicatorText}`
        );
      };

      await checkTooltip(false);

      contact.isFavourite = true;
      mockWispa.sendContactUid(contact.uid);

      await checkTooltip(true);
    });

    it("more menu updated after receiving favourite contact update", async () => {
      const moreButton = UI.rightbar.contentHeaderPanel.defaultMoreButton;
      await moreButton.click();

      await expectWithinTimeout(
        async () => (await moreButton.menu.rowTexts()).includes("Add to favourites"),
        "More menu row did not show 'Add to favourites"
      );

      contact.isFavourite = true;
      mockWispa.sendContactUid(contact.uid);

      await expectWithinTimeout(
        async () => (await moreButton.menu.rowTexts()).includes("Remove from favourites"),
        "More menu row did not show 'Remove from favourites'"
      );
    });

    it("sends contact update request when the 'Add to favourites' button is clicked ", async () => {
      await UI.rightbar.contentHeaderPanel.favouritesButton.click();

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("contacts", "update", {
            uid: contact.uid,
            isFavourite: true,
            isTyping: false,
            phone: [],
            postal: [],
            email: [],
            identity: {
              firstName: "",
              lastName: "",
              nickname: "",
              jobTitle: "",
              organisation: "",
              profilePicture: Buffer.from(""),
            },
          }),
        "Mock WISPA did not receive update contact request"
      );
    });
  },
};

export const contactDetails = {
  title: "Contact details ",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();
      mockWispa.data.contacts = [protoGandalf, protoPeter];
      mockWispa.data.historicCalls = [protoInboundHistoricCall];
      await app.client.refresh();
      mockWispa.sendCallHistoryList();
      mockWispa.sendContactsList();
      await UI.midbar.contactList.waitForSomeContacts(2);
    });

    it("contact pane has correct contact details ", async () => {
      const contacts = await UI.midbar.contactList.contacts();
      await contacts[1].click();
      await UI.rightbar.contentHeaderPanel.expectWillHaveName("Peter Parker");

      await UI.rightbar.contactDetailsTabButton.click();
      await expectWithinTimeout(
        async () => await UI.rightbar.contactPane.isVisible(),
        "Contact pane did not become visible"
      );

      const contactPane = UI.rightbar.contactPane;
      expect(await contactPane.nickname.getText()).toEqual(protoPeter.identity.nickname);
      expect(await contactPane.jobTitle.getText()).toEqual(protoPeter.identity.jobTitle);
      expect(await contactPane.company.getText()).toEqual(protoPeter.identity.organisation);
      // TODO: Instead of hard coding the values, use prettyContactDetailType
      // and convertToRelativeTime from common.js
      expect(await contactPane.phone.getPhoneNumbers()).toContainEqual({
        value: formatPhoneNumber(protoPeter.phone[0].value, "GB"),
        type: "Other",
      });
      expect(await contactPane.email.getEmails()).toContainEqual(protoPeter.email[0].address);
      expect(await contactPane.email.getEmails()).toContainEqual(protoPeter.email[1].address);
      expect(await contactPane.address.getAddresses()).toContainEqual({
        value: protoPeter.postal[0].line.join(", "),
        type: "Home",
      });
      const histories = await contactPane.history.getHistory();
      expect(histories).toHaveLength(1);
      expect(histories[0]).toEqual({
        type: "Incoming call (Other)",
        date: toLocalDateTimeString(protoInboundHistoricCall.datetimeStarted),
        time: "34:35:32s",
      });
    });

    it("the email is a clickable href ", async () => {
      const contacts = await UI.midbar.contactList.contacts();
      await contacts[1].click();
      await UI.rightbar.contentHeaderPanel.expectWillHaveName("Peter Parker");

      await UI.rightbar.contactDetailsTabButton.click();
      await expectWithinTimeout(
        async () => await UI.rightbar.contactPane.isVisible(),
        "Contact pane did not become visible"
      );

      const email = UI.rightbar.contactPane.email;
      expect(await email.getEmailHref()).toEqual(`mailto:${protoPeter.email[0].address}`);
    });

    it("the phone number has a clickable button to SMS the contact which brings up the SMS conversation view", async () => {
      const contacts = await UI.midbar.contactList.contacts();

      const message = "Hello";
      const chatToSend = mutableCloneDeep(protoChatWithNewMessageToGandalf);
      chatToSend.uid = protoGandalf.phone[0].value;
      chatToSend.message[0].content = message;
      chatToSend.message[0].recipient = protoGandalf.phone[0];
      chatToSend.message[0].type = MessageType.SMS;

      mockWispa.createDataStore.chats = [chatToSend];

      await contacts[0].click();
      await UI.rightbar.contentHeaderPanel.expectWillHaveName("Gandalf The ⚪");

      await UI.rightbar.contactDetailsTabButton.click();
      await expectWithinTimeout(
        async () => await UI.rightbar.contactPane.isVisible(),
        "Contact pane did not become visible"
      );

      const firstPhoneNumberSMSButton = UI.rightbar.contactPane.phone.getNthSMSButton(1);
      await firstPhoneNumberSMSButton.click();

      await expectWithinTimeout(
        async () => await UI.rightbar.chatPane.isVisible(),
        "Contact pane did not become visible"
      );

      const chatPane = UI.rightbar.chatPane;
      await chatPane.messageBox.sendMessage(message);

      // Mock Wispa will receive a complete ChatMessage with only the relevant parts (recipient and
      // content) filled in. Use this template to flesh out the rest of the message.
      // TODO - When "shared/types" has a "ChatMessage" class might be able to replace this with
      // `new ChatMessage()`
      const chatMessageTemplate = {
        uid: "",
        timestamp: "",
        type: MessageType.SMS,
        edited: false,
        read: false,
      };
      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("messaging", "create", {
            ...chatMessageTemplate,
            recipient: { value: protoGandalf.phone[0].value },
            content: message,
          }),
        "Mock Wispa did not receive a request to create a new chat message"
      );

      await chatPane.waitForSomeMessages(1, 30000);

      const messages = await chatPane.messages();
      expect(await messages[0].body()).toContain(chatToSend.message[0].content);
      expect(await messages[0].body()).toContain("SMS");
      expect(await messages[0].time()).toBe(toLocalTimeString(chatToSend.message[0].timestamp));
    });

    it("keyboard navigating to buttons ", async () => {
      const [gandalf, peter] = await UI.midbar.contactList.contacts();
      await gandalf.waitForVisible();
      await peter.waitForVisible();
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
      await gandalf.waitForActive();
      await UI.pressKey([Key.ARROW_DOWN]);
      await peter.waitForActive();
      await UI.pressKey([Key.ENTER]);
      await UI.rightbar.chatPane.waitForVisible();
      await UI.rightbar.contentHeaderPanel.expectWillHaveName("Peter Parker");
      await UI.pressKey([Key.SHIFT, Key.TAB]);
      await UI.pressKey([Key.SHIFT, Key.TAB]);
      await UI.rightbar.contactDetailsTabButton.waitForActive();
      await UI.pressKey([Key.ENTER]);
      await UI.rightbar.contactPane.waitForVisible();
      await UI.pressKey([Key.TAB]);
      await UI.rightbar.contactPane.phone.getNthPhoneButton(1).waitForActive();
      await UI.pressKey([Key.TAB]);
      await UI.rightbar.contactPane.phone.getNthSMSButton(1).waitForActive();
      await UI.pressKey([Key.TAB]);
      await UI.rightbar.contactPane.email.getNthEmailLink(1).waitForActive();
    });

    it("navigating to a phone number and hitting enter calls the number ", async () => {
      const [gandalf, peter] = await UI.midbar.contactList.contacts();
      await gandalf.waitForVisible();
      await peter.waitForVisible();
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
      await gandalf.waitForActive();
      await UI.pressKey([Key.ENTER]);
      await UI.rightbar.chatPane.waitForVisible();
      await UI.rightbar.contentHeaderPanel.expectWillHaveName("Gandalf The ⚪");
      await UI.pressKey([Key.SHIFT, Key.TAB]);
      await UI.pressKey([Key.SHIFT, Key.TAB]);
      await UI.rightbar.contactDetailsTabButton.waitForActive();
      await UI.pressKey([Key.ENTER]);
      await UI.rightbar.contactPane.waitForVisible();
      await UI.pressKey([Key.TAB]);
      await UI.rightbar.contactPane.phone.getNthPhoneButton(1).waitForActive();

      mockWispa.createDataStore.activeCalls = [protoGandalfCall];

      await UI.pressKey([Key.ENTER]);
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

export const contactDetailsNumberFormatting = {
  title: "Contact details phone number display formatting",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();
    });

    const setupRegionAndContacts = async (
      easRegion: string,
      contacts: pb.contacts.Contact[]
    ): Promise<boolean> => {
      const generalSettings = mockWispa.data.settings.general
        ? mutableCloneDeep(mockWispa.data.settings.general)
        : pb.settings.GeneralSettings.fromPartial({});
      generalSettings.easRegion = easRegion;

      mockWispa.data.settings = {
        ...mockWispa.data.settings,
        general: generalSettings,
      };
      mockWispa.data.contacts = contacts;

      await app.client.refresh();

      mockWispa.sendSettings();
      mockWispa.sendContactsList();

      await UI.midbar.contactList.waitForSomeContacts(contacts.length);

      return true;
    };

    it("Should format non-british and non-american phone numbers", async () => {
      const protoBrazillianGandalf = mutableCloneDeep(protoGandalf);
      protoBrazillianGandalf.phone[0].value = "19987654321";
      protoBrazillianGandalf.phone[1].value = "1934567890";

      await expectWithinTimeout(
        async () => setupRegionAndContacts("BR", [protoBrazillianGandalf]),
        "It failed to setup with easRegion='BR' and with protoBrazillianGandalf as contact"
      );

      const contacts = await UI.midbar.contactList.contacts();
      await contacts[0].click();
      await UI.rightbar.contentHeaderPanel.expectWillHaveName("Gandalf The ⚪");

      await UI.rightbar.contactDetailsTabButton.click();
      await expectWithinTimeout(
        async () => await UI.rightbar.contactPane.isVisible(),
        "Contact pane did not become visible"
      );

      const contactPane = UI.rightbar.contactPane;
      const phoneNumbers = await contactPane.phone.getPhoneNumbers();
      expect(phoneNumbers[0]).toEqual({
        value: formatPhoneNumber(protoBrazillianGandalf.phone[0], "BR"),
        type: "Mobile",
      });
      expect(phoneNumbers[1]).toEqual({
        value: formatPhoneNumber(protoBrazillianGandalf.phone[1], "BR"),
        type: "Fax",
      });
    });

    it("Should handle when wispa does not return an easRegion", async () => {
      await expectWithinTimeout(
        async () => setupRegionAndContacts("", [mutableCloneDeep(protoGandalf)]),
        'It failed to setup with easRegion="" and with protoGandalf as contact'
      );

      const contacts = await UI.midbar.contactList.contacts();
      await contacts[0].click();
      await UI.rightbar.contentHeaderPanel.expectWillHaveName("Gandalf The ⚪");

      await UI.rightbar.contactDetailsTabButton.click();
      await expectWithinTimeout(
        async () => await UI.rightbar.contactPane.isVisible(),
        "Contact pane did not become visible"
      );

      const contactPane = UI.rightbar.contactPane;
      const phoneNumbers = await contactPane.phone.getPhoneNumbers();
      expect(phoneNumbers[0]).toEqual({
        value: protoGandalf.phone[0].value,
        type: "Mobile",
      });
      expect(phoneNumbers[1]).toEqual({
        value: protoGandalf.phone[1].value,
        type: "Fax",
      });
    });
  },
};

export const typingIndicator = {
  title: "Typing indicator",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();
      mockWispa.data.contacts = [protoGandalf, protoPeter];
      await app.client.refresh();

      await UI.midbar.contactList.waitForNContacts(2);
    });

    it('Sends a "Typing Indicator" WISPA request when typing in chat', async () => {
      const messageBox = UI.rightbar.chatPane.messageBox;
      const [, peter] = await UI.midbar.contactList.contacts();
      await peter.click();
      const activeContact = UI.rightbar.contentHeaderPanel.contact;
      await waitForCondition(async () => {
        const activeName = await activeContact.name();
        return activeName.includes("Peter");
      });
      await messageBox.typeMessage("Hello Peter");
      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("contacts", "action", {
            typingIndicator: {
              recipientUid: protoPeter.uid,
              isTyping: true,
            },
          }),
        "Mock WISPA did not receive contacts action 'typingIndicator' request"
      );
    });

    it('Sends a "Typing Indicator" WISPA request when moving away from the contact while typing', async () => {
      const messageBox = UI.rightbar.chatPane.messageBox;
      const [gandalf, peter] = await UI.midbar.contactList.contacts();
      await peter.click();
      const activeContact = UI.rightbar.contentHeaderPanel.contact;
      await waitForCondition(async () => {
        const activeName = await activeContact.name();
        return activeName.includes("Peter");
      });
      await messageBox.typeMessage("Hello Peter");
      await waitForCondition(async () => {
        const contents = await messageBox.contents();
        return contents.includes("Hello Peter");
      });
      await gandalf.click();
      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("contacts", "action", {
            typingIndicator: {
              recipientUid: protoPeter.uid,
              isTyping: false,
            },
          }),
        "Mock WISPA did not receive contacts action 'typingIndicator' request"
      );
    });
  },
};

export const contactAddEditDelete = {
  title: "Contact Add/Edit/Delete",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();
      mockWispa.data.contacts = [protoGandalf, protoPeter];
      await app.client.refresh();

      await UI.midbar.contactList.waitForNContacts(2);
    });

    it('Sends a "View Add Contact Window" WISPA request when clicking "Add contact" menu item', async () => {
      await UI.sidebar.addButton.click();
      await waitForCondition(async () => await UI.sidebar.addMenu.isVisible());

      const addMenuRows = await UI.sidebar.addMenu.rows();
      await addMenuRows[2].click();

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("contacts", "action", {
            viewAddContact: {
              contact: {
                uid: "",
                isTyping: false,
                phone: [],
                postal: [],
                email: [],
              },
            },
          }),
        "Mock WISPA did not receive contacts action 'viewAddContact' request"
      );
    });

    it('Sends a "View Add Contact Window" WISPA request when choosing "Add contact" menu item via keyboard navigation', async () => {
      await UI.pressKey([Key.TAB]);
      await UI.sidebar.profileButton.waitForActive();
      await UI.pressKey([Key.TAB]);
      await UI.sidebar.addButton.waitForActive();

      await UI.pressKey([Key.ENTER]);
      await waitForCondition(async () => {
        return await UI.sidebar.addMenu.isVisible();
      });

      const addMenuRows = await UI.sidebar.addMenu.rows();

      await addMenuRows[0].waitForActive();
      await UI.pressKey([Key.ARROW_DOWN]);
      await addMenuRows[1].waitForActive();
      await UI.pressKey([Key.ARROW_DOWN]);
      await addMenuRows[2].waitForActive();
      await UI.pressKey([Key.ENTER]);

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("contacts", "action", {
            viewAddContact: {
              contact: {
                uid: "",
                isTyping: false,
                phone: [],
                postal: [],
                email: [],
              },
            },
          }),
        "Mock WISPA did not receive contacts action 'viewAddContact' request"
      );
    });

    // This test is skipped as something about the docking of the in-call window makes it flakey.
    // This is okay since we're expecting to do away with the in-call window until GA anyway
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('Sends a "View Add Contact Window" WISPA request with data when clicking "Add as a contact" button', async () => {
      mockWispa.createDataStore.activeCalls = [protoGandalfCall];
      await app.client.refresh();

      const protoNonContactCurrent = mutableCloneDeep(protoGandalfCall);
      protoNonContactCurrent.status = CallStatus.CURRENT;
      protoNonContactCurrent.remoteParty = "11111111111";

      mockWispa.data.activeCalls = [protoNonContactCurrent];
      mockWispa.sendActiveCall(protoNonContactCurrent.uid);

      await expectWithinTimeout(
        async () => (await app.client.getWindowCount()) === 2,
        "In call window did not appear"
      );

      await app.client.windowByIndex(1);
      await UI.inCallFrame.dockButton.click();

      await app.client.windowByIndex(0);
      await expectWithinTimeout(
        async () => (await UI.rightbar.contentHeaderPanel.isInCall()) === true,
        "In call header panel was not displayed"
      );

      const contactPane = UI.rightbar.contactPane;
      await expectWithinTimeout(
        async () => await contactPane.addAsAContactButton.isVisible(),
        "Add as contact button did not become visible"
      );

      await contactPane.addAsAContactButton.click();

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("contacts", "action", {
            viewAddContact: {
              contact: {
                uid: "",
                isTyping: false,
                phone: [
                  {
                    value: "11111111111",
                    type: 2,
                  },
                ],
                postal: [],
                email: [],
              },
            },
          }),
        "Mock WISPA did not receive contacts action 'viewAddContact' request"
      );
    });

    it('Sends a "View Edit Contact Window" WISPA request when clicking the "Edit contact" menu item', async () => {
      const contacts = await UI.midbar.contactList.contacts();

      await contacts[0].click();
      await UI.rightbar.contentHeaderPanel.defaultMoreButton.waitForVisible();

      await UI.rightbar.contentHeaderPanel.defaultMoreButton.click();
      await UI.rightbar.contentHeaderPanel.defaultMoreButton.menu.waitForVisible();

      const moreMenuRows = await UI.rightbar.contentHeaderPanel.defaultMoreButton.menu.rows();
      await moreMenuRows[3].click();

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("contacts", "action", {
            viewEditContact: {
              contact: {
                uid: protoGandalf.uid,
                isTyping: false,
                phone: [],
                postal: [],
                email: [],
              },
            },
          }),
        "Mock WISPA did not receive contacts action 'viewEditContact' request"
      );
    });

    it('Sends a "View Edit Contact Window" WISPA request when choosing the "Edit contact" menu item with keyboard navigation', async () => {
      await UI.pressKey([Key.TAB]);
      const sidebar = UI.sidebar;
      await sidebar.profileButton.waitForActive();
      await UI.pressKey([Key.TAB]);
      await sidebar.addButton.waitForActive();
      await UI.pressKey([Key.TAB]);
      await sidebar.contactsButton.waitForActive();
      await UI.pressKey([Key.TAB]);
      await sidebar.voicemailButton.waitForActive();
      await UI.pressKey([Key.TAB]);
      await sidebar.bugButton.waitForActive();
      await UI.pressKey([Key.TAB]);
      await sidebar.feedbackButton.waitForActive();
      await UI.pressKey([Key.TAB]);

      const midbar = UI.midbar;
      await midbar.searchBar.input.waitForActive();
      await UI.pressKey([Key.TAB]);
      await midbar.dialpad.waitForActive();
      await UI.pressKey([Key.TAB]);

      const contacts = await midbar.contactList.contacts();
      await contacts[0].waitForActive();
      await UI.pressKey([Key.ENTER]);

      const rightbar = UI.rightbar;
      const rightbarMoreMenuButton = rightbar.contentHeaderPanel.defaultMoreButton;
      await rightbarMoreMenuButton.waitForVisible();

      await UI.pressKey([Key.SHIFT, Key.TAB]);
      await UI.pressKey([Key.SHIFT, Key.TAB]);
      await rightbar.contactDetailsTabButton.waitForActive();
      await UI.pressKey([Key.SHIFT, Key.TAB]);
      await rightbar.conversationTabButton.waitForActive();
      await UI.pressKey([Key.SHIFT, Key.TAB]);
      await rightbarMoreMenuButton.waitForActive();

      await UI.pressKey([Key.ENTER]);
      const moreMenu = rightbarMoreMenuButton.menu;
      await moreMenu.waitForVisible();

      const moreMenuRows = await moreMenu.rows();
      await moreMenuRows[0].waitForActive();

      const editContactMenuOptionIndex = 3;
      for (let i = 1; i <= editContactMenuOptionIndex; i++) {
        await UI.pressKey([Key.ARROW_DOWN]);
        await moreMenuRows[i].waitForActive();
      }
      await UI.pressKey([Key.ENTER]);

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("contacts", "action", {
            viewEditContact: {
              contact: {
                uid: protoGandalf.uid,
                isTyping: false,
                phone: [],
                postal: [],
                email: [],
              },
            },
          }),
        "Mock WISPA did not receive contacts action 'viewEditContact' request"
      );
    });

    it('Sends a "Delete" WISPA request when clicking the "Delete contact" menu item for a BG contact', async () => {
      const contacts = await UI.midbar.contactList.contacts();

      await contacts[0].click();
      await UI.rightbar.contentHeaderPanel.defaultMoreButton.waitForVisible();

      await UI.rightbar.contentHeaderPanel.defaultMoreButton.click();
      await UI.rightbar.contentHeaderPanel.defaultMoreButton.menu.waitForVisible();

      const moreMenuRows = await UI.rightbar.contentHeaderPanel.defaultMoreButton.menu.rows();
      await moreMenuRows[4].click();
      await UI.confirmDeletePopup.waitForVisible();

      const confirmDeletePopupButtons = await UI.confirmDeletePopup.buttons();
      await confirmDeletePopupButtons[0].click();

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("contacts", "delete", {
            uid: protoGandalf.uid,
            isTyping: false,
            phone: [],
            postal: [],
            email: [],
            identity: {
              firstName: "",
              lastName: "",
              nickname: "",
              jobTitle: "",
              organisation: "",
              profilePicture: Buffer.from(""),
            },
          }),
        "Mock WISPA did not receive contacts delete request"
      );

      await UI.midbar.contactList.waitForNContacts(1);
    });

    it('Sends a "Delete" WISPA request when choosing the "Delete contact" menu item with keyboard navigation for a personal contact', async () => {
      await UI.pressKey([Key.TAB]);
      const sidebar = UI.sidebar;
      await sidebar.profileButton.waitForActive();
      await UI.pressKey([Key.TAB]);
      await sidebar.addButton.waitForActive();
      await UI.pressKey([Key.TAB]);
      await sidebar.contactsButton.waitForActive();
      await UI.pressKey([Key.TAB]);
      await sidebar.voicemailButton.waitForActive();
      await UI.pressKey([Key.TAB]);
      await sidebar.bugButton.waitForActive();
      await UI.pressKey([Key.TAB]);
      await sidebar.feedbackButton.waitForActive();
      await UI.pressKey([Key.TAB]);

      const midbar = UI.midbar;
      await midbar.searchBar.input.waitForActive();
      await UI.pressKey([Key.TAB]);
      await midbar.dialpad.waitForActive();
      await UI.pressKey([Key.TAB]);

      const contacts = await midbar.contactList.contacts();
      await contacts[0].waitForActive();
      await UI.pressKey([Key.ARROW_DOWN]);
      await contacts[1].waitForActive();
      await UI.pressKey([Key.ENTER]);

      const rightbar = UI.rightbar;
      const rightbarMoreMenuButton = rightbar.contentHeaderPanel.defaultMoreButton;
      await rightbarMoreMenuButton.waitForVisible();

      await UI.pressKey([Key.SHIFT, Key.TAB]);
      await UI.pressKey([Key.SHIFT, Key.TAB]);
      await rightbar.contactDetailsTabButton.waitForActive();
      await UI.pressKey([Key.SHIFT, Key.TAB]);
      await rightbar.conversationTabButton.waitForActive();
      await UI.pressKey([Key.SHIFT, Key.TAB]);
      await rightbarMoreMenuButton.waitForActive();

      await UI.pressKey([Key.ENTER]);
      const moreMenu = rightbarMoreMenuButton.menu;
      await moreMenu.waitForVisible();

      const moreMenuRows = await moreMenu.rows();
      await moreMenuRows[0].waitForActive();

      const deleteContactMenuOptionIndex = 4;
      for (let i = 1; i <= deleteContactMenuOptionIndex; i++) {
        await UI.pressKey([Key.ARROW_DOWN]);
        await moreMenuRows[i].waitForActive();
      }
      await UI.pressKey([Key.ENTER]);
      await expectWithinTimeout(
        async () => await UI.confirmDeletePopup.isVisible(),
        "Confirm delete popup did not appear"
      );

      const confirmDeletePopupButtons = await UI.confirmDeletePopup.buttons();
      await confirmDeletePopupButtons[0].waitForActive();
      await UI.pressKey([Key.ENTER]);

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("contacts", "delete", {
            uid: protoPeter.uid,
            isTyping: false,
            phone: [],
            postal: [],
            email: [],
            identity: {
              firstName: "",
              lastName: "",
              nickname: "",
              jobTitle: "",
              organisation: "",
              profilePicture: Buffer.from(""),
            },
          }),
        "Mock WISPA did not receive contacts delete request",
        3000
      );

      await UI.midbar.contactList.waitForNContacts(1);
    });
  },
};
