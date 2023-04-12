// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import { Application } from "spectron";
import electronPath from "electron";

// mock wispa code has not been converted to Typescript yet.
// eslint-disable-next-line
// @ts-ignore
import { MockWispa } from "test/utils/mock-wispa";
import { init as initUI } from "test/electron-fv/utils/interface";

// logging code has not been converted to Typescript yet.
// eslint-disable-next-line
// @ts-ignore
import log from "node-server/main-logging";
import { wispaPorts } from "node-server/types";
import path from "path";

// App usually launches in ~15s but can take a lot longer on a heavily loaded system, so give it a
// very generous timeout
const appLaunchTimeout = 120000;

// Some of our tests take a while especially on a slow machine
export const defaultTestTimeout = 60000;

const logPath =
  process.platform !== "darwin"
    ? `${process.env.APPDATA}\\max_uc_react\\fv\\job${process.env.CI_JOB_ID}`
    : `${process.env.HOME}/Library/Application Support/max_uc_react/fv/job${process.env.CI_JOB_ID}`;
const macElectronPath = "./dist/mac/MaX UC Refresh.app/Contents/MacOS/MaX UC Refresh";

// The MockWispa connection should use different ports to a real WISPA connection so we can run both
// at the same time. The React port defined here should match the PORT environment variable passed
// as an argument in the test-electron-fv script.
export const mockWispa = new MockWispa(wispaPorts.ELECTRON_FV);

export const app = new Application({
  path: process.platform !== "darwin" ? (electronPath as unknown as string) : macElectronPath,
  args: ["."],
  // Variables here can be accessed in Node with process.env, and in React with window.process.env
  env: {
    FVFramework: true,
    REACT_PORT: 3001,
    WISPA_PORT: mockWispa.wispaPort,
  },
  chromeDriverLogPath: path.join(logPath, "log", "chromedriver.txt"),
  webdriverLogPath: path.join(logPath, "log"),
  webdriverOptions: {
    deprecationWarnings: false,
  },
});

export const UI = initUI(app);

const startApplication = async (): Promise<void> => {
  await app.start();

  // Need to wait for the app to have rendered before we can usefully test anything. Probably don't
  // need to check all 3 bars but might as well to be safe
  await UI.sidebar.waitForVisible();
  await UI.midbar.waitForVisible();
  await UI.rightbar.waitForVisible();

  app.browserWindow.focus();
};

const stopApplication = async (): Promise<void> => {
  if (app && app.isRunning()) {
    await app.stop();
  }
};

beforeAll(async () => {
  jest.setTimeout(defaultTestTimeout);
  mockWispa.start();
  await startApplication();
}, appLaunchTimeout);

beforeEach(() => {
  const beginningTest = `Beginning test - ${expect.getState().currentTestName}`;
  log.fv(beginningTest);

  // Console log so can easily see which FVs are being run
  console.log(beginningTest);
});

afterEach(async () => {
  // Some tests may end up with a window other than the main one selected
  await app.client.windowByIndex(0);
  const testName = expect.getState().currentTestName;

  // TODO: User tests to be fixed - tests end in avatar menu which breaks auditAccessibility()
  if (!testName.startsWith("In call header panel") && !testName.startsWith("Avatar menu - User")) {
    await UI.auditAccessibility();
  } else {
    log.fv("Skip accessiblity audit for Content Header Panel until accessibility retrofit is done");
  }

  log.fv(`Completed test - ${testName}`);

  // Console log so can easily see which FVs are being run
  console.log(`Completed test - ${testName}`);
});

afterAll(async () => {
  mockWispa.destroy();
  await stopApplication();
});
