// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Tests to be carried out when the app is idle
 */

import { protoBilbo, protoPeter, protoGandalf } from "shared/mocks/mock-contacts";
import { protoChatWithGandalf, protoChatWithPeter } from "shared/mocks/mock-chats";
import { mutableCloneDeep } from "shared/mocks/ts-utils";

import { Key } from "test/electron-fv/utils/interface";
import { Application } from "spectron";
import { MockWispa } from "../../utils/mock-wispa";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UI } from "../utils/interface";

export const recentChatsList = {
  title: "Recent Chats List",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();

      const protoGandalfTyping = mutableCloneDeep(protoGandalf);
      protoGandalfTyping.isTyping = true;
      mockWispa.data.contacts = [protoBilbo, protoPeter, protoGandalfTyping];
      mockWispa.data.chats = [protoChatWithGandalf, protoChatWithPeter];

      await app.client.refresh();
      await UI.midbar.contactList.waitForSomeContacts(2);
    });

    it("has the correct labels", async () => {
      await UI.sidebar.chatsButton.click();
      await UI.midbar.chatList.waitForSomeChats(2);

      const [peter, gandalf] = await UI.midbar.chatList.chats();

      expect(await gandalf.getAriaLabel()).toBe(
        "Gandalf The ⚪, In a call, Watching availability, He always arrives precisely when he means to!, 6/19/20, "
      );
      expect(await peter.getAriaLabel()).toBe(
        "Peter Parker, Offline, " +
          "I'm just your friendly neighborhood spiderman".repeat(100) +
          ", 1/27/21, "
      );
    });

    it("Displays the most recent message of each chat", async () => {
      await UI.sidebar.chatsButton.click();
      await UI.midbar.chatList.waitForSomeChats(2);

      const peterChat = (await UI.midbar.chatList.chats())[0];
      expect(await peterChat.messagePreview()).toBe(protoChatWithPeter.message[1].content);
      expect(await peterChat.name()).toBe("Peter Parker");
    });

    it("Displays 'Typing...' when the contact of the chat is typing", async () => {
      await UI.sidebar.chatsButton.click();
      await UI.midbar.chatList.waitForSomeChats(2);

      const gandalfChat = (await UI.midbar.chatList.chats())[1];
      expect(await gandalfChat.messagePreview()).toBe("Typing...");
      expect(await gandalfChat.name()).toBe("Gandalf The ⚪");
    });
  },
};

/**
 * This component digs into the behaviour of the ArrowControl used for the contacts list.  These are
 * FV tests rather than UT due to the interactions between the control and other elements
 * meaning that we'd need more than a shallow render to test.
 */
