// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Collection of ActiveCalls to test with
 */
import { ActiveCall, CallStatus } from "shared/types";
import * as pb from "protobuf-wispa";
import deepFreeze from "deep-freeze";
import { ReadonlyDeep } from "type-fest";

import { gandalf, bilbo, nonContact } from "./mock-contacts";

const now = new Date(Date.now()).toISOString();

const internalBilboCall = {
  datetimeStarted: now,
  uid: "bilbo-active-call-uid",
  remoteParty: bilbo.phone[0].value,
  status: CallStatus.CURRENT,
  microphoneIsMuted: false,
};
/**
 * A current call from Bilbo
 */
export const bilboCall: ReadonlyDeep<ActiveCall> = deepFreeze(internalBilboCall);
/**
 * A current call from Bilbo
 *
 * (Protobuf format)
 */
export const protoBilboCall: ReadonlyDeep<pb.activecalls.ActiveCall> =
  deepFreeze(internalBilboCall);

const internalGandalfCall = {
  datetimeStarted: now,
  uid: "gandalf-active-call-uid",
  remoteParty: gandalf.phone[0].value,
  status: CallStatus.CURRENT,
  microphoneIsMuted: false,
};
/**
 * A current call from Gandalf
 */
export const gandalfCall: ReadonlyDeep<ActiveCall> = deepFreeze(internalGandalfCall);
/**
 * A current call from Gandalf
 *
 * (Protobuf format)
 */
export const protoGandalfCall: ReadonlyDeep<pb.activecalls.ActiveCall> =
  deepFreeze(internalGandalfCall);

const internalNonContactCall = {
  datetimeStarted: now,
  uid: "non-contact-active-call-uid",
  remoteParty: nonContact.phone[0].value,
  status: CallStatus.CURRENT,
  microphoneIsMuted: false,
};

/**
 * A current call from a non contact
 */
export const nonContactCall: ReadonlyDeep<ActiveCall> = deepFreeze(internalNonContactCall);

/**
 * A current call from a non contact
 *
 * (Protobuf format)
 */
export const protoNonContactCall: ReadonlyDeep<pb.activecalls.ActiveCall> =
  deepFreeze(internalNonContactCall);
