// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import { PhoneNumber, Contact } from "src/types";
import { StoreState } from "store/types";
import log from "src/renderer-logging";

/**
 * Given a uid, returns the Contact found with that uid, or null if no matches.
 */
export const selectContactWithUid =
  (uid: string) =>
  (state: StoreState): Contact | null => {
    const matches: Contact[] = state.contactReducer.contacts.filter(
      (contact: Contact) => contact.uid === uid
    );

    if (matches.length > 0) {
      if (matches.length > 1) log.error("Multiple contacts found with same UID, selecting first");
      return matches[0];
    } else {
      return null;
    }
  };

/**
 * Given a phone number, returns all Contacts with that number
 *
 * The provided number can be a string or a `PhoneNumber`, i.e. these are equivalent:
 * ```
 * const contact = selectContactFromPhoneNumber("02083627005")
 * const contact = selectContactFromPhoneNumber({value: "02083627005", type: 1})
 * ```
 */
export const selectAllContactsWithPhoneNumber =
  (number: string | PhoneNumber) =>
  (state: StoreState): Contact[] => {
    let dn: string;
    if (typeof number === "string") {
      dn = number;
    } else {
      dn = number.value;
    }

    return state.contactReducer.contacts.filter((contact: Contact) =>
      contact.phone.some((phoneNumber) => phoneNumber.value === dn)
    );
  };

/**
 * Given a phone number, returns the first Contact found with that number, or null if no matches.
 *
 * The provided number can be a string or a `PhoneNumber`, i.e. these are equivalent:
 * ```
 * const contact = selectContactFromPhoneNumber("02083627005")
 * const contact = selectContactFromPhoneNumber({value: "02083627005", type: 1})
 * ```
 */
export const selectOneContactWithPhoneNumber =
  (number: string | PhoneNumber) =>
  (state: StoreState): Contact | null => {
    const matches = selectAllContactsWithPhoneNumber(number)(state);

    if (matches.length > 0) {
      return matches[0];
    } else {
      return null;
    }
  };

/**
 * Returns all Contacts that are favourites
 */
export const selectFavourites =
  () =>
  (state: StoreState): Contact[] =>
    state.contactReducer.contacts.filter((contact: Contact) => contact.isFavourite);
