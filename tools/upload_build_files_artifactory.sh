#!/bin/bash

# Copyright 2021 Metaswitch Networks - Highly Confidential Material

set -exo pipefail

upload_artifactory() {
    local src="$1"
    local dst="$2"

    jfrog rt u --url "$ARTIFACTORY_URL" --user "$ARTIFACTORY_USER_NAME" --apikey "$ARTIFACTORY_API_KEY" "$src" "$dst"
}

apt-get update && apt-get -y install zip unzip


# On widows, we build a zipfile containing the executable and dependencies, so we upload that directly.
# On mac, electron-builder's zip target produces zipfiles which use features not supported by all zip managers, so we build a unpacked directory and zip it ourselves here.
# There's an open issue about this with electron-builder here: https://github.com/electron-userland/electron-builder/issues/377://github.com/electron-userland/electron-builder/issues/3779 - if that's ever fixed, ideally we'd switch the mac build target to zip too

# We add --symlinks to the invocation for mac, as the mac .app makes use of symlinks to reduce size.
# Without this flag, the zip would contain full copies of the files wherever symlinks were used.
cd ./dist/mac && zip --symlinks -r ../electron-build-files-mac.zip ./* && cd -

upload_artifactory "dist/*win.zip" "${ARTIFACTORY_LOC}/${CI_COMMIT_SHORT_SHA}-electron-build-files-win.zip"
upload_artifactory "dist/electron-build-files-mac.zip" "${ARTIFACTORY_LOC}/${CI_COMMIT_SHORT_SHA}-electron-build-files-mac.zip"
