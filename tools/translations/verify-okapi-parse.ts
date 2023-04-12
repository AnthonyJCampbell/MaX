// Copyright 2021 Metaswitch Networks - Highly Confidential Material

/**
 * Utility script to check that the xliff file outputted by Rainbow/Okapi using our custom regex
 * parser actually contains all the translation keys and values from our original file.
 *
 * Note:
 * - this does not check that the context comments match
 * - this does not take into account DO NOT TRANSLATE comments, so you will see errors for the
 *   strings that are not supposed to be translated
 *
 * To run this script:
 *
 * 1. Change the file path in `originalTranslationsFile` and `xliffRaw` variable below to the match
 *    the file locations.
 *
 * 2. Run the following on the terminal:
 *    `npx ts-node --project tsconfig.base.json tools/translations/verify-okapi-parse.ts`
 */

// Disable some eslint rules for this file, since this is just a CLI utility script.
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable security/detect-non-literal-fs-filename */
/* eslint-disable security/detect-non-literal-require */
/* eslint-disable security/detect-object-injection */

import fs from "fs";
import xml2js from "xml2js";
import chalk from "chalk";

// Original file that was inputted to Rainbow/Okapi.
import originalTranslationsFile from "src/shared/localisation/languages/en-US";
const originalTranslations = originalTranslationsFile.common;

// xliff output from Rainbow/Okapi
const xliffRaw = fs.readFileSync(
  "src/shared/localisation/languages/pack1/work/en-US.ts.xlf",
  "utf-8"
);

const xmlParser = new xml2js.Parser();

xmlParser
  .parseStringPromise(xliffRaw)
  .then((result: any) => {
    const parsedTranslations = getParsedTranslations(result);
    compareOriginalAndParsedTranslations(originalTranslations, parsedTranslations);
  })
  .catch((reason: any) =>
    console.log(`Failed to parse or compare translation files, reason: ${reason}`)
  );

/** A <trans-unit> element in the xliff file. */
interface XliffTransUnit {
  $: {
    resname: string;
  };
  source: [{ _: string }];
  target: [{ _: string }];
}

/** The structure of the whole xliff file after being parsed using xml2js. */
interface XliffRawParsed {
  xliff: {
    file: [
      {
        body: [
          {
            "trans-unit": XliffTransUnit[];
          }
        ];
      }
    ];
  };
}

/**
 * Convert from the data structure of the xliff file to the same data structure as the original
 * translation.
 */
const getParsedTranslations = (xliffRawParsed: XliffRawParsed): any => {
  const xliffTransUnits = xliffRawParsed.xliff.file[0].body[0]["trans-unit"];
  const parsedTranslations = {};
  xliffTransUnits.forEach((transUnit: XliffTransUnit) => {
    verifySourceTarget(transUnit);
    const { key, value } = getKeyValue(transUnit);
    parsedTranslations[key] = value;
  });
  return parsedTranslations;
};

/** Return the key and value of the translation from a trans-unit data structure in an xliff file. */
const getKeyValue = (xliffTransUnit: XliffTransUnit): { key: string; value: string } => {
  const key = xliffTransUnit.$.resname;
  const value = xliffTransUnit.source[0]._;
  return { key, value };
};

/** Verify the "source" and "target" of the xliff file is the same. */
const verifySourceTarget = (xliffTransUnit: XliffTransUnit): void => {
  const key = xliffTransUnit.$.resname;
  const source = xliffTransUnit.source[0]._;
  const target = xliffTransUnit.target[0]._;
  if (source !== target)
    console.log(
      `\n${chalk.red(
        `Source and target for '${chalk.yellow(key)}' differ!`
      )}\nsource: '${source}'\ntarget: '${target}\n'`
    );
};

/**
 * Compare original and parsed translations. Both are assumed to have the structure of the original
 * translation file.
 */
const compareOriginalAndParsedTranslations = (original: any, parsed: any): void => {
  for (const originalKey in original) {
    if (!parsed[originalKey]) {
      console.log(
        chalk.red(`\nCan't find '${chalk.yellow(originalKey)}' in parsed translations!\n`)
      );
    } else if (original[originalKey] !== parsed[originalKey]) {
      console.log(
        `\n${chalk.red(`Values for '${chalk.yellow(originalKey)}' differ!`)}\noriginal: '${
          original[originalKey]
        }'\nparsed: '${parsed[originalKey]}\n'`
      );
    }
  }

  for (const parsedKey in parsed) {
    if (!original[parsedKey]) {
      console.log(
        chalk.red(`\nCan't find '${chalk.yellow(parsedKey)}' in original translations!\n`)
      );
      continue;
    }
  }
};

// Have to include this so that compiler treats this file as a module and compiles properly. It
// doesn't do anything
export {};
