// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Messages related Electron FV tests
 */
import dedent from "dedent-js";
import each from "jest-each";

// logging code has not been converted to Typescript yet.
// eslint-disable-next-line
// @ts-ignore
import log from "node-server/main-logging";

import { mutableCloneDeep } from "shared/mocks/ts-utils";
import { protoBilbo, protoGandalf, protoPeter } from "shared/mocks/mock-contacts";
import {
  protoChatWithGandalf,
  protoChatWithPeter,
  protoChatWithNewMessageFromGandalf,
  protoChatWithNewMessageFromPeter,
  protoChatWithNewMessageToGandalf,
} from "shared/mocks/mock-chats";

import { Application } from "spectron";
import { MockWispa } from "../utils/mock-wispa";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UI } from "./utils/interface";
import { Key } from "test/electron-fv/utils/interface";
import { toLocalTimeString } from "test/electron-fv/utils/date-formatter";
import { waitForCondition, expectWithinTimeout } from "test/utils/utils";
import { MessageType } from "shared/types";

export const recentChatsList = {
  title: "Recent Chats List",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();
      mockWispa.data.contacts = [protoGandalf, protoPeter];
      mockWispa.data.chats = [protoChatWithGandalf, protoChatWithPeter];

      await app.client.refresh();
      await UI.midbar.contactList.waitForSomeContacts(1);
    });

    it("Updates and clears when a new message arrives and is viewed", async () => {
      await UI.sidebar.chatsButton.click();
      await UI.midbar.chatList.waitForSomeChats(2);

      // Check the initial state
      const [, gandalfChat] = await UI.midbar.chatList.chats();
      expect(await gandalfChat.messagePreview()).toBe(protoChatWithGandalf.message[2].content);
      expect(await gandalfChat.attendState()).toBe(false);
      expect(await gandalfChat.name()).toBe("Gandalf The ⚪");

      // Receive the new message from WISPA and update the UI
      mockWispa.sendNewMessage(mutableCloneDeep(protoChatWithNewMessageFromGandalf));
      await expectWithinTimeout(
        async () =>
          (await gandalfChat.messagePreview()) ==
          protoChatWithNewMessageFromGandalf.message[0].content,
        "Chat was not updated with new message"
      );

      await expectWithinTimeout(
        async () => await gandalfChat.attendState(),
        "Chat attention marker was not set"
      );

      await expectWithinTimeout(
        async () => (await gandalfChat.name()) === "Gandalf The ⚪",
        "Chat name was not updated"
      );

      // Now click on the chat to attend to and check the attention dot is gone.
      await gandalfChat.click();
    });

    it("Remembers focus when a new message arrives", async () => {
      const newChatMessageFromGandalfNow = mutableCloneDeep(protoChatWithNewMessageFromGandalf);
      newChatMessageFromGandalfNow.message[0].timestamp = new Date(Date.now()).toISOString();

      await UI.sidebar.chatsButton.click();
      await UI.midbar.chatList.waitForSomeChats(2);

      // Check the initial state
      const [peterChat, gandalfChat] = await UI.midbar.chatList.chats();
      expect(await peterChat.messagePreview()).toBe(protoChatWithPeter.message[1].content);
      expect(await peterChat.attendState()).toBe(false);
      expect(await peterChat.name()).toBe("Peter Parker");
      expect(await gandalfChat.messagePreview()).toBe(protoChatWithGandalf.message[2].content);
      expect(await gandalfChat.attendState()).toBe(false);
      expect(await gandalfChat.name()).toBe("Gandalf The ⚪");

      // Tab to the Peter chat to put focus on it
      await UI.midbar.searchBar.input.waitForActive();
      await UI.pressKey([Key.TAB]);
      await UI.midbar.dialpad.waitForActive();
      await UI.pressKey([Key.TAB]);
      await peterChat.waitForActive();

      // Receive the new message into the Gandalf chat
      mockWispa.sendNewMessage(newChatMessageFromGandalfNow);
      await UI.midbar.chatList.waitForSomeChats(2);

      // Peter should retain focus
      await peterChat.waitForActive();

      // The chat with Gandalf should have moved above Peter
      await UI.pressKey([Key.ARROW_UP]);
      await gandalfChat.waitForActive();
      await UI.pressKey([Key.ENTER]);

      await UI.rightbar.contentHeaderPanel.expectWillHaveName("Gandalf The ⚪");
    });
  },
};

