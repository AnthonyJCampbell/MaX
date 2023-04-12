// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Error class to be thrown in the "default" section of a switch statement. This will cause a
 * compile-time error if the switch is non-exhaustive rather than a run-time error
 *
 * The argument must be the value being switched on:
 * ```javascript
 * enum colour {
 * BLUE = 0,
 * RED = 1,
 * }
 * const myColour: colour = getRandomColour()
 * switch (myColour) {
 *   case colour.BLUE:
 *     console.log("blue!");
 *     break;
 *   case colour.RED:
 *     console.log("red!");
 *     break;
 *   default:
 *     throw new UnreachableError(myColour);
 * }
 * ```
 */
export class UnreachableError extends Error {
  constructor(arg: never) {
    super(`Hit unreachable branch (${arg})`);
  }
}
