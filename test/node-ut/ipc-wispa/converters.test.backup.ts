// Copyright 2021 Metaswitch Networks - Highly Confidential Material
// We would like to have these tests, but they don't work due to https://jira.metaswitch.com/browse/DUIR-2018

// import { activeCallConverter } from "node-server/ipc-wispa/converters";

// import * as pb from "protobuf-wispa";
// import {mutableCloneDeep} from "shared/mocks/ts-utils"

// import { CallStatus } from "shared/types";

// While this is disabled, don't check it!
/* eslint-disable jest/no-commented-out-tests */

// const { bilboCurrent, protoGandalfConnecting } = require("shared/mocks/mock-active-calls");

// const bilboNoMicrophoneMutedField = mutableCloneDeep(bilboCurrent);
// bilboNoMicrophoneMutedField.microphoneIsMuted = undefined;

// const bilboNoStatusField = mutableCloneDeep(bilboCurrent);
// bilboNoStatusField.status = undefined;

// const encodedBilboCurrent = pb.activecalls.ActiveCall.encode(bilboCurrent).finish();
// const encodedBilboNoStatusField = pb.activecalls.ActiveCall.encode(bilboNoStatusField).finish();
// const encodedBilboNoMicrophoneMutedField = pb.activecalls.ActiveCall.encode(
//   bilboNoMicrophoneMutedField
// ).finish();
// const encodedList = pb.activecalls.ActiveCallList.encode({
//   activeCall: [bilboCurrent, { ...protoGandalfConnecting, datetimeStarted: "" }],
// }).finish();

// describe("activeCallConverter", () => {
//   it("Decodes a valid ActiveCall", () => {
//     const result = activeCallConverter.decode(encodedBilboCurrent);
//     expect(result.isOk()).toBe(true);
//   });
//   it("Decodes a list of valid ActiveCalls", () => {
//     const result = activeCallConverter.decodeList(encodedList);
//     expect(result).toHaveLength(1);
//     expect(result[0].isOk()).toBe(true);
//   });
//   it("Rejects an ActiveCall with no 'microphoneIsMuted' field", () => {
//     const result = activeCallConverter.decode(encodedBilboNoMicrophoneMutedField);
//     expect(result.isErr()).toBe(true);
//     result.match(
//       () => {
//         console.error("Unreachable branch");
//       },
//       (decodeErrors) => {
//         expect(decodeErrors.errorTexts).toHaveLength(1);
//         expect(decodeErrors.errorTexts[0]).toBe("Missing field - microphoneIsMuted");
//       }
//     );
//   });
//   it("Rejects an ActiveCall with no 'status' field", () => {
//     const result = activeCallConverter.decode(encodedBilboNoStatusField);
//     expect(result.isErr()).toBe(true);
//     result.match(
//       () => {
//         console.error("Unreachable branch");
//       },
//       (decodeErrors) => {
//         expect(decodeErrors.errorTexts).toHaveLength(1);
//         expect(decodeErrors.errorTexts[0]).toBe("Missing field - status");
//       }
//     );
//   });
//   it("Defaults missing fields when told to", () => {
//     const statusResult = activeCallConverter.decode(encodedBilboNoStatusField);
//     const muteResult = activeCallConverter.decode(encodedBilboNoMicrophoneMutedField);

//     expect(statusResult.isOk()).toBe(true);
//     expect(muteResult.isOk()).toBe(true);

//     statusResult.match(
//       (activeCall) => {
//         expect(activeCall.status).toBe(CallStatus.UNRECOGNIZED);
//       },
//       () => {
//         console.error("Unreachable branch");
//       }
//     );
//     muteResult.match(
//       (activeCall) => {
//         expect(activeCall.microphoneIsMuted).toBe(false);
//       },
//       () => {
//         console.error("Unreachable branch");
//       }
//     );
//   });
// });