export const keyboardNavigation = {
  title: "Keyboard navigation",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    // Need a 3rd chat for this suite, so create it and a fake contact to have it with
    const fakeGandalf = mutableCloneDeep(protoGandalf);
    fakeGandalf.identity.lastName = "The Fake";
    fakeGandalf.uid = "fake-gandalf";
    fakeGandalf.im.value = "fake.gandalf@fbi.com";

    const protoChatWithFakeGandalf = mutableCloneDeep(protoChatWithGandalf);
    protoChatWithFakeGandalf.uid = fakeGandalf.im.value;
    protoChatWithFakeGandalf.participant[0] = fakeGandalf.im;
    protoChatWithFakeGandalf.message.forEach((message) => (message.recipient = fakeGandalf.im));

    beforeEach(async () => {
      mockWispa.reset();
      mockWispa.data.contacts = [protoPeter, protoBilbo, protoGandalf, fakeGandalf];
      mockWispa.data.chats = [protoChatWithGandalf, protoChatWithPeter, protoChatWithFakeGandalf];

      await app.client.refresh();
      await UI.midbar.contactList.waitForSomeContacts(3);
    });

    it("rightbar updates when selecting 1st chat", async () => {
      await UI.sidebar.chatsButton.click();
      await UI.midbar.chatList.waitForSomeChats(2);
      const [peter] = await UI.midbar.chatList.chats();

      // Tab to the 1st chat
      // Enter to 'click'
      await UI.midbar.searchBar.input.waitForActive();
      await UI.pressKey([Key.TAB]);
      await UI.midbar.dialpad.waitForActive();
      await UI.pressKey([Key.TAB]);
      await peter.waitForActive();
      await UI.pressKey([Key.ENTER]);

      await UI.rightbar.contentHeaderPanel.expectWillHavePresence("Offline");
      await UI.rightbar.contentHeaderPanel.expectWillHaveName("Peter Parker");
    });

    it("rightbar updates when selecting 1st chat via Key.HOME", async () => {
      await UI.sidebar.chatsButton.click();
      await UI.midbar.chatList.waitForSomeChats(2);
      const [peterChat, , fakeGandalfChat] = await UI.midbar.chatList.chats();

      // Tab to the 1st chat, then away and back using UP and Key.HOME,
      // Enter to 'click'
      await UI.midbar.searchBar.input.waitForActive();
      await UI.pressKey([Key.TAB]);
      await UI.midbar.dialpad.waitForActive();
      await UI.pressKey([Key.TAB]);
      await peterChat.waitForActive();
      await UI.pressKey([Key.ARROW_UP]);
      await fakeGandalfChat.waitForActive();
      await UI.pressKey([Key.HOME]);
      await peterChat.waitForActive();
      await UI.pressKey([Key.ENTER]);

      await UI.rightbar.contentHeaderPanel.expectWillHavePresence("Offline");
      await UI.rightbar.contentHeaderPanel.expectWillHaveName("Peter Parker");
    });

    it("rightbar updates when selecting 1st chat via Key.PAGE_UP", async () => {
      await UI.sidebar.chatsButton.click();
      await UI.midbar.chatList.waitForSomeChats(2);
      const [peterChat, , fakeGandalfChat] = await UI.midbar.chatList.chats();

      // Tab to the 1st chat, then away and back using UP (cycle round) and Key.PAGE_UP,
      // Enter to 'click'
      await UI.midbar.searchBar.input.waitForActive();
      await UI.pressKey([Key.TAB]);
      await UI.midbar.dialpad.waitForActive();
      await UI.pressKey([Key.TAB]);
      await peterChat.waitForActive();
      await UI.pressKey([Key.ARROW_UP]);
      await fakeGandalfChat.waitForActive();
      await UI.pressKey([Key.PAGE_UP]);
      await peterChat.waitForActive();
      await UI.pressKey([Key.ENTER]);

      await UI.rightbar.contentHeaderPanel.expectWillHavePresence("Offline");
      await UI.rightbar.contentHeaderPanel.expectWillHaveName("Peter Parker");
    });

    it("rightbar updates when selecting last chat via Key.END", async () => {
      await UI.sidebar.chatsButton.click();
      await UI.midbar.chatList.waitForSomeChats(2);
      const [peterChat, , fakeGandalfChat] = await UI.midbar.chatList.chats();

      // Tab to the 1st chat, then Key.END to the last
      // Enter to 'click'
      await UI.midbar.searchBar.input.waitForActive();
      await UI.pressKey([Key.TAB]);
      await UI.midbar.dialpad.waitForActive();
      await UI.pressKey([Key.TAB]);
      await peterChat.waitForActive();
      await UI.pressKey([Key.END]);
      await fakeGandalfChat.waitForActive();
      await UI.pressKey([Key.ENTER]);

      await UI.rightbar.contentHeaderPanel.expectWillHavePresence("In a call - 🧙‍♂️ 🔥 👹 ✔ ਅਨਾਨਾਸ");
      await UI.rightbar.contentHeaderPanel.expectWillHaveName("Gandalf The Fake");
    });

    it("rightbar updates when selecting last chat via Key.PAGE_DOWN", async () => {
      await UI.sidebar.chatsButton.click();
      await UI.midbar.chatList.waitForSomeChats(2);
      const [peterChat, , fakeGandalfChat] = await UI.midbar.chatList.chats();

      // Tab to the 1st chat, then Key.PAGE_DOWN to the last
      // Enter to 'click'
      await UI.midbar.searchBar.input.waitForActive();
      await UI.pressKey([Key.TAB]);
      await UI.midbar.dialpad.waitForActive();
      await UI.pressKey([Key.TAB]);
      await peterChat.waitForActive();
      await UI.pressKey([Key.PAGE_DOWN]);
      await fakeGandalfChat.waitForActive();
      await UI.pressKey([Key.ENTER]);

      await UI.rightbar.contentHeaderPanel.expectWillHavePresence("In a call - 🧙‍♂️ 🔥 👹 ✔ ਅਨਾਨਾਸ");
      await UI.rightbar.contentHeaderPanel.expectWillHaveName("Gandalf The Fake");
    });

    it("rightbar updates when selecting last chat via UP", async () => {
      await UI.sidebar.chatsButton.click();
      await UI.midbar.chatList.waitForSomeChats(2);
      const [peterChat, , fakeGandalfChat] = await UI.midbar.chatList.chats();

      // Tab to the 1st chat, then UP (cycle round) to the last
      // Enter to 'click'
      await UI.midbar.searchBar.input.waitForActive();
      await UI.pressKey([Key.TAB]);
      await UI.midbar.dialpad.waitForActive();
      await UI.pressKey([Key.TAB]);
      await peterChat.waitForActive();
      await UI.pressKey([Key.ARROW_UP]);
      await fakeGandalfChat.waitForActive();
      await UI.pressKey([Key.ENTER]);

      await UI.rightbar.contentHeaderPanel.expectWillHavePresence("In a call - 🧙‍♂️ 🔥 👹 ✔ ਅਨਾਨਾਸ");
      await UI.rightbar.contentHeaderPanel.expectWillHaveName("Gandalf The Fake");
    });

    it("rightbar updates when selecting 2nd chat via DOWN", async () => {
      await UI.sidebar.chatsButton.click();
      await UI.midbar.chatList.waitForSomeChats(2);
      const [peterChat, gandalfChat] = await UI.midbar.chatList.chats();

      // Tab to the 1st chat, then DOWN to the 2nd
      // Enter to 'click'
      await UI.midbar.searchBar.input.waitForActive();
      await UI.pressKey([Key.TAB]);
      await UI.midbar.dialpad.waitForActive();
      await UI.pressKey([Key.TAB]);
      await peterChat.waitForActive();
      await UI.pressKey([Key.ARROW_DOWN]);
      await gandalfChat.waitForActive();
      await UI.pressKey([Key.ENTER]);

      await UI.rightbar.contentHeaderPanel.expectWillHavePresence("In a call - 🧙‍♂️ 🔥 👹 ✔ ਅਨਾਨਾਸ");
      await UI.rightbar.contentHeaderPanel.expectWillHaveName("Gandalf The ⚪");
    });
  },
};
