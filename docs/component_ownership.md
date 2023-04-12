# Component ownership

This document details the app's key components and their owners.

The term "component" isn't particularly well defined. Reading through what our components are is probably the best way to get a feel for what makes a component. They are grouped into three areas:

- **Product** - Components that form the app and are ultimately shipped to customers
- **Support** - Components that enable the app to be built quickly and effectively
- **Quality** - Components that impose requirements on the quality of the product

A component owner's responsibilities are as follows:

- provide support and expertise for the component, both internally to the team and externally
  - this does not mean the component owner has to know _everything_ about the component, just that they're willing to investigate if needed
- maintain and improve quality of the component they own
  - they should have a long-term vision for the component and drive improvements towards that vision
  - they should be involved in designs (and code reviews, if needed) that include major changes to the component to ensure quality is maintained and changes are made with the long-term vision in mind
- maintain documentations about the component they own

For detail of which directories/files are covered by which component, see the [Gitlab owners config](../.gitlab/CODEOWNERS)

## Product Components

This diagram covers how these slot together
![Component architecture](/docs/images/component-architecture.drawio.svg)

### React

The React components

### Redux

The Redux store

### Controller

Functionality in the Renderer process(es) outside of Redux or the React components. This logic should probably be in its own directory (`src/controller`?). Covers:

- Renderer-side IPC
- OS notifications
- Triggering new window creation (via Pane Control)

### Electron

All functionality in the Main process including IPC, WISPA client, Guardian, Pane Control and Data Fan.

### Architecture

The high level view of how all product components fit together to form the app as a whole. This isn't really "component ownership", but here is as good a place to record it as any

## Support Components

### Docs

Documentation for the codebase as a whole. Not necessarily the contents of the docs, but their organisation and cohesiveness.

### Builds

The builds process including TypeScript compilation, react-scripts compilation/bundling, electron-builder, CI and protoc container

### Unit tests

Common infrastructure used by the unit test frameworks (not the tests themselves). Covers e.g. Jest, utils and mocking strategy.

### FVs

[The FV framework](../test/electron-fv/electron-fv-readme.md)

### Developer experience

Tooling to make the lives of developers working on this codebase easier. Includes linting, formatting, environment, package management etc

## Quality Components

### Security

App security (both for Electron and React)

### Third party code

Infrastructure for handling third party packages.

### Accessibility

All forms of accessibility across the whole app

### Platform

App working consistently across all supported platforms (i.e. Mac and Windows on whichever OS versions)