export const chatPane = {
  title: "Chat Pane",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();
      mockWispa.data.contacts = [protoBilbo, protoGandalf, protoPeter];
      mockWispa.data.chats = [protoChatWithGandalf];

      await app.client.refresh();
      await UI.midbar.contactList.waitForSomeContacts(2);
    });

    each([
      ["Sends a simple message", "This is a simple message"],
      [
        "Sends a multiline message",
        dedent`
       This is a big multiline message.

       It goes into excruciating detail on a complex topic.

       Here is the first point:
       - Hyphens are the superior bullet point marker`,
      ],
      ["Sends a link", "https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
      [
        "Sends a message with HTML",
        dedent`
         <html>
           <body>
             <div>
             Hello World!
             </div>
             <script>
               alert(Hello World!);
             </script>
           </body>
         </html>`,
      ],
      ["Sends a message with JSON", "{ target: { value: 'Injected message' }, key: 'Enter' }"],
    ]).it("%s", async (_testName, message) => {
      const chatPane = UI.rightbar.chatPane;

      const chatToSend = mutableCloneDeep(protoChatWithNewMessageFromGandalf);
      chatToSend.message[0].content = message;
      chatToSend.message[0].recipient = protoGandalf.im;
      chatToSend.message[0].author = { value: "" };

      const chatWithAllMessages = mutableCloneDeep(protoChatWithGandalf);
      chatWithAllMessages.message.push(chatToSend.message[0]);
      mockWispa.createDataStore.chats = [chatToSend];

      await UI.sidebar.chatsButton.click();
      await UI.midbar.chatList.waitForSomeChats(1);

      await UI.auditAccessibility();

      const gandalfChat = (await UI.midbar.chatList.chats())[0];
      await gandalfChat.click();
      await chatPane.waitForSomeMessages(2);

      mockWispa.data.chats = [chatWithAllMessages];
      await chatPane.messageBox.sendMessage(chatToSend.message[0].content);
      // Mock Wispa will receive a complete ChatMessage with only the relevant parts (recipient and
      // content) filled in. Use this template to flesh out the rest of the message.
      // TODO - When "shared/types" has a "ChatMessage" class might be able to replace this with
      // `new ChatMessage()`
      const chatMessageTemplate = {
        uid: "",
        timestamp: "",
        type: 0,
        edited: false,
        read: false,
      };
      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("messaging", "create", {
            ...chatMessageTemplate,
            recipient: { value: chatToSend.uid },
            content: chatToSend.message[0].content,
          }),
        "Mock Wispa did not receive a request to create a new chat message"
      );
      // Messages with newlines seem to slow down the ChatPane rendering considerably, so wait a while
      await chatPane.waitForSomeMessages(4, 30000);

      const messages = await chatPane.messages();
      expect(await messages[0].body()).toBe(chatToSend.message[0].content);
      expect(await messages[0].time()).toBe(toLocalTimeString(chatToSend.message[0].timestamp));
      expect(await messages[1].body()).toBe(protoChatWithGandalf.message[2].content);
      expect(await messages[1].time()).toBe(
        toLocalTimeString(protoChatWithGandalf.message[2].timestamp)
      );
      expect(await messages[2].body()).toBe(protoChatWithGandalf.message[1].content);
      expect(await messages[2].time()).toBe(
        toLocalTimeString(protoChatWithGandalf.message[1].timestamp)
      );
      expect(await messages[3].body()).toBe(protoChatWithGandalf.message[0].content);
      expect(await messages[3].time()).toBe(
        toLocalTimeString(protoChatWithGandalf.message[0].timestamp)
      );
    });

    it("Handles incoming messages", async () => {
      const protoFirstChatWithNewMessageFromGandalf = mutableCloneDeep(
        protoChatWithNewMessageFromGandalf
      );
      const protoSecondIncomingMessageFromGandalf = mutableCloneDeep(
        protoChatWithNewMessageFromGandalf
      );
      protoSecondIncomingMessageFromGandalf.message[0].content =
        "I'm another incoming message from Gandalf";
      protoSecondIncomingMessageFromGandalf.message[0].uid = "second-incoming-message";
      protoSecondIncomingMessageFromGandalf.message[0].timestamp = "2020-06-20T17:33:55";
      const chatPane = UI.rightbar.chatPane;

      log.fv("Click to set-up initial state");
      await UI.sidebar.chatsButton.click();
      await UI.midbar.chatList.waitForSomeChats(1);

      const [gandalfChat] = await UI.midbar.chatList.chats();
      expect(await gandalfChat.messagePreview()).toBe(protoChatWithGandalf.message[2].content);
      expect(await gandalfChat.attendState()).toBe(false);
      await gandalfChat.click();
      await chatPane.waitForSomeMessages(3);

      log.fv("Receive the new message");
      mockWispa.sendNewMessage(protoFirstChatWithNewMessageFromGandalf);
      // Update mockWispa to return the updated chat data on future requests
      const updatedChat = mutableCloneDeep(protoChatWithGandalf);
      protoFirstChatWithNewMessageFromGandalf.message[0].read = true;
      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("messaging", "action", {
            showChatHistory: "",
            markChatRead: protoChatWithGandalf.uid,
            showCreateGroupChat: false,
          }),
        "Mock Wispa did not receive a request to create a new chat message"
      );
      updatedChat.message.unshift(protoFirstChatWithNewMessageFromGandalf.message[0]);
      mockWispa.data.chats = [updatedChat];
      // Representing Java having sent the update to the chat to mark all messages as read
      mockWispa.sendChatHistory(protoFirstChatWithNewMessageFromGandalf.uid);
      await chatPane.waitForSomeMessages(4);

      log.fv("Check the updated UI");
      await UI.auditAccessibility();

      await expectWithinTimeout(async () => {
        return (
          (await gandalfChat.messagePreview()) ==
          protoFirstChatWithNewMessageFromGandalf.message[0].content
        );
      }, "Chat has not been updated within timeout");

      log.fv("Check we have all the messages");
      const messages = await chatPane.messages();
      expect(await messages[0].body()).toBe(
        protoFirstChatWithNewMessageFromGandalf.message[0].content
      );
      expect(await messages[0].time()).toBe(
        toLocalTimeString(protoFirstChatWithNewMessageFromGandalf.message[0].timestamp)
      );
      expect(await messages[1].body()).toBe(protoChatWithGandalf.message[2].content);
      expect(await messages[1].time()).toBe(
        toLocalTimeString(protoChatWithGandalf.message[2].timestamp)
      );
      expect(await messages[2].body()).toBe(protoChatWithGandalf.message[1].content);
      expect(await messages[2].time()).toBe(
        toLocalTimeString(protoChatWithGandalf.message[1].timestamp)
      );
      expect(await messages[3].body()).toBe(protoChatWithGandalf.message[0].content);
      expect(await messages[3].time()).toBe(
        toLocalTimeString(protoChatWithGandalf.message[0].timestamp)
      );

      log.fv("And check the new chat header is present");
      expect(await chatPane.chatHeaderVisible("chatHeader-new")).toBe(true);

      log.fv("Now respond to the message");
      // Reset from previous test
      mockWispa.sendNewMessage(mutableCloneDeep(protoChatWithNewMessageToGandalf));
      // Update mockWispa to return the updated chat data on future requests
      updatedChat.message.unshift(protoChatWithNewMessageToGandalf.message[0]);
      await chatPane.waitForSomeMessages(5);

      log.fv("And check the response message goes through");
      const messagesTwo = await chatPane.messages();
      expect(await messagesTwo[0].body()).toBe(protoChatWithNewMessageToGandalf.message[0].content);
      expect(await messagesTwo[0].time()).toBe(
        toLocalTimeString(protoChatWithNewMessageToGandalf.message[0].timestamp)
      );

      log.fv("Now receive another new message");
      mockWispa.sendNewMessage(protoSecondIncomingMessageFromGandalf);
      // Update mockWispa to return the updated chat data on future requests
      protoSecondIncomingMessageFromGandalf.message[0].read = true;
      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("messaging", "action", {
            showChatHistory: "",
            markChatRead: protoSecondIncomingMessageFromGandalf.uid,
            showCreateGroupChat: false,
          }),
        "Mock Wispa did not receive a request to create a new chat message"
      );
      updatedChat.message.unshift(protoSecondIncomingMessageFromGandalf.message[0]);
      mockWispa.data.chats = [updatedChat];
      // Representing Java having sent the update to the chat to mark all messages as read
      mockWispa.sendChatHistory(protoFirstChatWithNewMessageFromGandalf.uid);
      await chatPane.waitForSomeMessages(5);

      log.fv("Now click away and back to the chat so that the new marker is cleared");
      await UI.sidebar.contactsButton.click();
      await UI.midbar.contactList.waitForSomeContacts(2);
      const [bilbo] = await UI.midbar.contactList.contacts();
      await bilbo.click();
      await UI.rightbar.contentHeaderPanel.expectWillHaveName("Bilbo Baggins");
      await UI.sidebar.chatsButton.click();
      await UI.midbar.chatList.waitForSomeChats(1);

      const [bilboChat2] = await UI.midbar.chatList.chats();
      expect(await bilboChat2.messagePreview()).toBe(
        protoSecondIncomingMessageFromGandalf.message[0].content
      );
      expect(await bilboChat2.attendState()).toBe(false);
      await bilboChat2.click();
      await chatPane.waitForSomeMessages(5);

      log.fv("And check the new chat header is cleared");
      expect(await chatPane.chatHeaderVisible("chatHeader-new")).toBe(false);
    });

    it("Shows the persistent message indicators", async () => {
      const protoChatWithFirstNewMessageFromPeter = mutableCloneDeep(
        protoChatWithNewMessageFromPeter
      );
      const otherNewMessages = [];
      for (let i = 0; i < 25; i++) {
        const clonedChat = mutableCloneDeep(protoChatWithNewMessageFromPeter);
        clonedChat.message[0].content = i.toString();
        clonedChat.message[0].uid = i.toString() + "-uid";
        otherNewMessages.push(clonedChat);
      }
      const protoChatAllUnreadWithPeter = mutableCloneDeep(protoChatWithPeter);
      protoChatAllUnreadWithPeter.message = [];

      const chatPane = UI.rightbar.chatPane;

      log.fv("Click to set-up initial state");
      await UI.sidebar.contactsButton.click();
      await UI.midbar.contactList.waitForNContacts(3);

      const [, , protoPeter] = await UI.midbar.contactList.contacts();
      await protoPeter.click();
      await expectWithinTimeout(
        async () => await UI.rightbar.chatPane.isVisible(),
        "Chat pane did not become visible"
      );

      log.fv("Receive the first message");
      mockWispa.sendNewMessage(protoChatWithFirstNewMessageFromPeter);
      // Update mockWispa to return the updated chat data on future requests
      const updatedChat = mutableCloneDeep(protoChatAllUnreadWithPeter);
      protoChatWithFirstNewMessageFromPeter.message[0].read = true;
      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("messaging", "action", {
            showChatHistory: "",
            markChatRead: protoChatAllUnreadWithPeter.uid,
            showCreateGroupChat: false,
          }),
        "Mock Wispa did not receive a request to mark chat as read"
      );
      updatedChat.message.unshift(protoChatWithFirstNewMessageFromPeter.message[0]);
      mockWispa.data.chats = [updatedChat];
      // Representing Java having sent the update to the chat to mark all messages as read
      mockWispa.sendChatHistory(protoChatAllUnreadWithPeter.uid);
      await chatPane.waitForSomeMessages(1);

      log.fv("Check the updated UI");
      await UI.auditAccessibility();

      log.fv("Check we have all the messages");
      const messages = await chatPane.messages();
      expect(await messages[0].body()).toBe(
        protoChatWithFirstNewMessageFromPeter.message[0].content
      );

      log.fv("And check the new message is in the new container");
      const newMessages = await chatPane.messages();
      expect(await newMessages[0].body()).toBe(
        protoChatWithFirstNewMessageFromPeter.message[0].content
      );

      log.fv("Now receive another 25 new messages");
      for (let i = 0; i < 25; i++) {
        mockWispa.sendNewMessage(otherNewMessages[i]);
        otherNewMessages[i].message[0].read = true;
        await expectWithinTimeout(
          () =>
            mockWispa.hasReceivedRequest("messaging", "action", {
              showChatHistory: "",
              markChatRead: protoChatAllUnreadWithPeter.uid,
              showCreateGroupChat: false,
            }),
          "Mock Wispa did not receive a request to mark chat as read"
        );
        updatedChat.message.unshift(otherNewMessages[i].message[0]);
      }
      mockWispa.data.chats = [updatedChat];
      // Representing Java having sent the update to the chat to mark all messages as read
      mockWispa.sendChatHistory(protoChatAllUnreadWithPeter.uid);
      await chatPane.waitForSomeMessages(26);

      log.fv("And check that the new chat header is present");
      expect(await chatPane.chatHeaderVisible("chatHeader-new")).toBe(true);

      log.fv("Now click away and back to the chat so that the new marker is cleared");
      await UI.rightbar.contactDetailsTabButton.click();
      await expectWithinTimeout(
        async () => await UI.rightbar.contactPane.isVisible(),
        "Contact pane did not become visible"
      );
      await UI.rightbar.conversationTabButton.click();
      await expectWithinTimeout(
        async () => await UI.rightbar.chatPane.isVisible(),
        "Chat pane did not become visible"
      );
      await chatPane.waitForSomeMessages(26);

      log.fv("And check the new chat header is cleared");
      expect(await chatPane.chatHeaderVisible("chatHeader-new")).toBe(false);
    });

    it("Handles messages with unicode", async () => {
      const chatPane = UI.rightbar.chatPane;
      mockWispa.data.chats = [protoChatWithPeter];
      mockWispa.sendChatHistory(protoPeter.im.value);

      const peter = (await UI.midbar.contactList.contacts())[2];
      await peter.click();

      await chatPane.waitForSomeMessages(1);
      const messages = await chatPane.messages();

      expect(await messages[0].body()).toBe(protoChatWithPeter.message[1].content);
    });

    it("Saves drafts", async () => {
      const messageBox = UI.rightbar.chatPane.messageBox;
      const [, gandalf, peter] = await UI.midbar.contactList.contacts();
      const activeContact = UI.rightbar.contentHeaderPanel.contact;

      const waitForActiveContact = async (name: string): Promise<void> => {
        await waitForCondition(async () => {
          const activeName = await activeContact.name();
          return activeName.includes(name);
        });
      };

      const waitForText = async (text: string): Promise<void> => {
        await waitForCondition(async () => {
          const contents = await messageBox.contents();
          return contents.includes(text);
        });
      };

      // Verify changing between contacts first
      await peter.click();
      await waitForActiveContact("Peter");
      expect(await messageBox.contents()).toBe("");
      await messageBox.typeMessage("Hello Peter");
      await waitForText("Hello Peter");
      await UI.auditAccessibility();

      await gandalf.click();
      await waitForActiveContact("Gandalf");
      expect(await messageBox.contents()).toBe("");
      await messageBox.typeMessage("Hello Gandalf\n How are you?");
      await waitForText("Hello Gandalf\n How are you?");
      await UI.auditAccessibility();

      await peter.click();
      await waitForActiveContact("Peter");
      expect(await messageBox.contents()).toBe("Hello Peter");
      await UI.auditAccessibility();

      await gandalf.click();
      await waitForActiveContact("Gandalf");
      expect(await messageBox.contents()).toBe("Hello Gandalf\n How are you?");
      await UI.auditAccessibility();

      // Now verify changing the active rightbar pane
      await UI.rightbar.contactDetailsTabButton.click();
      await messageBox.waitForNotVisible(30000);
      await UI.rightbar.conversationTabButton.click();
      await messageBox.waitForVisible(30000);

      await peter.click();
      await waitForActiveContact("Peter");
      expect(await messageBox.contents()).toBe("Hello Peter");
      await UI.auditAccessibility();

      await gandalf.click();
      await waitForActiveContact("Gandalf");
      expect(await messageBox.contents()).toBe("Hello Gandalf\n How are you?");
    });

    it("Handles incoming SMS messages to IM contact", async () => {
      const protoNewSMSFromGandalfPhone1 = mutableCloneDeep(protoChatWithNewMessageFromGandalf);
      const protoNewSMSFromGandalfPhone2 = mutableCloneDeep(protoChatWithNewMessageFromGandalf);
      protoNewSMSFromGandalfPhone1.message[0].content =
        "I'm an incoming SMS message from Gandalf's first phone number";
      protoNewSMSFromGandalfPhone1.message[0].type = MessageType.SMS;
      protoNewSMSFromGandalfPhone1.message[0].uid = "new-sms-from-gandalf";
      protoNewSMSFromGandalfPhone1.uid = protoGandalf.phone[0].value;

      protoNewSMSFromGandalfPhone2.message[0].content =
        "I'm an incoming SMS message from Gandalf's second phone number";
      protoNewSMSFromGandalfPhone2.message[0].uid = "second-new-sms-from-gandalf";
      protoNewSMSFromGandalfPhone2.message[0].timestamp = "2020-06-20T17:33:55";
      protoNewSMSFromGandalfPhone2.message[0].type = MessageType.SMS;
      protoNewSMSFromGandalfPhone2.uid = protoGandalf.phone[1].value;
      const chatPane = UI.rightbar.chatPane;

      log.fv("Click to set-up initial state");
      await UI.sidebar.chatsButton.click();
      await UI.midbar.chatList.waitForSomeChats(1);

      const [gandalfChat] = await UI.midbar.chatList.chats();
      expect(await gandalfChat.messagePreview()).toBe(protoChatWithGandalf.message[2].content);
      expect(await gandalfChat.attendState()).toBe(false);
      await gandalfChat.click();
      await chatPane.waitForSomeMessages(3);

      log.fv("Receive the new message");
      mockWispa.sendNewMessage(protoNewSMSFromGandalfPhone1);
      protoNewSMSFromGandalfPhone1.message[0].read = true;
      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("messaging", "action", {
            showChatHistory: "",
            markChatRead: protoNewSMSFromGandalfPhone1.uid,
            showCreateGroupChat: false,
          }),
        "Mock Wispa did not receive a request to create a new chat message"
      );
      mockWispa.data.chats.push(protoNewSMSFromGandalfPhone1);
      // Representing Java having sent the update to the chat to mark all messages as read
      mockWispa.sendChatHistory(protoNewSMSFromGandalfPhone1.uid);
      await chatPane.waitForSomeMessages(4);

      log.fv("Check the updated UI");
      await UI.auditAccessibility();

      await expectWithinTimeout(async () => {
        return (
          (await gandalfChat.messagePreview()) == protoNewSMSFromGandalfPhone1.message[0].content
        );
      }, "Chat has not been updated within timeout");

      log.fv("Check we have all the messages");
      const messages = await chatPane.messages();
      expect(await messages[0].body()).toContain(protoNewSMSFromGandalfPhone1.message[0].content);
      expect(await messages[0].body()).toContain("SMS");
      expect(await messages[0].time()).toBe(
        toLocalTimeString(protoNewSMSFromGandalfPhone1.message[0].timestamp)
      );
      expect(await messages[1].body()).toBe(protoChatWithGandalf.message[2].content);
      expect(await messages[1].time()).toBe(
        toLocalTimeString(protoChatWithGandalf.message[2].timestamp)
      );
      expect(await messages[2].body()).toBe(protoChatWithGandalf.message[1].content);
      expect(await messages[2].time()).toBe(
        toLocalTimeString(protoChatWithGandalf.message[1].timestamp)
      );
      expect(await messages[3].body()).toBe(protoChatWithGandalf.message[0].content);
      expect(await messages[3].time()).toBe(
        toLocalTimeString(protoChatWithGandalf.message[0].timestamp)
      );

      log.fv("Check the switch to SMS chat header is present");
      expect(
        await chatPane.chatHeaderVisible(
          `chatHeader-switchedToSMS-${protoNewSMSFromGandalfPhone1.message[0].uid}`
        )
      ).toBe(true);

      log.fv("And check the new chat header is present");
      expect(await chatPane.chatHeaderVisible("chatHeader-new")).toBe(true);

      log.fv("Now respond to the message");
      mockWispa.sendNewMessage(mutableCloneDeep(protoChatWithNewMessageToGandalf));
      await chatPane.waitForSomeMessages(5);

      log.fv("And check the response message goes through");
      const messagesTwo = await chatPane.messages();
      expect(await messagesTwo[0].body()).toBe(protoChatWithNewMessageToGandalf.message[0].content);
      expect(await messagesTwo[0].time()).toBe(
        toLocalTimeString(protoChatWithNewMessageToGandalf.message[0].timestamp)
      );

      log.fv("And check the switch to IM chat header is present");
      expect(
        await chatPane.chatHeaderVisible(
          `chatHeader-switchedToIM-${protoChatWithNewMessageToGandalf.message[0].uid}`
        )
      ).toBe(true);

      log.fv("Now receive another new message");
      mockWispa.sendNewMessage(protoNewSMSFromGandalfPhone2);
      // Update mockWispa to return the updated chat data on future requests
      protoNewSMSFromGandalfPhone2.message[0].read = true;
      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("messaging", "action", {
            showChatHistory: "",
            markChatRead: protoNewSMSFromGandalfPhone2.uid,
            showCreateGroupChat: false,
          }),
        "Mock Wispa did not receive a request to create a new chat message"
      );
      mockWispa.data.chats.push(protoNewSMSFromGandalfPhone2);
      // Representing Java having sent the update to the chat to mark all messages as read
      mockWispa.sendChatHistory(protoNewSMSFromGandalfPhone2.uid);
      await chatPane.waitForSomeMessages(5);

      log.fv("Now click away and back to the chat so that the new marker is cleared");
      await UI.sidebar.contactsButton.click();
      await UI.midbar.contactList.waitForSomeContacts(2);
      const [bilbo] = await UI.midbar.contactList.contacts();
      await bilbo.click();
      await UI.rightbar.contentHeaderPanel.expectWillHaveName("Bilbo Baggins");
      await UI.sidebar.chatsButton.click();
      await UI.midbar.chatList.waitForSomeChats(1);

      const [bilboChat2] = await UI.midbar.chatList.chats();
      expect(await bilboChat2.messagePreview()).toBe(
        protoNewSMSFromGandalfPhone2.message[0].content
      );
      expect(await bilboChat2.attendState()).toBe(false);
      await bilboChat2.click();
      await chatPane.waitForSomeMessages(5);

      log.fv("And check the new chat header is cleared");
      expect(await chatPane.chatHeaderVisible("chatHeader-new")).toBe(false);
    });

    it("Switching between message menu options and sending messages", async () => {
      await UI.sidebar.chatsButton.click();
      await UI.midbar.chatList.waitForSomeChats(1);

      await UI.auditAccessibility();

      const gandalfChat = (await UI.midbar.chatList.chats())[0];
      await gandalfChat.click();
      await UI.rightbar.chatPane.waitForSomeMessages(3);

      const firstSmsMessage = "Hello";
      const firstChatToSend = mutableCloneDeep(protoChatWithNewMessageToGandalf);
      firstChatToSend.uid = protoGandalf.phone[0].value;
      firstChatToSend.message[0].content = firstSmsMessage;
      firstChatToSend.message[0].recipient = protoGandalf.phone[0];
      firstChatToSend.message[0].type = MessageType.SMS;

      mockWispa.createDataStore.chats.push(firstChatToSend);

      const messageBox = UI.rightbar.chatPane.messageBox;
      await messageBox.messageMenuButton.click();
      await expectWithinTimeout(
        async () => await messageBox.messageMenuButton.menu.isVisible(),
        "Message menu did not become visible within timeout"
      );
      const messageMenuRows = await messageBox.messageMenuButton.menu.rows();
      // Click the first SMS option
      await messageMenuRows[1].click();

      await messageBox.sendMessage(firstSmsMessage);

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
            content: firstSmsMessage,
          }),
        "Mock Wispa did not receive a request to create a new SMS chat message to first number"
      );

      const secondSmsMessage = "Are you there?";
      const secondChatToSend = mutableCloneDeep(protoChatWithNewMessageToGandalf);
      secondChatToSend.uid = protoGandalf.phone[1].value;
      secondChatToSend.message[0].timestamp = "2020-06-20T17:33:00";
      secondChatToSend.message[0].content = secondSmsMessage;
      secondChatToSend.message[0].recipient = protoGandalf.phone[1];
      secondChatToSend.message[0].type = MessageType.SMS;

      mockWispa.createDataStore.chats.push(secondChatToSend);

      await messageBox.messageMenuButton.click();
      await expectWithinTimeout(
        async () => await messageBox.messageMenuButton.menu.isVisible(),
        "Message menu did not become visible within timeout"
      );
      // Click the second SMS option
      await messageMenuRows[2].click();

      await messageBox.sendMessage(secondSmsMessage);

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("messaging", "create", {
            ...chatMessageTemplate,
            recipient: { value: protoGandalf.phone[1].value },
            content: secondSmsMessage,
          }),
        "Mock Wispa did not receive a request to create a new SMS chat message to second number"
      );

      const IMMessage = "Call me when you're back";
      const IMChatToSend = mutableCloneDeep(protoChatWithNewMessageToGandalf);
      IMChatToSend.message[0].content = IMMessage;
      IMChatToSend.message[0].timestamp = "2020-06-20T17:33:20";

      mockWispa.createDataStore.chats.push(IMChatToSend);

      await messageBox.messageMenuButton.click();
      await expectWithinTimeout(
        async () => await messageBox.messageMenuButton.menu.isVisible(),
        "Message menu did not become visible within timeout"
      );
      // Click the IM option
      await messageMenuRows[0].click();

      await messageBox.sendMessage(IMMessage);

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("messaging", "create", {
            ...chatMessageTemplate,
            type: MessageType.IM,
            recipient: { value: protoGandalf.im.value },
            content: IMMessage,
          }),
        "Mock Wispa did not receive a request to create a new IM chat message"
      );
    });
  },
};

