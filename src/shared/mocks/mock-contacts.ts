// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Collection of useful contacts for testing with
 */

import * as pb from "protobuf-wispa";
import { Contact, PresenceState, PhoneNumberType, PostalAddressType } from "shared/types";
import { Contact as ContactClass } from "src/types";
import {
  bilboAvatarBinary,
  bilboAvatarDataUrl,
  peterAvatarBinary,
  peterAvatarDataUrl,
  gandalfAvatarBinary,
  gandalfAvatarDataUrl,
} from "./mock-contact-avatars";

import deepFreeze from "deep-freeze";
import { ReadonlyDeep } from "type-fest";
import { ReadonlyObjectDeep } from "type-fest/source/readonly-deep";
import { noSelectedContactUid } from "shared/constants";

/**
 * deepFreeze causes a runtime error if it tries to freeze a Uint8Array. So work around it by
 * manually freezing the top level object and the identity.
 */
const freezeAllButPicture = (contact: ReadonlyObjectDeep<pb.contacts.Contact>): void => {
  Object.freeze(contact);
  Object.freeze(contact.identity);
  deepFreeze(contact.phone);
  deepFreeze(contact.postal);
  deepFreeze(contact.email);
  deepFreeze(contact.presence);
  deepFreeze(contact.types);
};

const internalBilbo = {
  phone: [{ value: "0123456789", type: PhoneNumberType.WORK_NUMBER }],
  postal: [
    {
      line: ["Bag End", "1 Bagshot Row", "Hobbiton", "Shire"],
      type: PostalAddressType.HOME_ADDRESS,
    },
  ],
  email: [{ address: "bilbo@eagles.middleearth.arda" }],
  uid: "bilbo-contact-uid",
  identity: {
    firstName: "Bilbo",
    lastName: "Baggins",
    nickname: "Barrel Rider",
    jobTitle: "Ring Bearer",
    organisation: "The Fellowship of the Ring",
    profilePicture: bilboAvatarDataUrl,
  },
  types: {
    typeGroupContact: false,
    typeIMContact: false,
    typeBGContact: false,
    typePersonalContact: true,
  },
  // Deliberately no im to increase variety
  // im: {},
  presence: { state: PresenceState.ONLINE, customStatus: "I'm Going On An Adventure!" },
  isFavourite: false,
  notifyWhenAvailable: false,
  isTyping: false,
};
/**
 * A contact modeled after Bilbo Baggins. No notable features apart from being very full
 */
export const bilbo: ReadonlyDeep<typeof internalBilbo> = deepFreeze(internalBilbo);

const protoBilboMutable = {
  ...internalBilbo,
  identity: {
    ...internalBilbo.identity,
    profilePicture: bilboAvatarBinary,
  },
  im: undefined,
};
/**
 * A contact modeled after Bilbo Baggins. No notable features apart from being very full
 *
 * (Protobuf format)
 */
export const protoBilbo: ReadonlyDeep<typeof protoBilboMutable> = protoBilboMutable;
freezeAllButPicture(protoBilbo);

const internalGandalf = {
  phone: [
    { value: "01178036241", type: PhoneNumberType.MOBILE_NUMBER },
    { value: "2083631400", type: PhoneNumberType.FAX_NUMBER },
  ],
  postal: [
    { line: ["The Undying Lands", "Over the 🌊"], type: PostalAddressType.WORK_ADDRESS },
    { line: ["ネノハ  ǳǴǵǶǷǸǹǺ", "ഝഞ  ปผ", "ᎾᎿᏀᏁ"], type: PostalAddressType.HOME_ADDRESS },
  ],
  // Deliberately no email to increase variety
  email: [],
  uid: "gandalf-contact-uid",
  identity: {
    firstName: "Gandalf",
    lastName: "The ⚪",
    nickname: "⺴⻉⻛ 㑘㑺 ネノハ",
    jobTitle: "The Wizard",
    organisation: "The Valar",
    profilePicture: gandalfAvatarDataUrl,
  },
  types: {
    typeGroupContact: false,
    typeIMContact: true,
    typeBGContact: true,
    typePersonalContact: true,
  },
  im: { value: "123@wizard.com" },
  presence: { state: PresenceState.IN_A_CALL, customStatus: "🧙‍♂️ 🔥 👹 ✔ ਅਨਾਨਾਸ" },
  isFavourite: false,
  notifyWhenAvailable: true,
  isTyping: false,
};
/**
 * A contact modeled after Gandalf The White
 *
 * Has no email addresses
 */
export const gandalf: ReadonlyDeep<typeof internalGandalf> = deepFreeze(internalGandalf);

const protoGandalfMutable = {
  ...internalGandalf,
  identity: {
    ...internalGandalf.identity,
    profilePicture: gandalfAvatarBinary,
  },
};

/**
 * A contact modeled after Gandalf The White
 *
 * Has no email addresses
 *
 * (Protobuf format)
 */
export const protoGandalf: ReadonlyDeep<typeof protoGandalfMutable> = protoGandalfMutable;
freezeAllButPicture(protoGandalf);

