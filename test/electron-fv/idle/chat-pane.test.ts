// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/* eslint-disable jest/no-export */
/**
 * Tests to be carried out when the app is idle
 */
import { protoGandalf } from "shared/mocks/mock-contacts";
import { protoChatWithGandalf } from "shared/mocks/mock-chats";

import { toLocalTimeString } from "test/electron-fv/utils/date-formatter";
import { Application } from "spectron";
import { MockWispa } from "../../utils/mock-wispa";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UI } from "../utils/interface";

export const chatPane = {
  title: "Chat Pane",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();
      mockWispa.data.contacts = [protoGandalf];
      mockWispa.data.chats = [protoChatWithGandalf];

      await app.client.refresh();
      await UI.midbar.contactList.waitForSomeContacts(1);
    });

    it("Loads chat history when selecting a contact", async () => {
      const chatPane = UI.rightbar.chatPane;

      const gandalfContact = (await UI.midbar.contactList.contacts())[0];
      await gandalfContact.click();
      await chatPane.waitForSomeMessages(3);

      const messages = await chatPane.messages();

      expect(await messages[0].body()).toBe(protoChatWithGandalf.message[2].content);
      expect(await messages[0].time()).toBe(
        toLocalTimeString(protoChatWithGandalf.message[2].timestamp)
      );
      expect(await messages[1].body()).toBe(protoChatWithGandalf.message[1].content);
      expect(await messages[1].time()).toBe(
        toLocalTimeString(protoChatWithGandalf.message[1].timestamp)
      );
      expect(await messages[2].body()).toBe(protoChatWithGandalf.message[0].content);
      expect(await messages[2].time()).toBe(
        toLocalTimeString(protoChatWithGandalf.message[0].timestamp)
      );
    });

    it("Loads chat history when selecting a chat", async () => {
      const chatPane = UI.rightbar.chatPane;

      await UI.sidebar.chatsButton.click();
      await UI.midbar.chatList.waitForSomeChats(1);

      const gandalfChat = (await UI.midbar.chatList.chats())[0];
      await gandalfChat.click();
      await chatPane.waitForSomeMessages(2);

      const messages = await chatPane.messages();

      expect(await messages[0].body()).toBe(protoChatWithGandalf.message[2].content);
      expect(await messages[0].time()).toBe(
        toLocalTimeString(protoChatWithGandalf.message[2].timestamp)
      );
      expect(await messages[1].body()).toBe(protoChatWithGandalf.message[1].content);
      expect(await messages[1].time()).toBe(
        toLocalTimeString(protoChatWithGandalf.message[1].timestamp)
      );
      expect(await messages[2].body()).toBe(protoChatWithGandalf.message[0].content);
      expect(await messages[2].time()).toBe(
        toLocalTimeString(protoChatWithGandalf.message[0].timestamp)
      );
    });
  },
};