export const sidebar = {
  title: "Sidebar",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();
      mockWispa.data.contacts = [protoGandalf, protoPeter];
      mockWispa.data.chats = [protoChatWithGandalf];

      await app.client.refresh();
      await UI.midbar.contactList.waitForSomeContacts(2);
    });

    it("Increments and decrements the unread chat counter", async () => {
      const secondNewMessageFromGandalf = mutableCloneDeep(protoChatWithNewMessageFromGandalf);
      secondNewMessageFromGandalf.message[0].uid = "second-new-message-uid";
      secondNewMessageFromGandalf.message[0].content = "I'm another new message from Gandalf";
      // No counter if no chats requesting attention
      expect(await UI.sidebar.chatsButton.getText()).toBe("");
      expect(await UI.sidebar.chatsButton.getAriaLabel()).toBe("Chats");

      log.fv("Receive the new message");
      mockWispa.sendNewMessage(mutableCloneDeep(protoChatWithNewMessageFromGandalf));

      await expectWithinTimeout(
        async () => (await UI.sidebar.chatsButton.getText()) === "1",
        "Sidebar counter did not update to one unread chat"
      );
      await expectWithinTimeout(
        async () => (await UI.sidebar.chatsButton.getAriaLabel()) === "Chats, 1 unread",
        "Sidebar aria label did not update to one unread chat"
      );

      log.fv("Receive the second new message in the same chat");
      mockWispa.sendNewMessage(secondNewMessageFromGandalf);

      await expectWithinTimeout(
        async () => (await UI.sidebar.chatsButton.getText()) === "1",
        "Sidebar counter did not remain on one unread chat"
      );
      await expectWithinTimeout(
        async () => (await UI.sidebar.chatsButton.getAriaLabel()) === "Chats, 1 unread",
        "Sidebar aria label did not remain on one unread chat"
      );

      log.fv("Receive a new message in another chat");
      mockWispa.sendNewMessage(mutableCloneDeep(protoChatWithNewMessageFromPeter));

      await expectWithinTimeout(
        async () => (await UI.sidebar.chatsButton.getText()) === "2",
        "Sidebar counter did not update to two unread chats"
      );
      await expectWithinTimeout(
        async () => (await UI.sidebar.chatsButton.getAriaLabel()) === "Chats, 2 unread",
        "Sidebar aria label did not update to two unread chats"
      );

      // Move to the chat tab
      await UI.sidebar.chatsButton.click();
      await UI.midbar.chatList.waitForSomeChats(2);
      const [, gandalfChat] = await UI.midbar.chatList.chats();

      log.fv("Clear one of the chat attentions");

      await gandalfChat.click();
      // For some reason this can be really slow, so bump up the timeout
      await expectWithinTimeout(
        async () => (await UI.sidebar.chatsButton.getText()) === "1",
        "Sidebar counter did not drop from two to one unread chats"
      );
      await expectWithinTimeout(
        async () => (await UI.sidebar.chatsButton.getAriaLabel()) === "Chats, 1 unread",
        "Sidebar aria label did not drop from two to one unread chats"
      );
    });
  },
};