const internalGandalfEmojiless = {
  ...internalGandalf,
  postal: [
    { line: ["The Undying Lands", "Over the ocean"], type: PostalAddressType.WORK_ADDRESS },
    { line: ["Very", "Alphabetical", "Address"], type: PostalAddressType.HOME_ADDRESS },
  ],
  // Deliberately no email to increase variety
  identity: {
    ...internalGandalf.identity,
    firstName: "Gandalf",
    lastName: "The White",
    nickname: "Nickname with no foreign letters",
  },
  presence: {
    ...internalGandalf.presence,
    customStatus: "✔ ਅਨਾਨਾਸ",
  },
};
/**
 * A contact modeled after Gandalf The White Without Emojis
 *
 * Has no email addresses
 */
export const gandalfEmojiless: ReadonlyDeep<typeof internalGandalfEmojiless> =
  deepFreeze(internalGandalfEmojiless);

const protoGandalfEmojilessMutable = {
  ...internalGandalfEmojiless,
  identity: {
    ...internalGandalfEmojiless.identity,
    profilePicture: gandalfAvatarBinary,
  },
};
/**
 * A contact modeled after Gandalf The White Without Emojis
 *
 * Has no email addresses
 *
 * (Protobuf format)
 */
export const protoGandalfEmojiless: ReadonlyDeep<typeof protoGandalfEmojilessMutable> =
  protoGandalfEmojilessMutable;
freezeAllButPicture(protoGandalfEmojiless);

const internalPeter = {
  phone: [{ value: "01184937456", type: PhoneNumberType.OTHER_NUMBER }],
  postal: [{ line: ["64 Zoo Lane", "New York", "USA"], type: PostalAddressType.HOME_ADDRESS }],
  email: [{ address: "wetre@rhreh.co.uk" }, { address: "heryye@trhrteh.com" }],
  uid: "peter-contact-uid",
  identity: {
    firstName: "Peter",
    lastName: "Parker",
    nickname: "Spiderman",
    jobTitle: "Head Avenger I guess?",
    organisation: "The Avengers",
    profilePicture: peterAvatarDataUrl,
  },
  types: {
    typeGroupContact: false,
    typeIMContact: false,
    typeBGContact: false,
    typePersonalContact: true,
  },
  im: { value: "peter@dailyBugle.com" },
  presence: { state: PresenceState.OFFLINE, customStatus: "" },
  isFavourite: false,
  notifyWhenAvailable: false,
  isTyping: false,
};
/**
 * A contact modeled after Peter Parker
 */
export const peter: ReadonlyDeep<Contact> = deepFreeze(internalPeter);

const protoPeterMutable = {
  ...internalPeter,
  identity: {
    ...internalPeter.identity,
    profilePicture: peterAvatarBinary,
  },
};

/**
 * A contact modeled after Peter Parker
 *
 * (Protobuf format)
 */
export const protoPeter = protoPeterMutable as ReadonlyDeep<typeof protoPeterMutable>;

freezeAllButPicture(protoPeter);

const internalLongName = {
  phone: [],
  postal: [],
  email: [],
  uid: "longName-contact-uid",
  identity: {
    firstName: "LOOOOOoooooong",
    lastName: "Naaaaaaaaaaaaaaaaaame",
    nickname: "LOOOOOoooooong Naaaaaaaaaaaaaaaaaame",
    jobTitle: "",
    organisation: "",
  },
  types: {
    typeGroupContact: false,
    typeIMContact: false,
    typeBGContact: false,
    typePersonalContact: true,
  },
  im: { value: "longName@dailyBugle.com" },
  presence: { state: PresenceState.ONLINE, customStatus: "" },
  isFavourite: false,
  notifyWhenAvailable: false,
  isTyping: false,
};
/**
 * A contact modeled with long name
 */
export const longName: ReadonlyDeep<Contact> = deepFreeze(internalLongName);

const internalNonContact = ContactClass.fromPhoneNumber("01178036255");
/**
 * A non contact to be used
 */
export const nonContact: ReadonlyDeep<typeof internalNonContact> = deepFreeze(internalNonContact);
/**
 * A non contact to be used
 *
 * (Protobuf format)
 */
export const protoNonContact: ReadonlyDeep<pb.contacts.Contact> = {
  ...nonContact,
  identity: undefined,
  presence: undefined,
  im: undefined,
  isFavourite: false,
  types: {
    typeGroupContact: false,
    typeIMContact: false,
    typeBGContact: false,
    typePersonalContact: false,
  },
};

const internalNoName = {
  phone: [],
  postal: [],
  email: [],
  uid: "no-name-contact-uid",
  types: {
    typeGroupContact: false,
    typeIMContact: false,
    typeBGContact: false,
    typePersonalContact: true,
  },

  isFavourite: false,
  notifyWhenAvailable: false,
  isTyping: false,
};
/**
 * A minimal contact, in particular with no identity
 */
export const noName: ReadonlyDeep<typeof internalNoName> = deepFreeze(internalNoName);
/**
 * A minimal contact, in particular with no identity
 *
 * (Protobuf format)
 */
export const protoNoName: ReadonlyDeep<pb.contacts.Contact> = deepFreeze({
  ...internalNoName,
  // Have to manually set these to undefined for now. We should update our usage of ts-proto to
  // make it use `?` instead of `| undefined`, then we won't have to do this, can just leave the
  // fields off
  presence: undefined,
  im: undefined,
  identity: undefined,
});

/**
 * The dummy contact we set as selected before the user has selected a contact
 */
export const initialSelected: ReadonlyDeep<Contact> = deepFreeze({
  phone: [],
  postal: [],
  email: [],
  uid: noSelectedContactUid,
  isFavourite: false,
  notifyWhenAvailable: false,
  isTyping: false,
});
