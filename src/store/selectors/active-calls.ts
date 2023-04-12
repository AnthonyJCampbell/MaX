// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import { Uid, ActiveCall, Contact, PhoneNumber } from "src/types";
import { StoreState } from "store/types";

/**
 * Returns the first ActiveCall with a given Uid, or null if no matches.
 */
// Convert this "any" to the Redux state interface when we convert Redux to TypeScript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const selectActiveCallFromUid =
  (uid: Uid) =>
  (state: StoreState): ActiveCall | null => {
    const matches: ActiveCall[] = state.activeCallsReducer.activeCalls.filter(
      (call: ActiveCall) => call.uid === uid
    );

    if (matches.length > 0) {
      return matches[0];
    } else {
      return null;
    }
  };

/**
 * Return the first ActiveCall with a given Contact, or null if no matches
 */
export const selectOneActiveCallWithContact =
  (contact: Contact) =>
  (
    // Convert this "any" to the Redux state interface when we convert Redux to TypeScript
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    state: StoreState
  ): ActiveCall | null => {
    const allActiveCalls: ActiveCall[] = state.activeCallsReducer.activeCalls.filter(
      (call: ActiveCall) =>
        contact.phone.some((phoneNumber: PhoneNumber) => phoneNumber.value === call.remoteParty)
    );

    if (allActiveCalls.length > 0) {
      return allActiveCalls[0];
    } else {
      return null;
    }
  };
