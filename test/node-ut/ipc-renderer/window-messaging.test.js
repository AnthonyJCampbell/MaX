// Copyright 2021 Metaswitch Networks - Highly Confidential Material
const { BrowserWindow } = require("node-server/electron-wrapper");
const { windows, sendWispaMessage } = require("node-server/ipc-renderer/window-messaging");
import { WindowTypes } from "src/shared/types";

jest.mock("node-server/electron-wrapper");
const allWindowsSpy = jest.spyOn(BrowserWindow, "getAllWindows");

describe("windows", () => {
  it("Gets all the windows", () => {
    windows.all;
    expect(allWindowsSpy).toHaveBeenCalled();
  });

  it("Sets and gets the main window", () => {
    expect(windows.mainWindow).toBeNull();
    const dummyWindow = new BrowserWindow({ show: false });
    windows.mainWindow = dummyWindow;
    allWindowsSpy.mockReturnValue([dummyWindow]);

    expect(windows.mainWindow).toEqual(dummyWindow);
  });

  it("Sets and gets secondary windows", () => {
    expect(windows.secondaryWindows).toEqual([]);
    const dummyWindow = new BrowserWindow({ show: false });
    windows.secondaryWindow = dummyWindow;
    allWindowsSpy.mockReturnValue([dummyWindow]);

    expect(windows.secondaryWindows).toEqual([dummyWindow]);
  });

  describe("Getting windows matching identifiers", () => {
    it("Gets a window matching one identifier", () => {
      const dummyWindow1 = new BrowserWindow({ show: false });

      dummyWindow1.identifiers = { type: "MY_WINDOW_TYPE" };

      allWindowsSpy.mockReturnValue([dummyWindow1]);

      const identifiersToMatch = { type: "MY_WINDOW_TYPE" };

      const matchingWindows = windows.withIdentifiers(identifiersToMatch);
      expect(matchingWindows).toStrictEqual([dummyWindow1]);
    });
    it("Gets multiple windows matching one identifier", () => {
      const dummyWindow1 = new BrowserWindow({ show: false });
      const dummyWindow2 = new BrowserWindow({ show: false });

      dummyWindow1.identifiers = { type: "MY_WINDOW_TYPE", uid: 1234 };
      dummyWindow2.identifiers = { type: "MY_WINDOW_TYPE", uid: 5678 };

      allWindowsSpy.mockReturnValue([dummyWindow1, dummyWindow2]);

      const identifiersToMatch = { type: "MY_WINDOW_TYPE" };

      const matchingWindows = windows.withIdentifiers(identifiersToMatch);
      expect(matchingWindows).toStrictEqual([dummyWindow1, dummyWindow2]);
    });
    it("Gets multiple windows matching multiple identifiers", () => {
      const dummyWindow1 = new BrowserWindow({ show: false });
      const dummyWindow2 = new BrowserWindow({ show: false });
      const dummyWindow3 = new BrowserWindow({ show: false });

      dummyWindow1.identifiers = { type: WindowTypes.inCall, uid: 1234 };
      dummyWindow2.identifiers = { type: WindowTypes.inCall, uid: 1234, extraField: true };
      dummyWindow3.identifiers = { type: WindowTypes.inCall, uid: 5678 };

      allWindowsSpy.mockReturnValue([dummyWindow1, dummyWindow2, dummyWindow3]);

      const identifiersToMatch = { type: WindowTypes.inCall, uid: 1234 };

      const matchingWindows = windows.withIdentifiers(identifiersToMatch);
      expect(matchingWindows).toStrictEqual([dummyWindow1, dummyWindow2]);
    });
    it("Ignores windows not matching any identifiers", () => {
      const dummyWindow1 = new BrowserWindow({ show: false });

      dummyWindow1.identifiers = { type: "MY_WINDOW_TYPE" };

      allWindowsSpy.mockReturnValue([dummyWindow1]);

      const identifiersToMatch = { type: "MY_DOOR_TYPE" };

      const matchingWindows = windows.withIdentifiers(identifiersToMatch);
      expect(matchingWindows).toStrictEqual([]);
    });
    it("Ignores windows matching one but not all identifiers", () => {
      const dummyWindow1 = new BrowserWindow({ show: false });
      const dummyWindow2 = new BrowserWindow({ show: false });

      dummyWindow1.identifiers = { type: "MY_WINDOW_TYPE", uid: 1234 };
      dummyWindow2.identifiers = { type: "MY_WINDOW_TYPE" };

      allWindowsSpy.mockReturnValue([dummyWindow1]);

      const identifiersToMatch = { type: "MY_WINDOW_TYPE", uid: 5678 };

      const matchingWindows = windows.withIdentifiers(identifiersToMatch);
      expect(matchingWindows).toStrictEqual([]);
    });
  });
});

describe("send", () => {
  const dummyWindow = new BrowserWindow({ show: false });
  const dummyWindowSpy = jest.spyOn(dummyWindow.webContents, "send");
  it("Sends a wispa message", () => {
    sendWispaMessage([dummyWindow], "mockMessage");
    expect(dummyWindowSpy).toHaveBeenCalledWith("wispaMessage", "mockMessage");
  });
});