export const viewChatHistory = {
  title: "View chat history",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();
      mockWispa.data.contacts = [protoPeter];
      await app.client.refresh();
      mockWispa.sendContactsList();
      await UI.midbar.contactList.waitForSomeContacts(1);
    });

    it('Sends view chat history request when the "View chat history" button in the more menu is clicked', async () => {
      const contacts = await UI.midbar.contactList.contacts();
      await contacts[0].click();
      await UI.rightbar.contentHeaderPanel.expectWillHaveName("Peter Parker");

      const moreButton = UI.rightbar.contentHeaderPanel.defaultMoreButton;
      await moreButton.click();
      await expectWithinTimeout(
        async () => await moreButton.menu.isVisible(),
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
      await menuRows[0].click();

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("messaging", "action", {
            showChatHistory: protoPeter.im.value,
            markChatRead: "",
            showCreateGroupChat: false,
          }),
        "Mock WISPA did not receive request to show chat history"
      );
    });

    it('Sends a "Show Chat History" WISPA request when choosing the "View chat history" menu item with keyboard navigation', async () => {
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
      await UI.midbar.dialpad.waitForActive();
      await UI.pressKey([Key.TAB]);

      const contacts = await midbar.contactList.contacts();
      await UI.pressKey([Key.ARROW_DOWN]);
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

      await UI.pressKey([Key.ENTER]);
      await expectWithinTimeout(() => {
        return mockWispa.hasReceivedRequest("messaging", "action", {
          showChatHistory: protoPeter.im.value,
          markChatRead: "",
          showCreateGroupChat: false,
        });
      }, "Mock WISPA did not receive messaging action 'showChatHistory' request");
    });
  },
};

