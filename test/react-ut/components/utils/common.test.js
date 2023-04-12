// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import * as req from "test/react-ut/components/require-mock";
import * as out from "components/utils/common";
import { peter, bilbo, gandalf } from "shared/mocks/mock-contacts";
import { chatWithGandalf, chatWithNewMessageFromGandalf } from "shared/mocks/mock-chats";
import Online from "assets/shared/presence-online.svg";
import Offline from "assets/shared/presence-offline.svg";
import each from "jest-each";
import { mutableCloneDeep, mockedT } from "shared/mocks/ts-utils";
import { ipcChannels } from "shared/constants";
import log from "src/renderer-logging";

jest.mock("src/renderer-logging");
jest.mock("node-server/pane-control/window-lifecycle");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => log.test(`End running: ${expect.getState().currentTestName}`));

describe("Full name", () => {
  it("Returns a default", () => {
    const bilboNoName = mutableCloneDeep(bilbo);
    bilboNoName.identity.firstName = "";
    bilboNoName.identity.lastName = "";
    const output = out.fullname(bilboNoName);
    expect(output).toEqual(mockedT("noName"));
  });

  it("Handles no identity", () => {
    const bilboNoID = mutableCloneDeep(bilbo);
    bilboNoID.identity = undefined;
    const output = out.fullname(bilboNoID);
    expect(output).toEqual(mockedT("noName"));
  });

  it("Returns just the first name", () => {
    const bilboNoLastName = mutableCloneDeep(bilbo);
    bilboNoLastName.identity.lastName = "";
    const output = out.fullname(bilboNoLastName);
    expect(output).toEqual(bilboNoLastName.identity.firstName);
  });

  it("Returns just the last name", () => {
    const bilboNoFirstName = mutableCloneDeep(bilbo);
    bilboNoFirstName.identity.firstName = "";
    const output = out.fullname(bilboNoFirstName);
    expect(output).toEqual(bilboNoFirstName.identity.lastName);
  });

  each([
    ["peter", peter],
    ["unicode", bilbo],
    ["gandalf", gandalf],
  ]).it("Returns the full name for %s", (_testName, contact) => {
    const output = out.fullname(contact);
    expect(output).toEqual(`${contact.identity.firstName} ${contact.identity.lastName}`);
  });
});

describe("Pretty presence", () => {
  it("Formats an expected presence state value for a contact", () => {
    const output = out.prettyPresence(bilbo.presence.state);
    expect(output).toEqual(mockedT("online"));
  });

  it("Works with a non-standard state", () => {
    const bilboNonStandardPresence = mutableCloneDeep(bilbo);
    bilboNonStandardPresence.presence.state = "NonStandard";
    const output = out.prettyPresence(bilboNonStandardPresence.presence.state);
    expect(output).toEqual(mockedT("unknown"));
  });
});

describe("Pretty presence with Custom Status", () => {
  it("Returns null when the contact has no presence", () => {
    const bilboNoPresence = mutableCloneDeep(bilbo);
    bilboNoPresence.presence = null;
    const output = out.prettyPresenceWithStatus(bilboNoPresence);
    expect(output).toBeNull();
  });

  it("Formats an expected presence state value and custom status for a contact", () => {
    const output = out.prettyPresenceWithStatus(bilbo);
    expect(output).toEqual(`${mockedT("online")} - I'm Going On An Adventure!`);
  });

  it("Formats an expected presence state value and no custom status for a contact", () => {
    const bilboNoStatus = mutableCloneDeep(bilbo);
    bilboNoStatus.presence.customStatus = null;
    const output = out.prettyPresenceWithStatus(bilboNoStatus);
    expect(output).toEqual(mockedT("online"));
  });

  it("Works with a non-standard state with custom status", () => {
    const bilboNonStandardPresence = mutableCloneDeep(bilbo);
    bilboNonStandardPresence.presence.state = "NonStandard";
    const output = out.prettyPresenceWithStatus(bilboNonStandardPresence);
    expect(output).toEqual(`${mockedT("unknown")} - I'm Going On An Adventure!`);
  });

  it("Works with a non-standard state without custom status", () => {
    const bilboNonStandardPresenceNoStatus = mutableCloneDeep(bilbo);
    bilboNonStandardPresenceNoStatus.presence.state = "NonStandard";
    bilboNonStandardPresenceNoStatus.presence.customStatus = null;
    const output = out.prettyPresenceWithStatus(bilboNonStandardPresenceNoStatus);
    expect(output).toEqual(mockedT("unknown"));
  });
});

