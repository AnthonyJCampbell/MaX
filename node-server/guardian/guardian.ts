// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Module that controls the electron system
 */

import path from "path";
import fs from "fs";
import { exec } from "child_process";
import isDev from "electron-is-dev";
import i18n from "i18next";

import { app } from "../electron-wrapper";
import log from "../main-logging";
import { initI18n } from "../localisation/i18n";

import * as paneControl from "../pane-control";

import * as wispaClient from "../ipc-wispa/wispa-client";
import * as windowListeners from "../ipc-renderer/window-listeners";
import { windows } from "../ipc-renderer/window-messaging";

import { WispaRequest } from "../../src/shared/types";

/**
 * Run pre-launch checks to see make sure the app should launch or not.
 *
 * If the app should not launch, performs any requried actions before returning.
 *
 * @returns {boolean} - Whether checks were passed
 */
function preLaunchChecks(): boolean {
  log.info("Running pre-launch checks");

  if (!isDev && !app.requestSingleInstanceLock()) {
    log.info("App already running, this instance exits");
    return false;
  }

  // We are the main instance. Register for when another instance starts up
  // and dies on the above lock.
  app.on("second-instance", (event, cmd, workDir) => {
    log.info("Second instance started, jumping to front");
    log.debug(`Second instance details: '${JSON.stringify(event)}' '${cmd}' '${workDir}'`);
    if (windows.mainWindow !== null) {
      if (windows.mainWindow.isMinimized()) windows.mainWindow.restore();
      windows.mainWindow.focus();
    }
  });

  return true;
}

/**
 * Open or pass command line arguments to the Windows Java executable in the installation directory.
 */
export async function callWinJavaExecutable(): Promise<void> {
  log.debug("Starting Windows Java search");

  // To determine the correct path to the Java exe for us to run, we use
  // 'process.execPath' to find the full path to our current directory, in
  // case the app is installed in a non-standard location.  We know that
  // this process will be running in the in the 'ui' subdirectory of the
  // Java exe's directory so we modify the path to move up to that level.
  const winJavaDir = path.join(process.execPath, "/../../");

  // TODO: BRANDING https://jira.metaswitch.com/browse/ACM-4439
  // Once branding has been implemented, this array of possible
  // names should be replaced by the branded exe name.
  const javaExe = ["MaXUCDev.exe", "MaXUC.exe", "MaXUCFV.exe"]
    .map((name) => path.join(winJavaDir, name))
    /* eslint-disable security/detect-non-literal-fs-filename */
    .find((winPath) => fs.existsSync(winPath));

  if (javaExe) {
    log.info("Starting Windows Java process: " + javaExe);
    exec('"' + javaExe + '"', (error, stdout, stderr) => {
      if (error) {
        // TODO: ROBUSTNESS https://jira.metaswitch.com/browse/ACM-4440
        // For GA we will need better error checking - i.e. actually doing
        // something if we hit an error, probably a retry mechanism for
        // starting the Java client and monitoring to check that it is (still) running.
        log.error(`java exec error: ${error}`);
        log.error(`java stdout: ${stdout}`);
        log.error(`java stderr: ${stderr}`);
      }
    });
  } else {
    log.error("No Java executable found in install - skipping starting it!");
  }
}

/**
 * Open the Mac Java app that this Electron app is bundled into.
 */
export async function startMacJavaApp(): Promise<void> {
  // To determine the correct path to the Java app for us to pass to the 'open' command, we use 'process.execPath'
  // to find the full path to our current directory, in case the app is installed in a non-standard location.
  // We know that, relative to the top-level Java app, this process will be running in:
  // '<PRODUCT_NAME>.app/Contents/Frameworks/<PRODUCT_NAME>.app/Contents/MacOS/<PRODUCT_NAME>'
  // Therefore, 6 levels above is the top level .app folder
  const macJavaDir = path.join(process.execPath, "/../../../../../../");

  log.info("Starting Mac Java app in: " + macJavaDir);
  // TODO: ROBUSTNESS https://jira.metaswitch.com/browse/ACM-4440
  // For GA we will need better error checking - i.e. actually doing
  // something if we hit an error, probably a retry mechanism for
  // starting the Java client and monitoring to check that it is (still) running.
  exec("open '" + macJavaDir + "'", (error, stdout, stderr) => {
    if (error) {
      log.error(`java exec error: ${error}`);
      log.error(`java stdout: ${stdout}`);
      log.error(`java stderr: ${stderr}`);
    }
  });
}

/**
 * Quit the app, also asking Java to quit if requested to.
 */
export function quitApp(quitJava: boolean): void {
  log.info("Quitting the app");
  if (quitJava) {
    shutdownJava();
  }

  // We use app.exit() here rather than app.quit(), otherwise we'll end up triggering Events that, either we may not
  // want to happen, or that may already have happened and may be what caused this function to be called in the first place.
  // For example, if we're shutting down due a request from Java, we don't want to trigger a dialog that would allow the
  // user to cancel the shutdown or to trigger a call back to Java to ask it to shutdown, in case it is already restarting.
  app.exit();
}

/**
 * Send a WISPA request to stop the Java backend.
 */
function shutdownJava(): void {
  log.info("Shutting down Java backend");
  const wispaRequest = new WispaRequest();
  wispaRequest.payload = { action: { coreAction: { shutdown: true } } };
  wispaClient.send(wispaRequest);
}

/**
 * Launch the application, loading all the node code
 */
export function launch(): void {
  if (!preLaunchChecks()) {
    log.info("Quitting this instance due to failed preLaunchChecks");
    quitApp(false);
    return;
  }

  log.info("Starting app");

  require("@electron/remote/main").initialize();
  wispaClient.start();
  windowListeners.start();

  // If this is a full build, try to run the Java executable.
  if (!isDev) {
    log.info("App is production");
    if (process.platform === "darwin") {
      log.info("Running on Mac");
      startMacJavaApp().catch((reason) =>
        log.error(`Failed to start Mac Java app, reason: ${reason}`)
      );
    } else {
      log.info("Running on Windows");
      callWinJavaExecutable().catch((reason) =>
        log.error(`Failed to start Windows Java app, reason: ${reason}`)
      );
    }
  }

  // Application has finished initialising
  app.on("ready", () => {
    log.info("App is ready");

    // Must wait until app is ready, otherwise app.getLocale() won't work
    initI18n()
      .then(() => {
        // Set the user model ID - it appears in notifications
        app.setAppUserModelId(i18n.t("productName"));

        paneControl.createMainWindow();
      })
      .catch((error) => {
        log.error(`i18next failed to initialize: ${error}`);
      });
  });

  // App is activated, e.g. application launched, the taskbar icon has been clicked
  // Required for Mac OS
  app.on("activate", () => {
    log.info("App activated");
    if (windows.mainWindow === null) {
      paneControl.createMainWindow();
    }
  });

  // We may not want this behaviour - old client doesn't quit unless the quit button is explicitly clicked!
  app.on("window-all-closed", () => {
    log.info("All windows closed - quitting app");
    quitApp(true);
  });

  app.on("will-quit", () => {
    log.info("Quitting application");
    quitApp(true);
  });
}
