// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Render the app (and it's utilities) into the html of the main electron window.
 */
import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import store from "store/store";
import { ActionTypes } from "shared/types";

import IPCListener from "action-creators/ipc-incoming/listeners";
import Window from "components/window";
import GlobalCSS from "components/utils/global-styles";

import log from "src/renderer-logging";
import { initDateTimeFormat } from "components/utils/date-time";
import { getInitialLocale } from "components/localisation/i18n-utils";
import initI18n from "components/localisation/i18n-init";
import { ipcChannels } from "shared/constants";

const isDev = window.require("electron-is-dev");
const { ipcRenderer } = window.require("electron");

initI18n(getInitialLocale())
  .then(() => {
    initDateTimeFormat();

    const identifiersAndMetadata = ipcRenderer.sendSync(ipcChannels.identifiersAndMetadataRequest);
    store.dispatch({
      type: ActionTypes.WINDOW_STARTUP,
      payload: identifiersAndMetadata,
    });

    if (isDev) {
      const axe = window.require("@axe-core/react");

      // TODO Remove this workaround (passing in empty runOnly object in config) once it's fixed:
      //  https://github.com/dequelabs/axe-core-npm/issues/176
      const config = { runOnly: {} };

      axe(React, ReactDOM, 1000, config);
    }

    ReactDOM.render(
      // Provider is the wrapper which makes the Redux store accessible
      <Provider store={store}>
        {/* Global CSS Component containing Style Rest & Fonts */}
        <GlobalCSS />

        {/* Component that holds all IPC listeners & places them inside the render tree so they get evaluated */}
        <IPCListener />

        {/* Actual Window component */}
        <Window />
      </Provider>,
      document.getElementById("root")
    );
  })
  .catch((error) => {
    log.error(`i18next failed to initialize: ${error}`);
  });
