// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Contains functions shared between various CLI tools
 */

// We accept this error for a developer tool.
// eslint-disable-next-line security/detect-child-process
const { spawnSync } = require("child_process");
const chalk = require("chalk");

/**
 * Synchronously run a system command
 *
 * This is a wrapper around `child_process.spawn` with some nice defaults
 *
 * It will print the command before running it and by default show the output in the terminal
 *
 * @param {str} command
 * @param {boolean} output - Whether to show command's output in the terminal
 */
function run_command(command, output = true) {
  console.log(`${chalk.blue(">")} ${command}${output ? "" : chalk.grey(" (Output suppressed)")}`);

  const stdio = output ? "inherit" : "ignore";
  spawnSync(command, { stdio, shell: true });
}

/**
 * Ensure link-module-aliases are removed before executing the given function and replaced after
 *
 * Node doesn't support decorators yet, so this should be used as below
 * ```
 * const my_func = without_aliases(() => {
 * // my logic
 * });
 * ```
 * @param {function} original_function
 */
const without_aliases = (original_function) => {
  return function (...args) {
    try {
      run_command("npx link-module-alias clean", false);
      original_function(...args);
    } finally {
      run_command("npx link-module-alias", false);
    }
  };
};

module.exports = {
  run_command,
  without_aliases,
};
