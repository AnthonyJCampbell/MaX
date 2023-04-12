// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import * as pb from "protobuf-wispa";
import deepFreeze from "deep-freeze";

import { gandalf } from "./mock-contacts";
import { gandalfCall } from "./mock-active-calls";
import { ReadonlyDeep } from "type-fest";
import { Meeting } from "shared/types";

if (gandalf.im === undefined) {
  throw new Error("Gandalf's IM address was undefined so can't build a Meeting with him. Abort.");
}
const internalUpliftGandalfCallToMeeting = {
  remoteParty: [gandalf.im],
  upliftCall: gandalfCall.uid,
  uid: "uplift-gandalf-call-to-meeting-uid",
};
/**
 * A meeting that uplifts a call between the logged in user and Gandalf
 */
export const upliftGandalfCallToMeeting: ReadonlyDeep<Meeting> = deepFreeze(
  internalUpliftGandalfCallToMeeting
);
/**
 * A meeting that uplifts a call between the logged in user and Gandalf
 *
 * (Protobuf format)
 */
export const protoUpliftGandalfCallToMeeting: ReadonlyDeep<pb.meetings.Meeting> = deepFreeze(
  internalUpliftGandalfCallToMeeting
);

const internalLoggedInUserMeeting = {
  remoteParty: [],
  upliftCall: "",
  uid: "logged-in-user-meeting",
};
/**
 * A blank meeting used to say that the user is in a meeting
 */
export const loggedInUserMeeting: ReadonlyDeep<Meeting> = deepFreeze(internalLoggedInUserMeeting);
/**
 * A blank meeting used to say that the user is in a meeting
 *
 * (Protobuf format)
 */
export const protoLoggedInUserMeeting: ReadonlyDeep<pb.meetings.Meeting> = deepFreeze(
  internalLoggedInUserMeeting
);
