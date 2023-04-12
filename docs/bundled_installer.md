# Java-Electron Installer

## Basic instructions

If using development branches and you want an installer that isn't uploaded to artifactory:

- In the Java codebase: push your Java changes (if any) to the correct branch.
- In the Electron codebase: push your Electron changes to the correct branch.
- Create a [new pipeline](https://git.datcon.co.uk/accession/Desktop/electron-ui/pipelines/new), set to run for your electron branch, add the variable key `TRIGGER_JAVA_BRANCH`, and set the value to the name of the _Java_ branch.
- Check the downstream Java pipeline for your artifacts (multiDeployment/accession-dev/windows).
- Download and install the client.
- Before running the client, create a `MaX UC Dev` folder in `%APPDATA%` on Windows and `Library/Application Support/` on Mac. Create a `sip-communicator.properties` file with the line `net.java.sip.communicator.plugin.wispa.HOSTPORT=9090` in the folder. If you ran the client before doing this, quit both the electron and java (using task manager), navigate to the `sip-communicator.properties` file that would have been automatically created and add the HOSTPORT line at the bottom, then start the client again.


If merging to master (Electron) or refresh-master (Java) (but not immediately building an alpha):

- In the Java codebase: push your Java changes (if any) to refresh-master.
- In the Electron codebase: push your Electron changes to master.
- **Note, update the commit in AccessionDesktop/electron-version.txt with the new electron shortform commit hash (first 8 digits), for use by future alpha builds.**
- Check the downstream Java pipeline for your artifacts (multiDeployment/accession-dev/windows).
- Download and install the client.
- Before running the client, create a `MaX UC Dev` folder in `%APPDATA%` on Windows and `Library/Application Support/` on Mac. Create a `sip-communicator.properties` file with the line `net.java.sip.communicator.plugin.wispa.HOSTPORT=9090` in the folder. If you ran the client before doing this, quit both the electron and java (using task manager), navigate to the `sip-communicator.properties` file that would have been automatically created and add the HOSTPORT line at the bottom, then start the client again.

If you're building an alpha client (sprint deliverable) you should use the process in the AccessionDesktop/readme.md instead:

- This drives the process from the Java side, ensuring that the Java repo has a record of the relationship between the Java commit (tagged sprint/...) and the Electron commit (in electron_version.txt) used. It also uploads the installer to artifactory.

## If you forgot to push your Java changes first

- Re-run the Electron pipeline

OR

- Run a custom pipeline (build_custom_windows) against the correct Java commit with build variable: `ELECTRON_COMMIT` set to the correct electron commit.

## Finding the electron artifacts

- Gitlab - electron-build-files-win.zip, deleted in 7 days
- Artifactory - [artifactory link](https://artifactory.metaswitch.com/webapp/#/artifacts/browse/tree/General/accession-clients/Desktop/refresh-client), deleted in 30 days.

## How it works

- Electron will kick off a pipeline for either your commit to master, or you can kick off a pipeline with the `TRIGGER_JAVA_BRANCH` variable set to the Java branch you want to trigger.
- The `ELECTRON_COMMIT` pipeline variable will be set to your 8 digit electron shortform commit hash.
- The electron-build-files-win.zip will be uploaded to artifactory, with the `ELECTRON_COMMIT` prepended (E.g. 123456bb-electron-build-files-win.zip).
- A Java pipeline will be kicked off, with the `ELECTRON_COMMIT` passed through.
- The Java build (`refresh-master` or `TRIGGER_JAVA_BRANCH`) will use the commit from `ELECTRON_COMMIT` (if provided) or the commit in electron-version.txt to download the electron-build-files-win.zip from artifactory and bundle them into the build.
- The build will use the Production port `9090` defined in `node-server/types.ts` under `wispaPorts.PRODUCTION` for Electron and `sip-communicator.properties` under `net.java.sip.communicator.plugin.wispa.HOSTPORT` for Java.