describe("Pretty contact detail type", () => {
  it("Formats an expected phone type for a contact", () => {
    const output = out.prettyContactDetailType(bilbo.phone[0].type);
    expect(output).toEqual(mockedT("work"));
  });

  it("Formats an expected postal type for a contact", () => {
    const output = out.prettyContactDetailType(bilbo.postal[0].type);
    expect(output).toEqual(mockedT("home"));
  });

  it("Works when type is empty", () => {
    const output = out.prettyContactDetailType("");
    expect(output).toEqual("");
  });
});

describe("Pretty call duration", () => {
  it("Returns seconds only", () => {
    const output = out.prettyCallDuration(1);
    expect(output).toEqual("00:01");
  });

  it("Returns minutes", () => {
    const output = out.prettyCallDuration(610);
    expect(output).toEqual("10:10");
  });

  it("Returns hours", () => {
    const output = out.prettyCallDuration(3602);
    expect(output).toEqual("01:00:02");
  });

  it("Returns hundreds of hours", () => {
    const output = out.prettyCallDuration(360000);
    expect(output).toEqual("100:00:00");
  });
});

describe("A11y call duration", () => {
  it("Returns seconds and minutes only", () => {
    const output = out.a11yCallDuration(610);
    expect(output).toEqual(
      `${mockedT("callDuration", {
        hours: 0,
        minutes: 10,
        seconds: 10,
        count: 0,
        postProcess: "interval",
      })}`
    );
  });
  it("Returns hours", () => {
    const output = out.a11yCallDuration(3602);
    expect(output).toEqual(
      `${mockedT("callDuration", {
        hours: 1,
        minutes: 0,
        seconds: 2,
        count: 1,
        postProcess: "interval",
      })}`
    );
  });
});

describe("Presence image switch", () => {
  it("Works with a contact", () => {
    const output = out.setPresence(bilbo.presence.state);
    expect(output).toEqual(Online);
  });

  it("Works with a non-standard state", () => {
    const output = out.setPresence("Non-sense");
    expect(output).toEqual(Offline);
  });

  it("Works with an empty state", () => {
    const output = out.setPresence("");
    expect(output).toEqual(Offline);
  });
});

describe("Tippy resize callback", () => {
  it("Works", () => {
    out.tippyResizeWindowCallback("test", { otherIdentifier: 456 }, 10, 20);
    expect(req.ipcSendSpy).toHaveBeenCalledWith(ipcChannels.resizeWindow, {
      identifiers: { type: "test", otherIdentifier: 456 },
      width: null,
      height: 10,
    });
  });
});

describe("Chat attention", () => {
  it("Returns true when the latest message in the chat is unread", () => {
    const attention = out.chatAttention(chatWithNewMessageFromGandalf, peter, "chat", true);
    expect(attention).toEqual(true);
  });
  it("Returns false when the latest message in the chat is read", () => {
    const attention = out.chatAttention(chatWithGandalf, peter, "chat", true);
    expect(attention).toEqual(false);
  });
  it("Returns true when all the messages in the chat are unread", () => {
    const unreadChatWithGandalf = mutableCloneDeep(chatWithGandalf);
    unreadChatWithGandalf.message.forEach((m) => (m.read = false));
    const attention = out.chatAttention(unreadChatWithGandalf, peter, "chat", true);
    expect(attention).toEqual(true);
  });
  it("Ignores earlier erroneously unread messages", () => {
    const errorUnreadChatWithGandalf = mutableCloneDeep(chatWithGandalf);
    errorUnreadChatWithGandalf.message[1].read = false;
    const attention = out.chatAttention(errorUnreadChatWithGandalf, peter, "chat", true);
    expect(attention).toEqual(false);
  });
  it("Works with a misordered chat", () => {
    const misorderedChatWithGandalf = mutableCloneDeep(chatWithGandalf);
    misorderedChatWithGandalf.message[1].read = false;
    misorderedChatWithGandalf.message = misorderedChatWithGandalf.message.sort((a, b) => a - b);
    const attention = out.chatAttention(misorderedChatWithGandalf, peter, "chat", true);
    expect(attention).toEqual(false);
  });
  it("Returns false when the chat is being viewed", () => {
    const attention = out.chatAttention(chatWithNewMessageFromGandalf, gandalf, "chat", true);
    expect(attention).toEqual(false);
  });
});

describe("Remove number formatting", () => {
  each([
    ["123456", "123456"],
    ["+12025550168", "+12025550168"],
    ["#1234", "#1234"],
    ["65243628*77#23", "65243628*77#23"],
    ["0101 0202  0303", "010102020303"],
    ["(+1) 2345-6789-123", "+123456789123"],
    ["0987.654.321", "0987654321"],
    ["123,456,789", "123456789"],
  ]).it("Removes formatting from '%s'", (formattedNumber, unformattedNumber) => {
    const output = out.removeNumberFormatting(formattedNumber);
    expect(output).toEqual(unformattedNumber);
  });
});
