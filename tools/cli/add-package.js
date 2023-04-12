// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Tool to install a new package:
 * - Cleans up link-module-alias so you don't have to
 * - In future could:
 *   - Add it to the right section in package.json (resolved/test/build)
 *   - Check it has a decent license
 */

const { without_aliases, run_command } = require("./shared");

// The first two parts of argv are "node" and this script's name
const args = process.argv.slice(2);
const command = `npm install ${args.join(" ")}`;

without_aliases(() => {
  run_command(command);
})();
