// Copyright 2021 Metaswitch Networks - Highly Confidential Material
const { BrowserWindow } = require("node-server/electron-wrapper");
const { setState } = require("node-server/pane-control");
const { windows } = require("node-server/ipc-renderer/window-messaging");
const { isEqual } = require("lodash");
const { mutableCloneDeep } = require("shared/mocks/ts-utils");

const { bilboCall, gandalfCall } = require("shared/mocks/mock-active-calls");
const { peter, bilbo } = require("shared/mocks/mock-contacts");
const { CallStatus } = require("src/shared/types");
import { WindowTypes } from "src/shared/types";

jest.mock("electron-is-dev", () => false);
jest.mock("node-server/pane-control/mac-app-menu", () => {
  // Mock the mac app menu - return an empty object
  return {};
});
jest.mock("node-server/electron-wrapper");

const mainWindowSpy = jest.spyOn(windows, "mainWindow", "get");
mainWindowSpy.mockImplementation(() => {
  const mainWindow = new BrowserWindow();
  mainWindow.tag = "main";
  mainWindow.identifiers = { type: WindowTypes.main };
  return mainWindow;
});

// const bilboButOnHold = mutableCloneDeep(bilboCall);
// bilboButOnHold.status = CallStatus.HOLD;

describe("Responses to state updates", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    BrowserWindow.resetAllMockWindows();
  });
  it("Creates an in-call window for each active call", () => {
    const initialMockWindows = [];
    const paneControlState = {
      activeCalls: [bilboCall, gandalfCall],
      selectedContact: peter,
      focus: true,
    };
    const expectedIdentifiers1 = { type: WindowTypes.inCall, uid: bilboCall.uid };
    const expectedIdentifiers2 = { type: WindowTypes.inCall, uid: gandalfCall.uid };

    BrowserWindow.setMockWindows(initialMockWindows);

    setState(paneControlState);

    const mockWindows = BrowserWindow.getAllWindowsExceptMain();
    expect(mockWindows).toHaveLength(2);
    expect(mockWindows.some((window) => isEqual(window.identifiers, expectedIdentifiers1))).toBe(
      true
    );
    expect(mockWindows.some((window) => isEqual(window.identifiers, expectedIdentifiers2))).toBe(
      true
    );
  });
  it("Creates an incoming call window for each incoming call", () => {
    const bilboIncoming = mutableCloneDeep(bilboCall);
    bilboIncoming.status = CallStatus.INCOMING;
    const bilboIncoming2 = mutableCloneDeep(bilboCall);
    bilboIncoming2.status = CallStatus.INCOMING;
    bilboIncoming2.uid = bilboIncoming2.uid + "make_the_uid_different";

    const initialMockWindows = [];
    const paneControlState = {
      activeCalls: [bilboIncoming, bilboIncoming2],
      selectedContact: bilbo,
      focus: true,
    };
    const expectedIdentifiers1 = { type: WindowTypes.incomingCall, uid: bilboIncoming.uid };
    const expectedIdentifiers2 = { type: WindowTypes.incomingCall, uid: bilboIncoming2.uid };

    BrowserWindow.setMockWindows(initialMockWindows);

    setState(paneControlState);

    const mockWindows = BrowserWindow.getAllWindowsExceptMain();
    expect(mockWindows).toHaveLength(2);
    expect(mockWindows.some((window) => isEqual(window.identifiers, expectedIdentifiers1))).toBe(
      true
    );
    expect(mockWindows.some((window) => isEqual(window.identifiers, expectedIdentifiers2))).toBe(
      true
    );
  });
  it("Does not create more in-call windows if the right ones already exist", () => {
    const inCallIdentifiers = { type: WindowTypes.inCall, uid: bilboCall.uid };
    const inCallWindow = new BrowserWindow();
    inCallWindow.identifiers = inCallIdentifiers;
    inCallWindow.metadata = { remoteParty: bilboCall.remoteParty };

    const initialMockWindows = [inCallWindow];
    const paneControlState = {
      activeCalls: [bilboCall],
      selectedContact: bilbo,
      focus: true,
    };

    BrowserWindow.setMockWindows(initialMockWindows);

    setState(paneControlState);

    const mockWindows = BrowserWindow.getAllWindowsExceptMain();
    expect(mockWindows).toHaveLength(1);
    expect(mockWindows[0]).toEqual(inCallWindow);
  });
  it("Does not create more incoming call windows if the right ones already exist", () => {
    const incomingBilboCall = mutableCloneDeep(bilboCall);
    incomingBilboCall.status = CallStatus.INCOMING;
    const incomingCallIdentifiers = { type: WindowTypes.incomingCall, uid: incomingBilboCall.uid };
    const incomingCallWindow = new BrowserWindow();
    incomingCallWindow.identifiers = incomingCallIdentifiers;
    incomingCallWindow.metadata = { remoteParty: incomingBilboCall.remoteParty };

    const initialMockWindows = [incomingCallWindow];
    const paneControlState = {
      activeCalls: [incomingBilboCall],
      selectedContact: incomingBilboCall,
      focus: true,
    };

    BrowserWindow.setMockWindows(initialMockWindows);

    setState(paneControlState);

    const mockWindows = BrowserWindow.getAllWindowsExceptMain();
    expect(mockWindows).toHaveLength(1);
    expect(mockWindows[0]).toEqual(incomingCallWindow);
  });
  it("Removes in-call windows that are no longer in the state", () => {
    const bilboCall2 = mutableCloneDeep(bilboCall);
    bilboCall2.uid = bilboCall2.uid + "make_the_uid_different";

    const inCallIdentifiers1 = { type: WindowTypes.inCall, uid: bilboCall.uid };
    const inCallIdentifiers2 = { type: WindowTypes.inCall, uid: bilboCall2.uid };

    const inCallWindow1 = new BrowserWindow();
    inCallWindow1.identifiers = inCallIdentifiers1;
    inCallWindow1.metadata = { remoteParty: bilboCall.remoteParty };

    const inCallWindow2 = new BrowserWindow();
    inCallWindow2.identifiers = inCallIdentifiers2;
    inCallWindow2.metadata = { remoteParty: bilboCall.remoteParty };

    const initialMockWindows = [inCallWindow1, inCallWindow2];
    const paneControlState = {
      activeCalls: [bilboCall],
      selectedContact: bilbo,
      focus: true,
    };

    BrowserWindow.setMockWindows(initialMockWindows);

    setState(paneControlState);

    const mockWindows = BrowserWindow.getAllWindowsExceptMain();
    expect(mockWindows).toHaveLength(1);
    expect(mockWindows[0]).toEqual(inCallWindow1);
  });
  it("Removes incoming call windows that are no longer in the state", () => {
    const bilboIncoming = mutableCloneDeep(bilboCall);
    bilboIncoming.status = CallStatus.INCOMING;
    const bilboIncoming2 = mutableCloneDeep(bilboCall);
    bilboIncoming2.status = CallStatus.INCOMING;
    bilboIncoming2.uid = bilboIncoming2.uid + "make_the_uid_different";

    const incomingCallIdentifiers1 = { type: WindowTypes.incomingCall, uid: bilboIncoming.uid };
    const incomingCallIdentifiers2 = { type: WindowTypes.incomingCall, uid: bilboIncoming2.uid };

    const incomingCallWindow1 = new BrowserWindow();
    incomingCallWindow1.identifiers = incomingCallIdentifiers1;
    incomingCallWindow1.metadata = { remoteParty: bilboIncoming.remoteParty };

    const incomingCallWindow2 = new BrowserWindow();
    incomingCallWindow2.identifiers = incomingCallIdentifiers2;
    incomingCallWindow2.metadata = { remoteParty: bilboIncoming.remoteParty };

    const initialMockWindows = [incomingCallWindow1, incomingCallWindow2];
    const paneControlState = {
      activeCalls: [bilboIncoming],
      selectedContact: bilbo,
      focus: true,
    };

    BrowserWindow.setMockWindows(initialMockWindows);

    setState(paneControlState);

    const mockWindows = BrowserWindow.getAllWindowsExceptMain();
    expect(mockWindows).toHaveLength(1);
    expect(mockWindows[0]).toEqual(incomingCallWindow1);
  });
  it("Shows all in-call windows if the main window isn't focused", () => {
    const ringingBilboCall = mutableCloneDeep(bilboCall);
    ringingBilboCall.status = CallStatus.RINGING;
    ringingBilboCall.uid = ringingBilboCall.uid + "make_the_ringing_uid_different";
    const connectingBilboCall = mutableCloneDeep(bilboCall);
    connectingBilboCall.status = CallStatus.CONNECTING;
    connectingBilboCall.uid = connectingBilboCall.uid + "make_the_connecting_uid_different";

    const initialMockWindows = [];
    const paneControlState = {
      activeCalls: [connectingBilboCall, ringingBilboCall, bilboCall],
      selectedContact: bilbo,
      focus: false,
    };
    const expectedIdentifiers1 = { type: WindowTypes.inCall, uid: connectingBilboCall.uid };
    const expectedIdentifiers2 = { type: WindowTypes.inCall, uid: bilboCall.uid };
    const expectedIdentifiers3 = { type: WindowTypes.inCall, uid: ringingBilboCall.uid };

    BrowserWindow.setMockWindows(initialMockWindows);

    setState(paneControlState);

    const mockWindows = BrowserWindow.getAllWindowsExceptMain();
    expect(mockWindows).toHaveLength(3);
    expect(
      mockWindows.some(
        (window) => isEqual(window.identifiers, expectedIdentifiers1) && window.shown
      )
    ).toBe(true);
    expect(
      mockWindows.some(
        (window) => isEqual(window.identifiers, expectedIdentifiers2) && window.shown
      )
    ).toBe(true);
    expect(
      mockWindows.some(
        (window) => isEqual(window.identifiers, expectedIdentifiers3) && window.shown
      )
    ).toBe(true);
  });
  it("Shows in-call windows for contacts other than the selected contact if main window is visible ", () => {
    const initialMockWindows = [];
    const paneControlState = {
      activeCalls: [gandalfCall, bilboCall],
      selectedContact: bilbo,
      focus: true,
    };

    const expectedIdentifiersBilbo = { type: WindowTypes.inCall, uid: bilboCall.uid };
    const expectedIdentifiersGandalf = { type: WindowTypes.inCall, uid: gandalfCall.uid };

    BrowserWindow.setMockWindows(initialMockWindows);

    setState(paneControlState);

    const mockWindows = BrowserWindow.getAllWindowsExceptMain();
    expect(mockWindows).toHaveLength(2);
    expect(
      mockWindows.some(
        (window) => isEqual(window.identifiers, expectedIdentifiersBilbo) && !window.shown
      )
    ).toBe(true);
    expect(
      mockWindows.some(
        (window) => isEqual(window.identifiers, expectedIdentifiersGandalf) && window.shown
      )
    ).toBe(true);
  });
});

// Pane Control's other exported methods are too simple to be worth UT'ing