export const newGroupChat = {
  title: "New group chat",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();
      await app.client.refresh();
    });

    it('Sends show new group chat request when the "New group chat..." button in the add menu is clicked', async () => {
      const sidebar = UI.sidebar;
      await sidebar.addButton.waitForVisible();
      await sidebar.addButton.click();

      await waitForCondition(async () => {
        return await UI.sidebar.addMenu.isVisible();
      });

      const addMenuRowTexts = await UI.sidebar.addMenu.rowTexts();
      expect(addMenuRowTexts).toEqual([
        "New call",
        "New group chat...",
        "Add contact",
        "Create a meeting",
        "Schedule a meeting",
      ]);

      const addMenuRows = await UI.sidebar.addMenu.rows();
      await addMenuRows[1].click();

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("messaging", "action", {
            showChatHistory: "",
            markChatRead: "",
            showCreateGroupChat: true,
          }),
        "Mock WISPA did not receive request to show chat history"
      );
    });

    it('Sends a "Show New Group Chat" WISPA request when choosing the "New group chat..." menu item with keyboard navigation in the add menu', async () => {
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
      await UI.pressKey([Key.ENTER]);

      await expectWithinTimeout(() => {
        return mockWispa.hasReceivedRequest("messaging", "action", {
          showChatHistory: "",
          markChatRead: "",
          showCreateGroupChat: true,
        });
      }, "Mock WISPA did not receive messaging action 'showChatHistory' request");
    });
  },
};

