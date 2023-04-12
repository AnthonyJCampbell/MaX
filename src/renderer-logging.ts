// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Setup logging for the Renderer processes
 *
 * This is broadly the same as public/main-logging.js, but we can't share code due to the Main
 * process and Renderer processes having different import methods.
 */
import path from "path";

// electron-log appears to have some issues with Typescript bindings where
// importing the whole module using `import` causes a TypeError. Importing only
// the bindings works without error.
import ElectronLog from "electron-log";

interface ExternalLogger {
  error: (message: string) => void;
  warn: (message: string) => void;
  info: (message: string) => void;
  debug: (message: string) => void;
  userAction: (message: string) => void;
  verbose: (message: string) => void;
  silly: (message: string) => void;
  ipc: (message: string) => void;
  test: (message: string) => void;
}

const fallBackLogger: ExternalLogger = {
  error: console.error,
  warn: console.warn,
  info: console.log,
  debug: console.log,
  userAction: console.log,
  verbose: console.log,
  silly: console.log,
  ipc: console.log,
  test: console.log,
};

// Sometimes we're not in the Electron context (e.g. Storybook, UTs) so don't have access to
// `electron-log`.
// If we do have it, we can proceed as normal, otherwise return an Object of the same structure
// that just logs to console. Turn off TypeScript as it (wrongly) thinks that window.require will
// always be defined here.

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const log = window.require ? setupElectronLogging() : fallBackLogger;

/**
 * Setup logging with electron-log, having checked previously that we have access to it
 */
function setupElectronLogging(): ExternalLogger {
  let electronLog: typeof ElectronLog;

  try {
    // This can fail due to electron-log still using the depreceated `electron.remote` module.
    // See https://jira.metaswitch.com/browse/DUIR-4720 for more info.
    electronLog = window.require("electron-log");
  } catch (err) {
    console.error(
      "Failed to initialise file logging for this Renderer process. All logs will go to console instead"
    );
    return fallBackLogger;
  }

  /**
   * Returns the current directory path to be used for logging.
   *
   * Match the Java platform's log directory for consistency.
   *
   * @param {PathVariables} pathVariables - PathVariables is defined in the electron-log module
   */
  function logPath(pathVariables: ElectronLog.PathVariables): string {
    // If running within the FVs, check if we have a more convenient location for developers on that
    // platform. Fallback to normal production behaviour if needed.
    if (window.process.env.FVFramework) {
      switch (window.process.platform) {
        case "win32":
          return `${window.process.env.APPDATA}\\max_uc_react\\fv\\job${window.process.env.CI_JOB_ID}\\log\\${pathVariables.fileName}`;
        case "darwin":
          return `${window.process.env.HOME}/Library/Application Support/max_uc_react/fv/job${window.process.env.CI_JOB_ID}/log/${pathVariables.fileName}`;
        default:
          break;
      }
    }

    const fileName = pathVariables.fileName ? pathVariables.fileName : "renderer.log";
    return path.join(pathVariables.userData, "log", fileName);
  }

  /**
   * Converts a message's level based on a flag in the log text. This is necessary as it's not
   * possible to use custom levels with electron-log.
   *
   * If the log text is of the form "{{some_text_1}} some_text_2", then the log's level is converted
   * to "some_text_1" and the log's text is converted to "some_text_2"
   *
   * @param {LogMessage} message - LogMessage as defined in the electron-log module
   */
  function customLogLevelCheck(message: ElectronLog.LogMessage): ElectronLog.LogMessage {
    const logText = message.data[0];

    // If our log isn't a string (e.g. it's an object), then we can't regex parse it. This is a
    // limitation of this way of implementing custom log levels.
    if (typeof logText !== "string") return message;

    const logTextMatch = logText.match(RegExp(/\{\{(.*)\}\} (.*)/s));
    if (logTextMatch) {
      message.level = logTextMatch[1] as ElectronLog.LogLevel;
      message.data[0] = logTextMatch[2];
    }
    return message;
  }

  /**
   * Creates an electron-log instance and sets some common properties.
   *
   * @param {String} fileName - The name of the file this logger will write logs to
   */
  function fileLogger(fileName: string): ElectronLog.ElectronLog {
    const logger = electronLog.create(fileName);

    // Logging to console makes working with UTs hard. If any UTs fail then console logs from every
    // UT are written out, massively clogging up the screen. So we want our file logger to just write
    // to files.
    logger.transports.console.level = false;

    // Maximum file size, in bytes. This defaults to 1MB, which we override to 20MB
    const fileSize = 1024 * 1024 * 20;

    Object.assign(logger.transports.file, {
      resolvePath: logPath,
      format: "[{iso}] [{processType}] [{level}] {text}",
      fileName,
      maxSize: fileSize,
    });

    logger.hooks.push(customLogLevelCheck);

    return logger;
  }

  // Setup logger for user actions, used to write userAction and error logs to user.log
  const userLog = fileLogger("user.log");

  // Setup logger for API events, used to write api_event and error logs to api.log
  const apiLog = fileLogger("api.log");

  // Setup debug logger, used to write all logs to debug.log and info+ to console
  const debugLog = fileLogger("debug.log");

  return {
    error: (message: string): void => {
      debugLog.error(message);
      userLog.error(message);
      apiLog.error(message);
    },

    warn: (message: string): void => {
      debugLog.warn(message);
    },

    info: (message: string): void => {
      debugLog.info(message);
    },

    verbose: (message: string): void => {
      debugLog.verbose(message);
    },

    debug: (message: string): void => {
      debugLog.debug(message);
    },

    silly: (message: string): void => {
      debugLog.silly(message);
    },

    userAction: (message: string): void => {
      debugLog.info(`{{userAction}} ${message}`);
      userLog.info(`{{userAction}} ${message}`);
    },

    ipc: (message: string): void => {
      debugLog.info(
        `{{IPC}} ${JSON.stringify(
          message,
          (key, value) => {
            // Redact the profile picture if present - it's too long to log!
            return key === "profilePicture" ? "redacted" : value;
          },
          2
        )}`
      );
      apiLog.info(
        `{{IPC}} ${JSON.stringify(
          message,
          (key, value) => {
            // Redact the profile picture if present - it's too long to log!
            return key === "profilePicture" ? "redacted" : value;
          },
          2
        )}`
      );
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test: (_message: string): void => {
      // When mocking logs for testing, if using .tsx format for the test
      // file, TS will complain about the function not existing.
      // Thus, we need to implement it here as well to avoid test failures.
    },
  };
}

export default log;
