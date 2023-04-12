// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Setup logging for the Main process
 *
 * This is broadly the same as src/renderer-logging, but we can't share code due to the Main
 * process and Renderer processes having different import methods.
 */

const path = require("path");
const electronLog = require("electron-log");

let isFvFramework = process.env.FVFramework;

/**
 * Set the log file directory to be `log/` instead of `logs/` to match the Java Max UC code
 *
 * @param {PathVariables} pathVariables - PathVariables is defined in the electron-log module
 */
function logPath(pathVariables) {
  // If we're running FVs, log in a separate folder (see spectron.test.js)
  if (isFvFramework) {
    if (process.platform !== "darwin")
      return `${process.env.APPDATA}\\max_uc_react\\fv\\job${process.env.CI_JOB_ID}\\log\\${pathVariables.fileName}`;
    else
      return `${process.env.HOME}/Library/Application Support/max_uc_react/fv/job${process.env.CI_JOB_ID}/log/${pathVariables.fileName}`;
  } else {
    return path.join(pathVariables.userData, "log", pathVariables.fileName);
  }
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
function customLogLevelCheck(message) {
  const log_text = message.data[0];

  // If our log isn't a string (e.g. it's an object), then we can't regex parse it. This is a
  // limitation of this way of implementing custom log levels.
  if (typeof log_text === "string") {
    const log_text_match = log_text.match(RegExp(/\{\{(.*)\}\} (.*)/s));
    if (log_text_match) {
      const level = log_text_match[1];
      const log = log_text_match[2];

      message.level = level;
      message.data[0] = log;
    }
  }
  return message;
}

/**
 * Creates an electron-log instance and sets some common properties.
 *
 * @param {String} fileName - The name of the file this logger will write logs to
 * @param {Boolean} logProcessType - Include the process type in the logs, skip for FV logs to reduce spam.
 */
function fileLogger(fileName, logProcessType = true) {
  let logger = electronLog.create(fileName);

  // Logging to console makes working with UTs hard. If any UTs fail then console logs from every
  // UT are written out, massively clogging up the screen. So we want our file logger to just write
  // to files.
  logger.transports.console = null;

  const format = logProcessType
    ? "[{iso}] [{processType}] [{level}] {text}"
    : "[{iso}] [{level}] {text}";

  // Maximum file size, in bytes. This defaults to 1MB, which we override to 20MB
  const fileSize = 1024 * 1024 * 20;

  Object.assign(logger.transports.file, {
    resolvePath: logPath,
    format,
    fileName,
    maxSize: fileSize,
  });

  logger.hooks.push(customLogLevelCheck);

  return logger;
}

// Setup logger for user actions, used to write user_action and error logs to user.log
const user_log = fileLogger("user.log");

// Setup logger for API events, used to write WISPA and error logs to api.log
const api_log = fileLogger("api.log");

// Setup debug logger, used to write all logs to debug.log and info+ to console
const debug_log = fileLogger("debug.log");

// Setup FV test logger
const fv_log = fileLogger("fv.log", false);

class externalLogger {
  error(message) {
    debug_log.error(message);
    api_log.error(message);
  }

  warn(message) {
    debug_log.warn(message);
  }

  info(message) {
    debug_log.info(message);
  }

  user_action(message) {
    debug_log.info(`{{user_action}} ${message}`);
    user_log.info(`{{user_action}} ${message}`);
  }

  verbose(message) {
    debug_log.verbose(message);
  }

  debug(message) {
    debug_log.debug(message);
  }

  silly(message) {
    debug_log.silly(message);
  }

  wispa(message) {
    debug_log.info(
      `{{WISPA}} ${JSON.stringify(
        message,
        (key, value) => {
          // Redact the profile picture if present - it's too long to log!
          return key === "profilePicture" ? "redacted" : value;
        },
        2
      )}`
    );
    api_log.info(
      `{{WISPA}} ${JSON.stringify(
        message,
        (key, value) => {
          // Redact the profile picture if present - it's too long to log!
          return key === "profilePicture" ? "redacted" : value;
        },
        2
      )}`
    );
  }

  ipc(message) {
    debug_log.info(
      `{{IPC}} ${JSON.stringify(
        message,
        (key, value) => {
          // Redact the profile picture if present - it's too long to log!
          return key === "profilePicture" ? "redacted" : value;
        },
        2
      )}`
    );
    api_log.info(
      `{{IPC}} ${JSON.stringify(
        message,
        (key, value) => {
          // Redact the profile picture if present - it's too long to log!
          return key === "profilePicture" ? "redacted" : value;
        },
        2
      )}`
    );
  }

  fv(message) {
    debug_log.info(`{{FV}} ${message}`);
    fv_log.info(`{{FV}} ${message}`);
  }

  mockwispa(message) {
    debug_log.info(`{{Mock WISPA}} ${message}`);
    fv_log.info(`{{Mock WISPA}} ${message}`);
  }

  /**
   * Let the logger know that it should be using the FV log path. This is a hacky way of allowing
   * the test framework (e.g. MockWispa) to log to the same file as the app. This will probably be
   * useful so we should improve how this is set up in future
   * @param {boolean} value
   */
  isFvFramework() {
    isFvFramework = true;
  }
}

module.exports = new externalLogger();
