// Copyright 2021 Metaswitch Networks - Highly Confidential Material
// We would like to have these tests, but they don't work due to https://jira.metaswitch.com/browse/DUIR-2018

// import { handleData, handleDataList } from "node-server/ipc-wispa/wispa-client";
// import { contactConverter, Contact, WispaMessage } from "node-server/types";
// import * as dataFan from "node-server/data-fan/data-fan";
// import * as pb from "protobuf-wispa";

// While this is disabled, don't check it!
/* eslint-disable jest/no-commented-out-tests */

// jest.mock("node-server/ipc-renderer/window-messaging");

// const emptyUidContact: pb.contacts.Contact = {
//   uid: "",
//   identity: {
//     firstName: "A",
//     lastName: "B",
//     profilePicture: new Uint8Array(),
//     nickname: "",
//     jobTitle: "",
//     organisation: "",
//   },
//   phone: [],
//   postal: [],
//   email: [],
//   isFavourite: false,
//   presence: undefined,
//   im: undefined,
// };
// const normalContact: pb.contacts.Contact = {
//   uid: "123",
//   identity: {
//     firstName: "Alice",
//     lastName: "Blah",
//     profilePicture: new Uint8Array(),
//     nickname: "",
//     jobTitle: "",
//     organisation: "",
//   },
//   phone: [],
//   postal: [],
//   email: [],
//   isFavourite: true,
//   presence: undefined,
//   im: undefined,
// };

// const emptyUidBinary = pb.contacts.Contact.encode(emptyUidContact).finish();
// const listBinary = pb.contacts.ContactList.encode({
//   contact: [normalContact, emptyUidContact],
// }).finish();

// describe("WISPA client", () => {
//   it("drops a contact with an empty UID", async () => {
//     const spyOnDataFan = jest.spyOn(dataFan, "handleMessage");
//     handleData<Contact>(emptyUidBinary, contactConverter);
//     expect(spyOnDataFan).toHaveBeenCalledTimes(0);
//   });

//   it("drops a contact with an empty UID from a list of 1", async () => {
//     const blankWispaMessage = new WispaMessage();
//     const spyOnDataFan = jest.spyOn(dataFan, "handleMessage");
//     handleDataList<Contact>(listBinary, contactConverter);
//     expect(spyOnDataFan).toHaveBeenCalledTimes(1);
//     expect(spyOnDataFan).toHaveBeenCalledWith(blankWispaMessage);
//   });

//   it("drops a contact with an empty UID from a list of 2", async () => {
//     const gandalfWispaMessage = new WispaMessage();
//     gandalfWispaMessage.dataList.contacts = [protoGandalf];
//     const spyOnDataFan = jest.spyOn(dataFan, "handleMessage");
//     handleDataList<Contact>(listBinary, contactConverter);
//     expect(spyOnDataFan).toHaveBeenCalledTimes(1);
//     expect(spyOnDataFan).toHaveBeenCalledWith(gandalfWispaMessage);
//   });
// });
