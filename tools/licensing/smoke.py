"""
Smoke test script for checking license usage in an NPM codebase, designed
for use with CI.

Uses the associated approved_packages and ignored_types files to determine if
any licensing issues might be present.

Copyright 2021 Metaswitch Networks - Highly Confidential Material
"""

import os
import sys
import json
from subprocess import run, PIPE


ERROR_TEXT = """
There were problematic licenses found! They are included in the output above.
You will need to work out a resolution for this - either to change the packages used, or get approval of the new licenses.
For more details, see: https://git.datcon.co.uk/accession/Desktop/electron-ui/-/blob/master/docs/third_party_code.md#what-should-i-do-when-i-add-a-3rd-party-package"""


def collect_lines(path):
    """Get the entries from one of the checked-in container files.
    Strip out empty and comment lines, return the rest.
    """
    return [
        entry
        for entry in [line.strip() for line in path.readlines()]
        if len(entry) > 0 and entry[0] != "#"
    ]


def wispa_package():
    """Retrieve the currently installed WISPA package, which as an internal
    package has no license.
    """
    wispa = "protobuf-wispa"
    process = run(["npm", "ls", "--json", wispa], stdout=PIPE, encoding="utf-8")
    if process.returncode != 0:
        raise Exception("Error running npm command, bailing out")
    data = json.loads(process.stdout)["dependencies"][wispa]
    return "{}@{}".format(wispa, data["version"])


with open(os.path.join("tools", "licensing", "ignored_types"), "r") as ignored_types:
    types = collect_lines(ignored_types)

type_param_semicolon = ";".join(types)
type_param_comma = ", ".join(types)

with open(
    os.path.join("tools", "licensing", "approved_packages"), "r"
) as approved_packages:
    packages = collect_lines(approved_packages)

packages.append(wispa_package())
package_param = ";".join(packages)

base_command = [
    "npx",
    "license-checker",
    "--exclude",
    type_param_comma,
    "--excludePackages",
    package_param,
]
result = run(  # pylint:disable=subprocess-run-check
    base_command + ["--onlyAllow", type_param_semicolon]
)
if result.returncode == 0:
    # Result fine, so we can exit now.
    print("No issues found")
    sys.exit(0)

# Errors found - print the full list of packages with issues without exiting.
print("Found an issue, printing full list of problematic licenses.\n")
_ = run(base_command)  # pylint:disable=subprocess-run-check
print(ERROR_TEXT)
sys.exit(2)
