# README

## Introduction

This repo houses the new Max UC Desktop UI. See the [Metacom space](https://metacom2.metaswitch.com/confluence/pages/viewpage.action?spaceKey=UnifiedCommunications&title=MaX+UC+Desktop+UI+Refresh) for more information on this project as a whole, or read on for information for developers.

## About

The new UI is written within the [Electron framework](https://electronjs.org/) and uses [React](https://reactjs.org/) for rendering. The React portion of this project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Working with this repo

### Environment setup

1. Download and install Node v14.17.3 from [here](https://nodejs.org/dist/v14.17.3/). We use a very specific version to get consistent package-lock.json behaviour.
2. Clone this repo.
3. Clone the [AccessionDesktop repo](https://git.datcon.co.uk/accession/Desktop/AccessionDesktop)
4. In this repo's folder, run `npm install`

### Building and running the app 

For the app to work fully you must be running the Java client. Building and running the Java client is covered [here](https://metacom2.metaswitch.com/confluence/x/hDmPB). You should use the `refresh-master` branch.

To run the Electron app locally, run `npm start` 

To build and run a production build of the Electron app locally:
- Run `npm run build` (or if building on Linux: `npm run build-win`). This creates `MaX UC Refresh.exe` in `electron-ui\dist\win-unpacked`
- Ensure the Java client is not running. Navigate to `Jitsi` in `%APPDATA%` on Windows and `Library/Application Support/` on Mac. Add the line `net.java.sip.communicator.plugin.wispa.HOSTPORT=9090` to the end of the `sip-communicator.properties` file.
- Start the Java client and run `MaX UC Refresh.exe`.

#### Java-Electron Installer

For information on creating the combined installer, see the [here](docs/bundled_installer.md).

### Developer rampup

See [rampup.md](docs/rampup.md). It provides rampup materials for both hacking and "proper" development

### Testing

See [testing.md](docs/testing.md)

### Development tools

See [tooling.md](docs/tooling.md)
