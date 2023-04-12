// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import { Settings } from "src/types";
import log from "src/renderer-logging";
import { SettingsReducerState } from "store/types";

/**
 * Handler for settings data.
 * @param state - The Redux state
 * @param settings - The action payload settings
 */
export const dataSettings = (
  state: SettingsReducerState,
  settings: Settings
): SettingsReducerState => {
  if (settings) {
    return { ...state, settings };
  } else {
    log.debug("Tried to update settings but no setting supplied");
    return state;
  }
};
