// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import * as packageLock from "../../package-lock.json";
import { Result, ok, err } from "neverthrow";
import chalk from "chalk";

const errors: string[] = [];
verifyDependencies(packageLock.dependencies);

if (errors.length > 0) {
  console.error(`${chalk.red(`Found ${errors.length} issues with package-lock.json:\n`)}`);
  errors.forEach((error) => console.log(error));
  console.log(
    `${chalk.green(
      "Tip:"
    )} You may have unintentionally made changes during an npm install. See docs/builds.md for more information`
  );
  process.exit(1);
}

/**
 * Represents a single dependency in package-lock. It may have sub-dependencies
 */
interface DependencyDetails {
  version: string;
  resolved?: string;
  integrity?: string;
  dev?: boolean;
  requires?: Record<string, string>;
  dependencies?: Record<string, DependencyDetails>;
}

/**
 * Scan package-lock verifying all dependencies, including sub-dependencies, are as expected
 */
function verifyDependencies(dependencies: Record<string, DependencyDetails>): void {
  Object.entries(dependencies).forEach(([name, details]) => {
    if (details.dependencies !== undefined) {
      verifyDependencies(details.dependencies);
    }

    verifyResolvedUrl(name, details).match(
      // Don't want to do anything with an Ok value
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      () => {},
      (error) => errors.push(error)
    );
  });
}

/**
 * Check a dependency's resolved field points to artifactory (i.e. not registry.npmjs.org in particular)
 */
function verifyResolvedUrl(name: string, details: DependencyDetails): Result<{}, string> {
  if (
    details.resolved === undefined ||
    details.resolved.startsWith("https://artifactory.metaswitch.com:443/artifactory/api/")
  ) {
    return ok({});
  } else {
    return err(
      `Dependency ${chalk.blue(name)} has invalid resolved field:\n ${
        details.resolved
      }\nResolved fields should start with:\n https://artifactory.metaswitch.com:443/artifactory/api/\n`
    );
  }
}

// Have to include this so that compiler treats this file as a module and compiles properly. It
// doesn't do anything
export {};
