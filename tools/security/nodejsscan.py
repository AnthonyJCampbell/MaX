"""Simple Python script using the NodeJsScan API to run an automated
security scan on the application.

Run this from the root of the codebase, e.g. "python ./tools/security/nodejsscan.py"

Uses nodejsscan, see details in repo: https://github.com/ajinabraham/nodejsscan

Copyright 2021 Metaswitch Networks - Highly Confidential Material
"""
import os
import json
import core.scanner as scanner

dirs = ["./node-server", "./public", "./src"]

for dir in dirs:
    if not os.path.exists(dir):
        raise Exception(
            "Couldn't scan directory {0}! Are you running from codebase root?".format(
                dir
            )
        )

# Scan source folders and print a legible JSON report.
scan_results = scanner.scan_dirs(dirs)
pretty_scan_results = json.dumps(scan_results, indent=4, sort_keys=True)
print(pretty_scan_results)

# Ignore the missing headers for now
# Some of them are obsolete/out of date/not applicable
# TODO: In follow-on story DUIR-1569 these need to be properly evaluated and the ones
# that are needed should be implemented and removed from this list.
ignored_missing_headers = [
    "Missing Security Header - X-Frame-Options (XFO)",
    "Missing Security Header - Strict-Transport-Security (HSTS)",
    "Missing Security Header - Public-Key-Pins (HPKP)",
    "Missing Security Header - X-XSS-Protection:1",
    "Missing Security Header - X-Content-Type-Options",
    "Missing Security Header - X-Download-Options: noopen",
    "Missing 'httpOnly' in Cookie",
    "Information Disclosure - X-Powered-By"
]

# Fail the pipeline if we have security warnings.
if scan_results["total_count"]["sec"] > 0:
    raise Exception("Security issues found!")

# Fail the pipeline if we have missing security headers which are not part of the
# ignore list
if scan_results["total_count"]["mis"] > 0:
    for result in scan_results['missing_sec_header']['Web Security']:
        if result["title"] not in ignored_missing_headers:
            raise Exception("Security issues found!")
