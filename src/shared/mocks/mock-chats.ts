// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Collection of useful chat-related objects
 */
import { Chat, ChatMessage, MessageType } from "shared/types";
import * as pb from "protobuf-wispa";
import deepFreeze from "deep-freeze";
import { ReadonlyDeep } from "type-fest";

import { gandalf, peter } from "./mock-contacts";
import { cloneDeep } from "lodash";

const internalYouAreLateMessage = {
  uid: "you-are-late-message-uid",
  recipient: gandalf.im,
  timestamp: "2020-06-19T17:31:10",
  type: MessageType.IM,
  author: { value: "" },
  content: "You're late.",
  edited: false,
  read: true,
};
/**
 * A message from the logged in user to Gandalf
 */
export const youAreLateMessage: ReadonlyDeep<ChatMessage> = deepFreeze(internalYouAreLateMessage);
/**
 * A message from the logged in user to Gandalf
 *
 * (Protobuf format)
 */
export const protoYouAreLateMessage: ReadonlyDeep<pb.messaging.ChatMessage> =
  deepFreeze(internalYouAreLateMessage);

const internalNeverLateMessage = {
  uid: "never-late-message-uid",
  recipient: { value: "" },
  timestamp: "2020-06-19T17:32:11",
  type: MessageType.IM,
  author: gandalf.im,
  content: "A wizard is never late, nor is he ever early",
  edited: true,
  read: true,
};
/**
 * A message from Gandalf to the logged in user that has been edited
 */
export const neverLateMessage: ReadonlyDeep<ChatMessage> = deepFreeze(internalNeverLateMessage);
/**
 * A message from Gandalf to the logged in user that has been edited
 *
 * (Protobuf format)
 */
export const protoNeverLateMessage: ReadonlyDeep<pb.messaging.ChatMessage> =
  deepFreeze(internalNeverLateMessage);

const internalOnTimeMessage = {
  uid: "always-arrives-message-uid",
  recipient: { value: "" },
  timestamp: "2020-06-19T17:32:12",
  type: MessageType.IM,
  author: gandalf.im,
  content: "He always arrives precisely when he means to!",
  edited: false,
  read: true,
};
/**
 * A message from Gandalf to the logged in user
 */
export const onTimeMessage: ReadonlyDeep<ChatMessage> = deepFreeze(internalOnTimeMessage);
/**
 * A message from Gandalf to the logged in user
 *
 * (Protobuf format)
 */
export const protoOnTimeMessage: ReadonlyDeep<pb.messaging.ChatMessage> =
  deepFreeze(internalOnTimeMessage);

if (gandalf.im === undefined) {
  throw new Error("Gandalf's IM address was undefined so can't build a Chat with him. Abort.");
}
const internalChatWithGandalf = {
  uid: gandalf.im.value,
  participant: [gandalf.im],
  message: [youAreLateMessage, neverLateMessage, onTimeMessage],
  isNew: false,
  chatName: "bilbo-gandalf-chat-name",
};

/**
 * A chat between the logged in user and Gandalf
 */
export const chatWithGandalf: ReadonlyDeep<Chat> = deepFreeze(internalChatWithGandalf);
/**
 * A chat between the logged in user and Gandalf
 *
 * (Protobuf format)
 */
export const protoChatWithGandalf: ReadonlyDeep<pb.messaging.Chat> =
  deepFreeze(internalChatWithGandalf);
const internalNewMessageFromGandalf = {
  uid: "new-message-from-gandalf-uid",
  recipient: { value: "" },
  timestamp: "2020-06-20T17:32:12",
  type: MessageType.IM,
  author: gandalf.im,
  content: "I'm a new message from Gandalf",
  edited: false,
  read: false,
};
const internalChatWithNewMessageFromGandalf = cloneDeep(internalChatWithGandalf);
internalChatWithNewMessageFromGandalf.message = [internalNewMessageFromGandalf];
internalChatWithNewMessageFromGandalf.isNew = true;
/**
 * A Chat object containing a new message received from Gandalf
 */
export const chatWithNewMessageFromGandalf: ReadonlyDeep<Chat> = deepFreeze(
  internalChatWithNewMessageFromGandalf
);
/**
 * A Chat object containing a new message received from Gandalf
 */
