// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import { WindowTypes } from "shared/types";
import { action } from "@storybook/addon-actions";

const windowRequireMock = (value) => {
  switch (value) {
    case "electron-is-dev":
      return false;
    case "path":
      return {
        join: (_, __, image) => {
          return image;
        },
      };
    case "electron-log":
      return {
        create: () => ({
          transports: {
            console: {
              level: false,
            },
            file: {},
          },
          hooks: [],
          error: console.error,
          warn: console.warn,
          info: console.log,
          debug: console.log,
          user_action: console.log,
          userAction: console.log,
          verbose: console.log,
          silly: console.log,
          wispa: console.log,
          ipc: console.log,
          fv: console.log,
          mockwispa: console.log,
          isFvFramework: () => true,
        }),
      };
    case "@electron/remote":
      return {
        app: {
          dock: {
            setBadge: () => {},
          },
          quit: () => {},
          getAppPath: () => {},
        },
      };
    case "electron":
    default:
      return {
        ipcRenderer: {
          send: (channel, payload) =>
            action(
              `IPC Renderer send:\n\taction: ${channel}\n\tpayload: ${JSON.stringify(payload)}`
            ),
          sendSync: () => {
            return {
              identifiers: { type: WindowTypes.main },
              metadata: undefined,
            };
          },
        },
      };
  }
};

export default windowRequireMock;
