// Copyright 2021 Metaswitch Networks - Highly Confidential Material
// This is a JS file so there is module declaration file, implicit any type
// eslint-disable-next-line
// @ts-ignore
import * as req from "test/react-ut/components/require-mock";
import store from "store/store";
import {
  setSelectedContact,
  focusRightbarMessage,
  addBanner,
  removeBanner,
} from "action-creators/navigation/actions";
import {
  selectContactIfAnsweringCall,
  selectContactIfNewOutgoingCall,
  showOrHideJavaDown,
  showOrHideConnectivityBanner,
} from "store/action-creators/ipc-incoming/window-actions";
import { CallStatus, PhoneNumberType, Contact } from "src/types";

import { mutableCloneDeep } from "shared/mocks/ts-utils";
import { BannerType } from "shared/types";
import log from "src/renderer-logging";

jest.mock("src/renderer-logging");
jest.mock("action-creators/ipc-outgoing/active-calls-actions");
jest.mock("action-creators/navigation/actions");
jest.mock("action-creators/ipc-outgoing/messaging-actions");
jest.mock("store/store");
jest.useFakeTimers();

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  req.ipcSendSpy.mockClear();
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

describe("selectContactIfAnsweringCall", () => {
  const currentCall = {
    uid: "1234",
    remoteParty: "5678",
    status: CallStatus.CURRENT,
    microphoneIsMuted: false,
  };

  it("Triggers focusing the main window, and setting the contact to that of the accepted incoming call", () => {
    const contact = { phone: [{ value: currentCall.remoteParty }] };
    (store.getState as jest.Mock).mockReturnValue({
      activeCallsReducer: { activeCalls: [{ uid: currentCall.uid, status: CallStatus.INCOMING }] },
      contactReducer: { contacts: [contact] },
      paneManagementReducer: { focusMessage: 0 },
    });

    selectContactIfAnsweringCall(currentCall);

    expect(setSelectedContact).toHaveBeenCalledWith(contact);
    expect(focusRightbarMessage).toHaveBeenCalled();
    expect(req.ipcSendSpy).toHaveBeenCalled();
  });

  it("Builds a temporary contact when no matching contact is present", () => {
    (store.getState as jest.Mock).mockReturnValue({
      activeCallsReducer: { activeCalls: [{ uid: currentCall.uid, status: CallStatus.INCOMING }] },
      contactReducer: { contacts: [{ phone: [] }] },
    });
    const temporaryContact = new Contact();
    temporaryContact.phone.push({
      value: currentCall.remoteParty,
      type: PhoneNumberType.OTHER_NUMBER,
    });

    selectContactIfAnsweringCall(currentCall);

    expect(setSelectedContact).toHaveBeenCalledWith(temporaryContact);
    expect(focusRightbarMessage).not.toHaveBeenCalled();
    expect(req.ipcSendSpy).toHaveBeenCalled();
  });

  it("Doesn't trigger focussing the main window, if not from accepting an incoming call", () => {
    (store.getState as jest.Mock).mockReturnValue({
      activeCallsReducer: { activeCalls: [{ uid: currentCall.uid, status: CallStatus.CURRENT }] },
      contactReducer: { contacts: [{ phone: [{ value: currentCall.remoteParty }] }] },
    });

    selectContactIfAnsweringCall(currentCall);

    expect(setSelectedContact).not.toHaveBeenCalled();
    expect(focusRightbarMessage).not.toHaveBeenCalled();
    expect(req.ipcSendSpy).not.toHaveBeenCalled();
  });
});

