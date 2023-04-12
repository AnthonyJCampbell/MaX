// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import * as req from "test/react-ut/components/require-mock";
import { getOperatingSystem } from "components/utils/common";
import { setAppBadge } from "components/utils/app-badge";
import each from "jest-each";
import { ipcChannels } from "shared/constants";
import { mockedT } from "shared/mocks/ts-utils";
import log from "src/renderer-logging";

jest.mock("src/renderer-logging");
jest.mock("components/utils/common");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  req.setBadgeSpy.mockClear();
  req.ipcSendSpy.mockClear();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

describe("setAppBadge", () => {
  each([
    [0, ""],
    [1, "1"],
    [9, "9"],
    [10, "9+"],
  ]).it("Sets the correct badge for %s notifications on Mac", (count, setValue) => {
    getOperatingSystem.mockReturnValue("mac");
    setAppBadge(count);
    expect(req.setBadgeSpy).toHaveBeenCalledWith(setValue);
  });

  each([
    [0, null, mockedT("notification_interval", { postProcess: "interval", count: 0 })],
    [
      1,
      "notification-overlay-1",
      mockedT("notification_interval", { postProcess: "interval", count: 1 }),
    ],
    [
      9,
      "notification-overlay-9",
      mockedT("notification_interval", { postProcess: "interval", count: 9 }),
    ],
    [
      10,
      "notification-overlay-9-plus",
      mockedT("notification_interval", { postProcess: "interval", count: 10 }),
    ],
  ]).it(
    "Sets the correct overlay icon for %s notifications on Windows",
    (count, setValue, setDescription) => {
      getOperatingSystem.mockReturnValue("windows");
      setAppBadge(count);
      expect(req.ipcSendSpy).toHaveBeenCalledWith(ipcChannels.setOverlayIcon, {
        overlayPath: setValue,
        overlayDescription: setDescription,
      });
    }
  );
});
