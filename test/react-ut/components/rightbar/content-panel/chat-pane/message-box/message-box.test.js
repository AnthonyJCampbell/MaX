// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";
import * as redux from "react-redux";
import dedent from "dedent-js";
import each from "jest-each";

import "test/react-ut/components/require-mock";
import * as req from "test/react-ut/components/require-mock";
import MessageBox from "src/components/rightbar/content-panel/chat-pane/message-box/message-box";
import { createChatMessage } from "action-creators/ipc-outgoing/messaging-actions";
import { sendTypingIndicator } from "action-creators/ipc-outgoing/contacts-actions";
import TextareaAutosize from "react-textarea-autosize";
import { getOperatingSystem, orderMessagesFromChats } from "components/utils/common";

import { gandalf } from "shared/mocks/mock-contacts";
import { emojiMessage } from "shared/mocks/mock-chats";
import { mockedT } from "shared/mocks/ts-utils";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("react-redux");
jest.mock("action-creators/ipc-outgoing/messaging-actions");
jest.mock("action-creators/ipc-outgoing/contacts-actions");
jest.mock("components/utils/common");
jest.mock("src/renderer-logging");
jest.mock("components/utils/phone-formatter");

const mockState = {
  contactReducer: {
    selectedContact: gandalf,
  },
  messagingReducer: {
    chats: [],
    drafts: {},
  },
  paneManagementReducer: {
    forceMessageRemoteParty: "",
    focusMessage: 0,
  },
  settingsReducer: {
    settings: {
      general: { easRegion: "GB" },
    },
  },
};

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

