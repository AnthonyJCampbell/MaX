// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * TypeScript specific utils
 *
 * Will be merged with `utils.js` when all is TypeScript
 *
 */
import { cloneDeep } from "lodash";
import { ReadonlyObjectDeep } from "type-fest/source/readonly-deep";

/**
 * Clones a Readonly Object and casts its type to the original object type
 *
 * This works around lodash's cloneDeep returning the same type it was given (including the
 * readonly-ness) even though the underlying object is not readonly (i.e. not frozen) anymore due to
 * the cloning process.
 */
export const mutableCloneDeep = <T extends object>(obj: ReadonlyObjectDeep<T>): T => {
  return cloneDeep(obj) as T;
};

/**
 * Mocks the i18next `t` function, for test purposes only
 *
 * We are displaying the key string, that is used to translate, instead of the real mapped string, and
 * we are stringifying the parameter arguments, so we can enforce the translation is being done as expected,
 * with the correct arguments.
 *
 * @param {String} key - the translation identifier, which is set in the `common.yaml` file
 * @param {Object} args - An object with the argument name and its value, example: { firstName: "John", lastName: "Doe" }
 * @returns {String} mocked translated string
 */
export const mockedT = (key: string, args?: object): string =>
  args ? `${key}-${JSON.stringify(args)}` : key;
