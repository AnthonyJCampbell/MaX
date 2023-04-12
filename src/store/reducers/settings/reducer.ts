// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the reducer that controls all settings-related store data mutations.
 *
 * Features should be disabled by default.
 * In practice, we should never render UI with the default state because data from Java
 * will arrive early enough, but if this does happen somehow, we don't want to display
 * features the user doesn't have configured.
 */

import { ActionTypes } from "shared/types";
import * as handlers from "./handlers";
import { SettingsReducerState, SettingsPayload } from "store/types";
import { DEFAULT_EAS_REGION } from "shared/constants";
import { ClickToDialType, CallManagerType, BGLineType } from "protobuf-wispa/dist/settings";

const initialState: SettingsReducerState = {
  settings: {
    meetings: {
      enabled: false,
    },
    messaging: {
      enabled: false,
      isSignedIn: false,
      groupChatEnabled: false,
      smsEnabled: false,
    },
    call: {
      voipEnabled: false,
      clickToDialType: ClickToDialType.CTD_NONE,
      callManagerType: CallManagerType.NONE,
      callJumpEnabled: false,
      voicemailEnabled: false,
      callParkActive: false,
    },
    general: {
      profilePicture: undefined,
      displayName: "",
      accountNumber: "",
      bgLineType: BGLineType.BG_NONE,
      isNseriesConfEnabled: false,
      easRegion: DEFAULT_EAS_REGION,
      javaLocale: "",
    },
  },
};

export const settingsReducer = (
  state = initialState,
  { type, payload }: { type: ActionTypes; payload: SettingsPayload }
): SettingsReducerState => {
  switch (type) {
    case ActionTypes.DATA_SETTINGS:
      if (payload.settings !== undefined) return handlers.dataSettings(state, payload.settings);
      return state;
    default:
      return state;
  }
};