describe("<MessageBox />", () => {
  beforeEach(() => {
    const useSelectorMock = jest.spyOn(redux, "useSelector");
    useSelectorMock.mockImplementation((callback) => callback(mockState));
    orderMessagesFromChats.mockReturnValue([]);

    const useDispatchMock = jest.spyOn(redux, "useDispatch");
    useDispatchMock.mockReturnValue(jest.fn());
  });

  /**
   * Simulate typing a message into the given MessageBox's textarea. This removes any existing
   * message
   * @param {*} message
   * @param {*} messageBox
   */
  const typeMessage = (message, messageBox) => {
    messageBox.find(TextareaAutosize).simulate("change", {
      target: { value: message },
    });
  };

  /**
   * Simulate pressing a given key. Usually "Enter" to send a message
   * @param {*} key
   * @param {*} messageBox
   */
  const pressKey = (key, messageBox) => {
    messageBox.find(TextareaAutosize).simulate("keyDown", {
      key,
      preventDefault: () => {},
    });
  };

  /**
   * Fetch the contents of the textarea within the given MessageBox
   * @param {*} messageBox
   */
  const textareaContents = (messageBox) => {
    return messageBox.find(TextareaAutosize).first().props().value;
  };

  it('Sends on "Enter"', () => {
    const messageBox = shallow(<MessageBox />);
    const message = "Boring message";

    typeMessage(message, messageBox);
    pressKey("Enter", messageBox);

    expect(createChatMessage).toHaveBeenCalledWith(message, gandalf, "IM");
  });

  it("Has an empty box after a message is sent", () => {
    const messageBox = shallow(<MessageBox />);
    const message = "Boring message";

    typeMessage(message, messageBox);
    pressKey("Enter", messageBox);

    expect(textareaContents(messageBox)).toBe("");
  });

  it('Adds a new line on "Ctrl-Enter"', () => {
    const messageBox = shallow(<MessageBox />);
    const message = "Boring message";
    const pressCtrlEnter = () => {
      messageBox.find(TextareaAutosize).simulate("keyDown", {
        key: "Enter",
        ctrlKey: true,
        preventDefault: () => {},
      });
    };

    pressCtrlEnter();
    expect(textareaContents(messageBox)).toBe("\n");

    typeMessage(message, messageBox);
    pressCtrlEnter();
    expect(createChatMessage).toHaveBeenCalledTimes(0);
    expect(textareaContents(messageBox)).toBe(`${message}\n`);
  });
  it('Adds a new line on "Alt-Enter"', () => {
    const messageBox = shallow(<MessageBox />);
    const message = "Boring message";
    const pressAltEnter = () => {
      messageBox.find(TextareaAutosize).simulate("keyDown", {
        key: "Enter",
        altKey: true,
        preventDefault: () => {},
      });
    };

    pressAltEnter();
    expect(textareaContents(messageBox)).toBe("\n");

    typeMessage(message, messageBox);
    pressAltEnter();
    expect(createChatMessage).toHaveBeenCalledTimes(0);
    expect(textareaContents(messageBox)).toBe(`${message}\n`);
  });

  // Chromium adds a newline when typing shift-enter in a form, but does not for alt-enter and
  // ctrl-enter. This means the MessageBox code does not insert an extra newline when the user types
  // shift-enter - verify that behaviour here.
  it('Does not add a new line on "Shift-Enter" because Chromium does it for us', () => {
    const messageBox = shallow(<MessageBox />);
    const message = "Boring message";

    typeMessage(message, messageBox);
    messageBox.find(TextareaAutosize).simulate("keyDown", {
      key: "Enter",
      shiftKey: true,
      preventDefault: () => {},
    });

    expect(createChatMessage).toHaveBeenCalledTimes(0);
    expect(textareaContents(messageBox)).toBe(`${message}`);
  });
  it("Does not send a blank message", () => {
    const messageBox = shallow(<MessageBox />);

    pressKey("Enter", messageBox);

    expect(createChatMessage).toHaveBeenCalledTimes(0);
  });
  each([
    ["Sends a simple message", "This is a simple message"],
    [
      "Sends a multiline message",
      dedent`
      This is a big multiline message.


      It goes into excruciating detail on a complex topic.

      Here is the first point:
        - Hyphens are the superior bullet point marker`,
    ],
    ["Sends a 100,000 character message", "This message contains 100,000 characters".repeat(2500)],
    ["Sends a unicode message", emojiMessage.content],
    ["Sends a link", "https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
    [
      "Sends HTML",
      dedent`
      <html>
        <body>
          <div>
            Hello World!
          </div>
          <script>
            alert("Hello World!");
          </script>
        </body>
      </html>`,
    ],
    ["Sends JSON", "{ target: { value: 'Injected message' }, key: 'Enter' }"],
  ]).it("%s", (testName, message) => {
    const messageBox = shallow(<MessageBox />);

    typeMessage(message, messageBox);
    pressKey("Enter", messageBox);

    expect(createChatMessage).toHaveBeenCalledTimes(1);
    expect(createChatMessage).toHaveBeenCalledWith(message, gandalf, "IM");
  });

  it("Sends multiple messages", () => {
    const messageBox = shallow(<MessageBox />);
    const message1 = "Good evening";
    const message2 = "Thank you for coming";
    const message3 = "Have\n a \n nice \n \n \n time";

    typeMessage(message1, messageBox);
    pressKey("Enter", messageBox);
    expect(textareaContents(messageBox)).toBe("");
    expect(createChatMessage).toHaveBeenCalledTimes(1);
    expect(createChatMessage).toHaveBeenCalledWith(message1, gandalf, "IM");

    typeMessage(message2, messageBox);
    pressKey("Enter", messageBox);
    expect(textareaContents(messageBox)).toBe("");
    expect(createChatMessage).toHaveBeenCalledTimes(2);
    expect(createChatMessage).toHaveBeenCalledWith(message2, gandalf, "IM");

    typeMessage(message3, messageBox);
    pressKey("Enter", messageBox);
    expect(textareaContents(messageBox)).toBe("");
    expect(createChatMessage).toHaveBeenCalledTimes(3);
    expect(createChatMessage).toHaveBeenCalledWith(message3, gandalf, "IM");
  });
  it("Displays hint when there is text in the text area", () => {
    const messageBox = shallow(<MessageBox />);
    const message = "Boring message";
    typeMessage(message, messageBox);

    expect(messageBox.text()).toContain("pressEnterToSendMessage");
  });
  it("Displays Windows hint on Windows", () => {
    const messageBox = shallow(<MessageBox />);
    const message = "Boring message";

    getOperatingSystem.mockReturnValue("win32");

    typeMessage(message, messageBox);

    expect(messageBox.text()).toContain(
      mockedT("pressEnterToSendMessage", { platformMainModifierKey: "Ctrl" })
    );
  });
  it("Displays Mac hint on Mac", () => {
    const messageBox = shallow(<MessageBox />);
    const message = "Boring message";

    getOperatingSystem.mockReturnValue("macOS");

    typeMessage(message, messageBox);

    expect(messageBox.text()).toContain(
      mockedT("pressEnterToSendMessage", { platformMainModifierKey: "Cmd" })
    );
  });
  it("Does not display hint if there is no text in the text area", () => {
    const messageBox = shallow(<MessageBox />);
    const message = "Boring message";

    expect(messageBox.text()).not.toContain("pressEnterToSendMessage");

    typeMessage(message, messageBox);
    pressKey("Enter", messageBox);
    expect(messageBox.text()).not.toContain("pressEnterToSendMessage");

    typeMessage(message, messageBox);
    // Clear the previous message
    typeMessage("", messageBox);
    expect(messageBox.text()).not.toContain("pressEnterToSendMessage");
  });

  it('Typing a message sets typing state to true and on "Send" sets typing state to false', () => {
    const messageBox = shallow(<MessageBox />);
    const message = "Boring message";

    typeMessage(message, messageBox);

    expect(sendTypingIndicator).toHaveBeenCalledWith(gandalf.uid, true);

    pressKey("Enter", messageBox);

    expect(sendTypingIndicator).toHaveBeenCalledWith(gandalf.uid, false);
  });

  it("Should show emoji button", () => {
    const messageBox = shallow(<MessageBox />);
    const emojiButton = messageBox.find("#addEmojiButton");

    expect(emojiButton.exists()).toBe(true);
  });

  it("Should check if emoji panel is supported", () => {
    const messageBox = shallow(<MessageBox />);
    const emojiButton = messageBox.find("#addEmojiButton");

    emojiButton.simulate("click");
    expect(req.isEmojiPanelSupported).toHaveBeenCalled();
  });
});