describe("selectContactIfNewOutgoingCall", () => {
  const call = {
    uid: "1234",
    remoteParty: "5678",
    status: CallStatus.CONNECTING,
    microphoneIsMuted: false,
  };
  const contact = { phone: [{ value: call.remoteParty }] };

  it("Triggers focusing the main window, and setting the contact to that of the new outgoing call", () => {
    (store.getState as jest.Mock).mockReturnValue({
      activeCallsReducer: { activeCalls: [] },
      contactReducer: { contacts: [contact] },
      paneManagementReducer: { focusMessage: 0 },
    });

    selectContactIfNewOutgoingCall(call);

    expect(setSelectedContact).toHaveBeenCalledWith(contact);
    expect(focusRightbarMessage).toHaveBeenCalled();
    expect(req.ipcSendSpy).toHaveBeenCalled();
  });

  it("Builds a temporary contact when no matching contact is present", () => {
    (store.getState as jest.Mock).mockReturnValue({
      activeCallsReducer: { activeCalls: [] },
      contactReducer: { contacts: [{ phone: [] }] },
    });
    const temporaryContact = new Contact();
    temporaryContact.phone.push({
      value: call.remoteParty,
      type: PhoneNumberType.OTHER_NUMBER,
    });

    selectContactIfNewOutgoingCall(call);

    expect(setSelectedContact).toHaveBeenCalledWith(temporaryContact);
    expect(focusRightbarMessage).not.toHaveBeenCalled();
    expect(req.ipcSendSpy).toHaveBeenCalled();
  });

  it("Does not focus the main window and set contact if the call is pre-existing", () => {
    const preexistingCall = mutableCloneDeep(call);
    preexistingCall.status = CallStatus.RINGING;
    (store.getState as jest.Mock).mockReturnValue({
      activeCallsReducer: { activeCalls: [preexistingCall] },
      contactReducer: { contacts: [contact] },
      paneManagementReducer: { focusMessage: 0 },
    });

    selectContactIfNewOutgoingCall(call);

    expect(setSelectedContact).not.toHaveBeenCalledWith(contact);
    expect(focusRightbarMessage).not.toHaveBeenCalled();
    expect(req.ipcSendSpy).not.toHaveBeenCalled();
  });
});

describe("showOrHideJavaDownBanner", () => {
  it("Show banner when told to", () => {
    showOrHideJavaDown(true);

    expect(addBanner).toHaveBeenCalledWith(BannerType.JAVA_DOWN);
  });

  it("Remove banner when told to", () => {
    showOrHideJavaDown(false);

    expect(removeBanner).toHaveBeenCalledWith(BannerType.JAVA_DOWN);
  });
});

describe("ShowOrHideConnectivityBanner", () => {
  it("Show calls disconnected banner when told to", () => {
    const connectivityState = { callsDisconnected: true, chatDisconnected: false };

    showOrHideConnectivityBanner(connectivityState);

    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 30 * 1000);

    jest.runAllTimers();

    expect(addBanner).toHaveBeenCalledWith(BannerType.NO_CALLS);
  });

  it("Remove calls disconnected banner when told to", () => {
    const connectivityState = { callsDisconnected: false, chatDisconnected: false };

    showOrHideConnectivityBanner(connectivityState);

    expect(clearTimeout).toHaveBeenCalled();

    jest.runAllTimers();

    expect(removeBanner).toHaveBeenCalledWith(BannerType.NO_CALLS);
  });

  it("Show chat disconnected banner when told to", () => {
    const connectivityState = { callsDisconnected: false, chatDisconnected: true };

    showOrHideConnectivityBanner(connectivityState);

    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 30 * 1000);

    jest.runAllTimers();

    expect(addBanner).toHaveBeenCalledWith(BannerType.NO_CHAT);
  });

  it("Remove chat disconnected banner when told to", () => {
    const connectivityState = { callsDisconnected: true, chatDisconnected: false };

    showOrHideConnectivityBanner(connectivityState);

    expect(clearTimeout).toHaveBeenCalled();

    jest.runAllTimers();

    expect(removeBanner).toHaveBeenCalledWith(BannerType.NO_CHAT);
  });

  it("Show chat and calls disconnected banner when told to", () => {
    const connectivityState = { callsDisconnected: true, chatDisconnected: true };

    showOrHideConnectivityBanner(connectivityState);

    expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 30 * 1000);

    jest.runAllTimers();

    expect(addBanner).toHaveBeenCalledWith(BannerType.NO_CHAT_OR_CALLS);
  });

  it("Remove chat and calls disconnected banner when told to", () => {
    const connectivityState = { callsDisconnected: false, chatDisconnected: true };

    showOrHideConnectivityBanner(connectivityState);

    expect(clearTimeout).toHaveBeenCalled();

    jest.runAllTimers();

    expect(removeBanner).toHaveBeenCalledWith(BannerType.NO_CHAT_OR_CALLS);
  });
});
