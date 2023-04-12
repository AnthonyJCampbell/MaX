// Copyright 2021 Metaswitch Networks - Highly Confidential Material
const { WindowTypes } = require("../types");
/**
 * Used in the UTs as a mock for the actual "electron" module
 */
let constructedWindows = [];

class BrowserWindow {
  constructor() {
    this.shown = false;
    this.webContents = {
      send: () => {},
      on: () => {},
      setWindowOpenHandler: () => {},
    };
    this.setMenuBarVisibility = () => {};
    this.on = () => {};
    this.loadURL = () => {};
    this.showInactive = () => {
      this.shown = true;
    };
    this.show = () => {
      this.shown = true;
    };
    this.hide = () => {
      this.shown = false;
    };
    this.close = () => {
      constructedWindows = constructedWindows.filter((window) => window !== this);
    };
    this.getPosition = () => [0, 0];
    this.isVisible = () => this.shown;

    constructedWindows.push(this);
  }

  static getAllWindows() {
    return constructedWindows;
  }
  static getAllMockWindows() {
    return constructedWindows;
  }
  static getAllWindowsExceptMain() {
    return constructedWindows.filter((window) => window.identifiers.type !== WindowTypes.main);
  }
  static setMockWindows(mockWindows) {
    constructedWindows = mockWindows;
  }
  static resetAllMockWindows() {
    constructedWindows = [];
  }
}

const Menu = { setApplicationMenu: jest.fn() };
const screen = {
  getDisplayNearestPoint: () => {
    return {
      workArea: {
        x: 0,
        y: 0,
        width: 500,
      },
    };
  },
};

module.exports = { BrowserWindow, Menu, screen };
