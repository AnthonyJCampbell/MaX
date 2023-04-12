// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import * as req from "test/react-ut/components/require-mock";
import { getOperatingSystem } from "components/utils/common";
import { setAppIcon } from "components/utils/app-icon";
import { PresenceState } from "src/types";
import each from "jest-each";
import log from "src/renderer-logging";

jest.mock("src/renderer-logging");
jest.mock("components/utils/common");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  req.setIconSpy.mockClear();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

describe("setAppIcon", () => {
  each([
    [PresenceState.AWAY, "dock-away"],
    [PresenceState.BUSY, "dock-busy"],
    [PresenceState.DO_NOT_DISTURB, "dock-dnd"],
    [PresenceState.OFFLINE, "dock-offline"],
    [PresenceState.ONLINE, "dock-online"],
    [PresenceState.IN_A_CALL, "dock-onthephone"],
    [PresenceState.IN_A_MEETING, "dock-inameeting"],
    [PresenceState.UNKNOWN, "dock-online"],
  ]).it("Sets the correct icon for presence %s on Mac", (presence, setValue) => {
    getOperatingSystem.mockReturnValue("mac");
    setAppIcon(presence);
    expect(req.setIconSpy).toHaveBeenCalledWith(setValue);
  });
});