export const protoChatWithNewMessageFromGandalf: ReadonlyDeep<pb.messaging.Chat> = deepFreeze(
  internalChatWithNewMessageFromGandalf
);
const internalNewMessageToGandalf = {
  uid: "new-message-to-gandalf-uid",
  recipient: gandalf.im,
  timestamp: "2020-06-20T17:32:22",
  type: MessageType.IM,
  author: { value: "" },
  content: "I'm a new message to Gandalf",
  edited: false,
  read: true,
};
const internalChatWithNewMessageToGandalf = cloneDeep(internalChatWithGandalf);
internalChatWithNewMessageToGandalf.message = [internalNewMessageToGandalf];
internalChatWithNewMessageToGandalf.isNew = true;
/**
 * A Chat object containing a new message received from Gandalf
 */
export const chatWithNewMessageToGandalf: ReadonlyDeep<Chat> = deepFreeze(
  internalChatWithNewMessageToGandalf
);
/**
 * A Chat object containing a new message received from Gandalf
 */
export const protoChatWithNewMessageToGandalf: ReadonlyDeep<pb.messaging.Chat> = deepFreeze(
  internalChatWithNewMessageToGandalf
);

const internalEmojiMessage = {
  uid: "emoji-message-uid",
  recipient: peter.im,
  timestamp: "2020-06-19T17:32:12",
  type: MessageType.IM,
  author: { value: "" },
  content: "👹😁🎍👜 ⺴⻉⻛ 㑘㑺 ネノハᎾ ᎿᏀᏁ",
  edited: false,
  read: true,
};
/**
 * A message from the logged in user to Peter
 *
 * Contains many unusual characters
 */
export const emojiMessage: ReadonlyDeep<ChatMessage> = deepFreeze(internalEmojiMessage);
/**
 * A message from the logged in user to Peter
 *
 * Contains many unusual characters
 *
 * (Protobuf format)
 */
export const protoEmojiMessage: ReadonlyDeep<pb.messaging.ChatMessage> =
  deepFreeze(internalEmojiMessage);

const internalLongMessage = {
  uid: "long-message-uid",
  recipient: { value: "" },
  timestamp: "2021-01-27T17:33:12",
  type: MessageType.IM,
  author: peter.im,
  content: "I'm just your friendly neighborhood spiderman".repeat(100),
  edited: true,
  read: true,
};
/**
 * A very long message from Peter to the logged in user
 */
export const longMessage: ReadonlyDeep<ChatMessage> = deepFreeze(internalLongMessage);
/**
 * A very long message from Peter to the logged in user
 *
 * (Protobuf format)
 */
export const protoLongMessage: ReadonlyDeep<pb.messaging.ChatMessage> =
  deepFreeze(internalLongMessage);

if (peter.im === undefined) {
  throw new Error("Peter's IM address was undefined so can't build a Chat with him. Abort.");
}
const internalChatWithPeter = {
  uid: peter.im.value,
  participant: [peter.im],
  message: [internalEmojiMessage, internalLongMessage],
  isNew: false,
  chatName: "bilbo-peter-chat-name",
};
/**
 * A chat between Peter and the logged in user
 */
export const chatWithPeter: ReadonlyDeep<Chat> = deepFreeze(internalChatWithPeter);
/**
 * A chat between Peter and the logged in user
 *
 * (Protobuf format)
 */
export const protoChatWithPeter: ReadonlyDeep<pb.messaging.Chat> =
  deepFreeze(internalChatWithPeter);
const internalNewMessageFromPeter = {
  uid: "new-message-uid",
  recipient: { value: "" },
  timestamp: "2020-06-20T17:32:12",
  type: MessageType.IM,
  author: peter.im,
  content: "I'm a new message from Peter",
  edited: false,
  read: false,
};
const internalChatWithNewMessageFromPeter = cloneDeep(internalChatWithPeter);
internalChatWithNewMessageFromPeter.message = [internalNewMessageFromPeter];
internalChatWithNewMessageFromPeter.isNew = true;
/**
 * A Chat object containing a new message received from Peter
 */
export const chatWithNewMessageFromPeter: ReadonlyDeep<Chat> = deepFreeze(
  internalChatWithNewMessageFromPeter
);
/**
 * A Chat object containing a new message received from Peter
 */
export const protoChatWithNewMessageFromPeter: ReadonlyDeep<pb.messaging.Chat> = deepFreeze(
  internalChatWithNewMessageFromPeter
);
