// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Collection of useful HistoricCalls for testing with.
 */
import { CallType, HistoricCall } from "shared/types";
import * as pb from "protobuf-wispa";
import deepFreeze from "deep-freeze";
import { ReadonlyDeep } from "type-fest";

import { peter, gandalf } from "shared/mocks/mock-contacts";

const internalMissedHistoricCall = {
  uid: "missed-historic-call-uid",
  remoteParty: gandalf.phone[0].value,
  datetimeStarted: "2020-12-01T14:02:21.123",
  duration: 0,
  type: CallType.MISSED,
  attention: true,
  displayName: gandalf.phone[0].value,
};
/**
 * An historic call inbound from Gandalf to the logged in user that was missed
 */
export const missedHistoricCall: ReadonlyDeep<HistoricCall> = deepFreeze(
  internalMissedHistoricCall
);
/**
 * An historic call from Gandalf to the logged in user that was missed
 *
 * (Protobuf format)
 */
export const protoMissedHistoricCall: ReadonlyDeep<pb.callhistory.HistoricCall> = deepFreeze(
  internalMissedHistoricCall
);

const internalInboundHistoricCall = {
  uid: "inbound-historic-call-uid",
  remoteParty: peter.phone[0].value,
  datetimeStarted: "2019-01-31T21:13:42.486",
  duration: 124532,
  type: CallType.IN,
  attention: false,
  displayName: peter.phone[0].value,
};
/**
 * An historic call inbound from Peter to the logged in user that was answered
 */
export const inboundHistoricCall: ReadonlyDeep<HistoricCall> = deepFreeze(
  internalInboundHistoricCall
);
/**
 * An historic call from Gandalf to the logged in user that was answered
 *
 * (Protobuf format)
 */
export const protoInboundHistoricCall: ReadonlyDeep<pb.callhistory.HistoricCall> = deepFreeze(
  internalInboundHistoricCall
);

const internalOutboundHistoricCall: HistoricCall = {
  uid: "outbound-historic-call-uid",
  remoteParty: gandalf.phone[0].value,
  datetimeStarted: "2018-11-22T08:32:13.452",
  duration: 2,
  type: CallType.OUT,
  attention: false,
  displayName: gandalf.phone[0].value,
};
/**
 * An historic call outbound from the logged in user to Gandalf
 */
export const outboundHistoricCall: ReadonlyDeep<HistoricCall> = deepFreeze(
  internalOutboundHistoricCall
);
/**
 * An historic call outbound from the logged in user to Gandalf
 *
 * (Protobuf format)
 */
export const protoOutboundHistoricCall: ReadonlyDeep<pb.callhistory.HistoricCall> = deepFreeze(
  internalOutboundHistoricCall
);
