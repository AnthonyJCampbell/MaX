// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import dedent from "dedent-js";

// logging code has not been converted to Typescript yet.
// eslint-disable-next-line
// @ts-ignore
import log from "node-server/main-logging";

/**
 * Pause for a given number of milliseconds
 *
 * This is useful for debugging, e.g. to keep the app window open for inspection, to pause between
 * commands or to test whether a command is failing because it's being executed too soon
 */
export async function pause(milliseconds = 1000): Promise<void> {
  return new Promise((_callback) => setTimeout(_callback, milliseconds));
}

/**
 * Wait for given `condition()` to return `true`
 *
 * Immediately resolves to `true` if the condition becomes `true`. Resolves to `false` if the
 * condition does not become `true` after `timeout` milliseconds.
 *
 * Swallows (but logs) all exceptions during polling the condition.  There is a high likelihood
 * that these are stale element reference exceptions hit during a refresh window.  The condition
 * will be retried.
 *
 * # Example
 *
 * ```
 * mockWispa = new MockWispa(9091)
 * const mockRegisterListener = jest.fn(() => {});
 *
 * // Connect to WISPA, this takes some time and happens asynchronously. When it's done
 * // the `mockRegisterListener` will be called
 * contacts.start(namespacedConnection("/contacts"), mockRegisterListener);
 *
 * // Wait for client to connect to mock WISPA by waiting for a call to
 * // `mockRegisterListener`, the test proceeds as soon as the arrow function returns true
 * await waitForCondition(() => {
 *   return mockRegisterListener.mock.calls.length > 0;
 * });
 *
 * // We know the connection has been made now, so can send some data
 * mockWispa.sendContactsList();
 * ```
 */
export function waitForCondition(
  condition: () => boolean | Promise<boolean>,
  timeout = 5000,
  extraErrorInfo = ""
): Promise<boolean> {
  const startTime = new Date().getTime();

  const poll = async (
    resolve: (value: boolean) => void,
    reject: (reason?: unknown) => void
  ): Promise<void> => {
    let result = false;
    try {
      result = await condition();
    } catch (error) {
      if (error.message.includes("stale element reference")) {
        log.fv("Hit stale element reference error waiting for condition, swallow it: " + error);
      } else {
        log.fv("Hit error waiting for condition: " + error);
        throw error;
      }
    }

    if (typeof result !== "boolean") {
      throw new Error(
        "Given condition function did not return a boolean. Missing `return` statement?"
      );
    }

    if (result) {
      resolve(true);
    } else {
      const timeDelta = new Date().getTime() - startTime;
      if (timeDelta >= timeout) {
        const errorText = dedent`
        ${extraErrorInfo}
        Condition did not become true after ${timeDelta}ms:
        """
        ${condition}
        """`;
        reject(new Error(errorText));
      }
      setTimeout(() => poll(resolve, reject), 1);
    }
  };

  return new Promise(poll);
}

/**
 * Expects given condition to be true within a certain timeout
 *
 * Should be used to expect a condition that won't immediately be true
 */
export async function expectWithinTimeout(
  condition: () => boolean | Promise<boolean>,
  failureMessage: string,
  timeout = 20000
): Promise<void> {
  await waitForCondition(condition, timeout)
    .then(async () => {
      expect(await condition()).toBe(true);
    })
    .catch(() => {
      throw new Error(failureMessage);
    });
}

/**
 *  Only run this test on Mac
 */
export const itMaybeMac = process.platform === "darwin" ? it : it.skip;

/**
 *  Only run this test on Windows
 */
export const itMaybeWin = process.platform === "darwin" ? it.skip : it;
