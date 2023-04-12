// Copyright 2021 Metaswitch Networks - Highly Confidential Material
// This is a JS file so there is module declaration file, implicit any type
// eslint-disable-next-line
// @ts-ignore
import "test/react-ut/components/require-mock";
import { fullname } from "components/utils/common";
// TypeScript doesn't understand importing a png, so disable checking for this line
// eslint-disable-next-line
// @ts-ignore
import DefaultProfilePicture from "assets/shared/default-profile-picture.png";
// TypeScript doesn't understand importing an ico, so disable checking for this line
// eslint-disable-next-line
// @ts-ignore
import AppIcon from "assets/shared/icon.ico";
import store from "store/store";
import each from "jest-each";
import {
  newVoicemailNotification,
  newChatMessageNotification,
} from "store/action-creators/ipc-incoming/notification-actions";
import { Contact } from "src/types";
import { mockStoreState } from "shared/mocks/mock-states";
import { mutableCloneDeep, mockedT } from "shared/mocks/ts-utils";
import { RootStateOrAny } from "react-redux";
import log from "src/renderer-logging";

jest.mock("src/renderer-logging");
jest.mock("components/utils/common");
jest.mock("store/store");

(fullname as jest.Mock).mockReturnValue("Pingu");

// We're just mocking an async function, so it's fine.
// eslint-disable-next-line @typescript-eslint/no-empty-function
const soundSpy = jest.fn(async () => {});
window.HTMLMediaElement.prototype.play = soundSpy;

const notificationSpy = jest.fn();
// Compiler complains about the type of jest Mock assigned to window.Notification
// Force it to be never
window.Notification = notificationSpy as never;

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  soundSpy.mockClear();
  notificationSpy.mockClear();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

const mockGetState = store.getState as jest.Mock<RootStateOrAny>;

const mockState = {
  ...mockStoreState,
  contactReducer: {
    ...mockStoreState.contactReducer,
    contacts: [],
    selectedContact: new Contact(),
  },
  voicemailsReducer: { voicemailFaxCount: { newMessages: 0 } },
};

mockGetState.mockReturnValue(mockState);

describe("newChatMessageNotification", () => {
  const data = {
    isNew: true,
    message: [
      {
        author: { value: "1234" },
        content: "hi",
        uid: "",
        timestamp: "",
        type: 0,
        edited: false,
        read: true,
        recipient: undefined,
      },
    ],
    uid: "",
    participant: [],
    chatName: "",
  };

  it("Triggers an OS notification", () => {
    const dataOS = mutableCloneDeep(data);
    mockState.paneManagementReducer.isMainWindowFocused = false;

    newChatMessageNotification(dataOS);

    expect(notificationSpy).toHaveBeenCalledWith("Pingu", {
      body: data.message[0].content,
      icon: DefaultProfilePicture,
    });
    expect(soundSpy).not.toHaveBeenCalled();
  });

  it("Triggers a subtle IM noise", () => {
    const dataPersistent = mutableCloneDeep(data);
    mockState.paneManagementReducer.isMainWindowFocused = true;

    newChatMessageNotification(dataPersistent);

    expect(soundSpy).toHaveBeenCalled();
    expect(notificationSpy).not.toHaveBeenCalled();
  });

  it("Doesn't trigger if the message is not new", () => {
    const dataOld = { ...mutableCloneDeep(data), isNew: false };
    newChatMessageNotification(dataOld);
    expect(notificationSpy).not.toHaveBeenCalled();
    expect(soundSpy).not.toHaveBeenCalled();
  });

  it("Doesn't trigger if the message was sent by the user", () => {
    const dataClone = mutableCloneDeep(data);
    const dataUser = {
      ...dataClone,
      message: [{ ...dataClone.message[0], content: "bye", author: { value: "" } }],
    };
    newChatMessageNotification(dataUser);
    expect(notificationSpy).not.toHaveBeenCalled();
    expect(soundSpy).not.toHaveBeenCalled();
  });
});

describe("newVoicemailNotification", () => {
  each([
    [1, mockedT("newMessages_interval", { postProcess: "interval", count: 1 })],
    [5, mockedT("newMessages_interval", { postProcess: "interval", count: 5 })],
    [11, mockedT("newMessages_interval", { postProcess: "interval", count: 11 })],
  ]).it("Triggers an OS notification for %s voicemails", (voicemailNumber, body) => {
    // 1st call never triggers a notification as we don't want them at app startup
    newVoicemailNotification({ newMessages: 0 });

    // This one should though!
    newVoicemailNotification({ newMessages: voicemailNumber });
    expect(notificationSpy).toHaveBeenCalledWith(mockedT("voicemail"), {
      body,
      icon: AppIcon,
    });
    expect(notificationSpy).toHaveBeenCalledTimes(1);
  });

  it("Doesn't trigger an OS notification if no voicemails", () => {
    // 1st call never triggers a notification as we don't want them at app startup
    newVoicemailNotification({ newMessages: 0 });

    // This one would (if it wasn't zero) though!
    newVoicemailNotification({ newMessages: 0 });
    expect(notificationSpy).not.toHaveBeenCalled();
  });

  it("Doesn't trigger an OS notification if no increase in voicemails", () => {
    mockGetState.mockReturnValue({
      ...mockStoreState,
      voicemailsReducer: { voicemailFaxCount: { newMessages: 6 } },
    });
    // 1st call never triggers a notification as we don't want them at app startup
    newVoicemailNotification({ newMessages: 6 });

    // This one would (if it was an increase) though!
    newVoicemailNotification({ newMessages: 5 });
    expect(notificationSpy).not.toHaveBeenCalled();
  });
});
