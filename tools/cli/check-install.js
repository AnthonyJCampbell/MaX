// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Tool to check that all dependencies and devDependencies are installed
 */
let chalk;
let fs;

try {
  chalk = require("chalk");
  fs = require("fs");
} catch (error) {
  if (error.code === "MODULE_NOT_FOUND") {
    console.error("❌ A dependency is not installed");
    console.error("A dependency of the check-install script is missing. Run `npm install`\n");
    process.exit(3);
  }
}

check_packages_are_installed();

/**
 * Verify that any packages listed as `dependencies` or `devDependencies` in `package.json` have
 * directories of the same name in `node_modules/`
 *
 * Prints it's findings to console. Exits with rc 1 if some dependencies aren't installed
 */
function check_packages_are_installed() {
  const cwd = process.cwd();
  // While its not a literal require, we are confident in what we are require-ing here.
  // eslint-disable-next-line security/detect-non-literal-require
  const packageJson = require(`${cwd}/package.json`);
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

  check_protobuf_wispa_version();
  Object.keys(dependencies).forEach((dependency) => {
    // Injection attack is not a risk here, for a developer CLI tool.
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (!fs.existsSync(`${cwd}/node_modules/${dependency}`)) {
      console.error(chalk.red("❌ A dependency is not installed"));
      console.error(
        `Dependency ${chalk.blue(dependency)} is not installed. Try running ${chalk.green(
          '"npm install"'
        )}\n`
      );
      process.exit(1);
    }
  });
  console.log(chalk.green("✔ All dependencies installed"));
}

function check_protobuf_wispa_version() {
  const cwd = process.cwd();
  // While its not a literal require, we are confident in what we are require-ing here.
  // eslint-disable-next-line security/detect-non-literal-require
  const pbInstalledVersion = require(`${cwd}/node_modules/protobuf-wispa/package.json`).version;
  // While its not a literal require, we are confident in what we are require-ing here.
  // eslint-disable-next-line security/detect-non-literal-require
  const pbDesiredVersion = require(`${cwd}/package.json`).dependencies["protobuf-wispa"];

  if (pbDesiredVersion !== pbInstalledVersion) {
    console.error(chalk.red("❌ Protobuf-wispa version mismatch"));
    console.error(
      `Installed version is ${chalk.red(
        pbInstalledVersion
      )} but package.json specifies ${chalk.blue(pbDesiredVersion)}. Try running ${chalk.green(
        `"npm install"`
      )}`
    );
    process.exit(1);
  }
  console.log(chalk.green("✔ Protobuf-wispa up to date"));
}
