// Copyright 2021 Metaswitch Networks - Highly Confidential Material
// /**
//  * Tests for the messagingReducer - TODO Commented out for now, due to the reducer not having the desired behaviour
//  *
//  * Fixing scheduled under https://jira.metaswitch.com/browse/DUIR-3991
//  */
// import "test/react-ut/components/require-mock";
// import { chatWithGandalf, chatWithPeter, chatWithNewMessageFromPeter } from "shared/mocks/mock-chats";
// import { messagingReducer } from "reducers/messaging/reducer";
// import { windowTypes } from "node-server/utils/window-types";

// While this is disabled, don't check it!
/* eslint-disable jest/no-commented-out-tests */

// jest.mock("src/renderer-logging");

// let identifiers: { remoteParty: string, type: WindowTypes };

// // The chat list as formed by the Protobuf files
// const testChatList = [chatWithGandalf, chatWithPeter];

// describe("Messaging reducer (Main Window) - DATA_CHAT_LIST", () => {
//   beforeEach(() => {
//     identifiers = { type: windowTypes.main };
//   });
//   // Incoming chat list expected to contain only the most recent message from each chat
//   const lastMessageOnly = testChatList.map((chat) => {
//     return { ...chat, message: [chat.message[0]] };
//   });

//   it("Adds a new chat list", () => {
//     const initialState = {
//       chats: [],
//       identifiers,
//     };
//     const dataChatListAction = {
//       type: "DATA_CHAT_LIST",
//       payload: {
//         chats: [chatWithGandalf],
//       },
//     };
//     const expectedState = {
//       chats: [chatWithGandalf],
//       identifiers,
//     };

//     const newState = messagingReducer(initialState, dataChatListAction);
//     expect(newState).toEqual(expectedState);
//   });

//   it("Updates the existing chat list", () => {
//     const initialState = {
//       chats: testChatList,
//       identifiers,
//     };
//     const dataChatListAction = {
//       type: "DATA_CHAT_LIST",
//       payload: {
//         chats: lastMessageOnly,
//       },
//     };
//     const expectedState = {
//       chats: testChatList.map((chat) => {
//         return { ...chat, message: [chat.message[0]] };
//       }),
//       identifiers,
//     };

//     const newState = messagingReducer(initialState, dataChatListAction);
//     expect(newState).toEqual(expectedState);
//   });

//   it("Handles the new chat list being the same as the current chat list", () => {
//     const initialState = {
//       chats: testChatList,
//       identifiers,
//     };
//     const dataChatListAction = {
//       type: "DATA_CHAT_LIST",
//       payload: {
//         chats: testChatList,
//       },
//     };
//     const expectedState = {
//       chats: testChatList,
//       identifiers,
//     };

//     const newState = messagingReducer(initialState, dataChatListAction);
//     expect(newState).toEqual(expectedState);
//   });
// });

// describe("Messaging reducer (Main Window) - DATA_CHAT", () => {
//   beforeEach(() => {
//     identifiers = { type: windowTypes.main };
//   });

//   it("Adds a new chat", () => {
//     const initialState = {
//       chats: [],
//       identifiers,
//     };
//     const dataChatAction = {
//       type: "DATA_CHAT",
//       payload: {
//         chat: chatWithGandalf,
//       },
//     };
//     const expectedState = {
//       chats: [chatWithGandalf],
//       identifiers,
//     };

//     const newState = messagingReducer(initialState, dataChatAction);
//     expect(newState).toEqual(expectedState);
//   });

//   it("Updates an existing chat with a new message", () => {
//     const newMessage = chatWithNewMessageFromPeter.message[0];

//     const initialState = {
//       chats: [chatWithPeter],
//       identifiers,
//     };
//     const dataChatAction = {
//       type: "DATA_CHAT",
//       payload: {
//         chat: chatWithNewMessageFromPeter,
//       },
//     };
//     const expectedState = {
//       chats: [
//         {
//           ...chatWithPeter,
//           attention: true,
//           message: [
//             ...chatWithPeter.message,
//             {
//               ...newMessage,
//             },
//           ].sort((a, b) => {
//             return new Date(b.timestamp) - new Date(a.timestamp);
//           }),
//         },
//       ],
//       identifiers,
//     };

//     const newState = messagingReducer(initialState, dataChatAction);
//     expect(newState).toEqual(expectedState);
//   });
// });

// describe("Messaging reducer (Main Window) - SAVE_DRAFTS", () => {
//   beforeEach(() => {
//     identifiers = { type: windowTypes.main };
//   });

