// Copyright 2021 Metaswitch Networks - Highly Confidential Material
const { WindowTypes } = require("src/shared/types");

/**
 * When UTs are run in a headless environment, the global object (window)
 * does not have a require method, so provide a mock implementation.
 * Note, must be a separate file included into the test module as per
 * https://jestjs.io/docs/en/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
 * All you need to do is
 * `import "test/react-ut/components/require-mock";`
 */
export const appQuitSpy = jest.fn();
export const setBadgeSpy = jest.fn();
export const setIconSpy = jest.fn();
export const setOverlayIconSpy = jest.fn();
export const isFocusedSpy = jest.fn();
export const showWindowSpy = jest.fn();
export const resizeWindowSpy = jest.fn();
export const ipcSendSpy = jest.fn();
export const ipcSendSyncSpy = jest.fn(() => {
  return {
    identifiers: { type: WindowTypes.main },
    metadata: undefined,
  };
});

export const isEmojiPanelSupported = jest.fn();
Object.defineProperty(window, "require", {
  writable: true,
  value: jest.fn().mockImplementation((value) => {
    switch (value) {
      case "electron-is-dev":
        return false;
      case "path":
        return {
          join: (_, __, image) => {
            return image;
          },
        };
      case "@electron/remote":
        return {
          app: {
            dock: {
              setBadge: setBadgeSpy,
              setIcon: setIconSpy,
            },
            quit: appQuitSpy,
            getAppPath: jest.fn(),
            getLocale: jest.fn(() => "en-US"),
            getLocaleCountryCode: jest.fn(() => "US"),
            isEmojiPanelSupported: isEmojiPanelSupported,
          },
          getCurrentWindow: jest.fn().mockReturnValue({
            identifiers: {
              type: WindowTypes.main,
              options: {},
            },
            isFocused: isFocusedSpy,
            on: jest.fn(),
            close: jest.fn(),
          }),
        };
      case "electron":
        return {
          ipcRenderer: {
            send: ipcSendSpy,
            sendSync: ipcSendSyncSpy,
          },
        };
    }
  }),
});