export const searchBar = {
  title: "Search bar",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();
      await app.client.refresh();

      mockWispa.data.contacts = [protoBilbo, protoGandalf];
      mockWispa.sendContactsList();
      await UI.midbar.contactList.waitForSomeContacts(2);
    });

    each([
      ["123456789", "01234 56789"],
      ["(+98) 765-4321", "+98 7654321"],
      [
        protoBilbo.phone[0].value,
        protoBilbo.identity.firstName + " " + protoBilbo.identity.lastName,
      ],
      [
        protoGandalf.phone[0].value,
        protoGandalf.identity.firstName + " " + protoGandalf.identity.lastName,
      ],
    ]).it(
      "opens a conversation when inputting a valid phone number and clicking the SMS button",
      async (searchInput, nameToShow) => {
        const searchInputBox = UI.midbar.searchBar.input;
        const searchSMSButton = UI.midbar.searchBar.smsButton;

        // Type in the phone number into the search bar and move focus to the search bar
        await expectWithinTimeout(
          async () => await searchInputBox.isVisible(),
          "Search box did not become visible"
        );
        await searchInputBox.click();
        await expectWithinTimeout(
          async () => await searchInputBox.isActive(),
          "Search box did not become focused"
        );

        await searchInputBox.setValue(searchInput);
        await UI.auditAccessibility();
        await expectWithinTimeout(
          async () => await UI.midbar.searchBar.isVisible(),
          "Search bar did not become visible"
        );
        await expectWithinTimeout(
          async () => await searchSMSButton.isVisible(),
          "Search bar SMS button did not become visible"
        );

        await searchSMSButton.click();
        await expectWithinTimeout(async () => {
          const activeName = await UI.rightbar.contentHeaderPanel.contact.name();
          return activeName.includes(nameToShow);
        }, "Selected Contact does not match");
        await expectWithinTimeout(
          async () => await UI.rightbar.chatPane.isVisible(),
          "Chat Pane pane did not become visible"
        );
      }
    );

    it("opens a conversation when inputting a valid phone number and selecting the SMS button with keyboard navigation", async () => {
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

      const searchBar = UI.midbar.searchBar;
      await searchBar.input.waitForActive();

      await searchBar.input.setValue(protoGandalf.phone[0].value);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      await UI.pressKey([Key.TAB]);
      await UI.pressKey([Key.TAB]);
      await searchBar.callButton.waitForActive();
      await UI.pressKey([Key.TAB]);
      await searchBar.smsButton.waitForActive();
      await UI.pressKey([Key.ENTER]);

      await expectWithinTimeout(async () => {
        const activeName = await UI.rightbar.contentHeaderPanel.contact.name();
        return activeName.includes(
          protoGandalf.identity.firstName + " " + protoGandalf.identity.lastName
        );
      }, "Selected Contact does not match");
      await expectWithinTimeout(
        async () => await UI.rightbar.chatPane.isVisible(),
        "Chat Pane pane did not become visible"
      );
    });
  },
};
