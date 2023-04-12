# Dependencies

This article provides more detailed information on our dependencies and in particular records where and why specific versions are in use. Dependency exceptions listed in this article have links to their related Jira tickets.

## React 16

> This is tracked under issue [DUIR-2846](https://jira.metaswitch.com/browse/DUIR-2846)

We have not yet updated to React 17 and this affects the following outdated packages:

- @types/react
- @types/react-dom
- react
- react-dom
- react-scripts
- react-test-renderer

This update is still due because we rely on airbnb-prop-types which is incompatible with React 17 pending [this outstanding MR](https://github.com/airbnb/prop-types/pull/74).

## ESLint 6

> This is tracked under issue [DUIR-2847](https://jira.metaswitch.com/browse/DUIR-2847)

We have not yet updated to Elint 7, because React 16 relies on ESLint 6 and while we are still on React 16 [see the React section for details](#React-16) we cannot upgrade this package.

## React-Scripts 3

> This is tracked under issue [DUIR-2851](https://jira.metaswitch.com/browse/DUIR-2851)

We have not yet upgraded to React-Scripts 4 because it relies on ESLint 7 and we cannot yet perform that upgrade. [See the ESLint section](#ESLint-6) for details.

## Spectron 15

Up to date ✅

See [README](https://github.com/electron-userland/spectron#version-map) for latest information

## Electron 13

Up to date ✅

See [release page](https://www.electronjs.org/releases/stable) for latest information

## Typescript 3

> This is tracked under issue [DUIR-2850](https://jira.metaswitch.com/browse/DUIR-2850)

We cannot upgrade Typescript to version 4 without a corresponding update of Electron to 10 or later due to [this issue](https://github.com/electron/electron/issues/21612), and so we are stuck at Typescript 3 until an Electron upgrade. [See the Electron section](#Electron-8) for details.

## NPM 6

NPM versions fall into LTS versions (even numbers) and non-LTS versions (odd numbers). For now, we are sticking with LTS versions only, so will not upgrade NPM until NPM 8.

## Socket.io 2

Taking a major version of socket.io requires taking both server and client changes (i.e. changes to the Java codebase), however we are planning on replacing Websockets with Named Pipes/Unix Sockets in the near future, and so doing this work will be wasted in the longer term.
