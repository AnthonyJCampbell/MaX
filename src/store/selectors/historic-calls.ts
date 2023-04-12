// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import { HistoricCall, Contact, PhoneNumber } from "src/types";
import { StoreState } from "store/types";

/**
 * Returns all HistoricCalls matching a contact.
 */
export const selectHistoricCallsWithContact =
  (contact: Contact) =>
  (state: StoreState): HistoricCall[] => {
    return state.callHistoryReducer.historicCalls.filter((call: HistoricCall) =>
      contact.phone.some((phoneNumber: PhoneNumber) => phoneNumber.value === call.remoteParty)
    );
  };