//   it("Saves a draft", () => {
//     const initialState = {
//       drafts: {},
//       identifiers,
//     };
//     const saveDraftAction = {
//       type: "SAVE_DRAFTS",
//       payload: {
//         drafts: { 34254325: "test" },
//       },
//     };
//     const expectedState = {
//       drafts: { 34254325: "test" },
//       identifiers,
//     };

//     const newState = messagingReducer(initialState, saveDraftAction);
//     expect(newState).toEqual(expectedState);
//   });

//   it("Updates an existing chat with a new message", () => {
//     const newMessage = chatWithNewMessageFromPeter.message[0];

//     const initialState = {
//       chats: [chatWithPeter],
//       identifiers,
//     };
//     const dataChatAction = {
//       type: "DATA_CHAT",
//       payload: {
//         chat: chatWithNewMessageFromPeter,
//       },
//     };
//     const expectedState = {
//       chats: [
//         {
//           ...chatWithPeter,
//           attention: true,
//           message: [
//             {
//               ...newMessage,
//             },
//             ...chatWithPeter.message,
//           ],
//         },
//       ],
//       identifiers,
//     };

//     const newState = messagingReducer(initialState, dataChatAction);
//     expect(newState).toEqual(expectedState);
//   });
// it("Updates an existing chat with a modified message", () => {
//     const reduxChat = testReduxChatList[0];
//     const initialState = {
//       chats: [reduxChat],
//       identifiers,
//     };

//     // Receive an update with a single message, modifying the latest message
//     // received.
//     const newMessage = {
//       ...testChats.youAreLateMessage,
//       content: "You are late.",
//       edited: true,
//     };
//     const dataChatAction = {
//       type: "DATA_CHAT",
//       payload: { chat: { ...testReduxChatList[0], isNew: true, message: [newMessage] } },
//     };

//     const expectedState = {
//       chats: [
//         {
//           ...testReduxChatList[0],
//           messages: [
//             { ...testChats.neverLateMessage, author: undefined },
//             { ...newMessage, author: newMessage.author?.value },
//           ],
//         },
//       ],
//       identifiers,
//     };

//     const newState = messagingReducer(initialState, dataChatAction);
//     expect(newState).toEqual(expectedState);
//   });

//   it("Ignores the last message if repeated", () => {
//     const reduxChat = testReduxChatList[0];
//     const initialState = {
//       chats: [reduxChat],
//       identifiers,
//     };

//     // Receive an update with a single message, repeating the latest message
//     // received.
//     const dataChatAction = {
//       type: "DATA_CHAT",
//       payload: {
//         chat: { ...testReduxChatList[0], isNew: true, message: [testChats.youAreLateMessage] },
//       },
//     };

//     // State should remain unchanged.
//     const newState = messagingReducer(initialState, dataChatAction);
//     expect(newState).toEqual(initialState);
//   });

//   it("Ignores an earlier message if repeated", () => {
//     const reduxChat = testReduxChatList[0];
//     const initialState = {
//       chats: [reduxChat],
//       identifiers,
//     };

//     // Receive an update with a single message, repeating an earlier message
//     // already received.
//     const dataChatAction = {
//       type: "DATA_CHAT",
//       payload: {
//         chat: { ...testReduxChatList[0], isNew: true, message: [testChats.neverLateMessage] },
//       },
//     };

//     // State should remain unchanged.
//     const newState = messagingReducer(initialState, dataChatAction);
//     expect(newState).toEqual(initialState);
//   });
// });

// describe("Messaging reducer (Incoming Call Window)", () => {
//   beforeEach(() => {
//     identifiers = { type: windowTypes.incomingCall };
//   });
//   // Incoming chat list expected to contain only the most recent message from each chat
//   const lastMessageOnly = testChatList.map((chat) => {
//     return { ...chat, message: [chat.message[0]] };
//   });

//   it("State is never changed in the incoming call window", () => {
//     const initialState = {
//       chats: [],
//       identifiers,
//     };
//     const dataChatListAction = {
//       type: "DATA_CHAT_LIST",
//       payload: {
//         chats: lastMessageOnly,
//       },
//     };
//     const dataChatAction = {
//       type: "DATA_CHAT",
//       payload: {
//         chat: testChatList[0],
//       },
//     };
//     const saveDraftAction = {
//       type: "SAVE_DRAFTS",
//       payload: {
//         drafts: {},
//       },
//     };

//     let newState = messagingReducer(initialState, dataChatListAction);
//     expect(newState).toEqual(initialState);

//     newState = messagingReducer(initialState, dataChatAction);
//     expect(newState).toEqual(initialState);

//     newState = messagingReducer(initialState, saveDraftAction);
//     expect(newState).toEqual(initialState);
//   });
// });
