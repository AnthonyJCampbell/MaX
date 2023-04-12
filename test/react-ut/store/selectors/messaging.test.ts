// Copyright 2021 Metaswitch Networks - Highly Confidential Material

import { selectChatsWithContact } from "store/selectors/messaging";
import { mockStoreState } from "shared/mocks/mock-states";

import { gandalf } from "shared/mocks/mock-contacts";
import { chatWithGandalf } from "shared/mocks/mock-chats";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import log from "src/renderer-logging";

jest.mock("src/renderer-logging");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => log.test(`End running: ${expect.getState().currentTestName}`));

describe("selectChatsWithContact", () => {
  it("Selects a single chat with a contact", () => {
    const gandalfChatClone = mutableCloneDeep(chatWithGandalf);
    const gandalfClone = mutableCloneDeep(gandalf);
    mockStoreState.messagingReducer.chats = [gandalfChatClone];
    const chatsWithContact = selectChatsWithContact(gandalfClone)(mockStoreState);

    expect(chatsWithContact).toContain(gandalfChatClone);
  });
});
