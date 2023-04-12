// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the three main panes - Sidebar, Midbar, Rightbar. See app.md for information on the app as a whole.
 */
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

// The following modules have not been converted to Typescript, yet.
// eslint-disable-next-line
// @ts-ignore
import Sidebar from "components/sidebar/sidebar";
// eslint-disable-next-line
// @ts-ignore
import Midbar from "components/midbar/midbar";
// eslint-disable-next-line
// @ts-ignore
import Rightbar from "components/rightbar/rightbar";
// eslint-disable-next-line
// @ts-ignore
import UnimplementedPopup from "components/uimplemented-popup/popup";
// eslint-disable-next-line
// @ts-ignore
import BugReportPopup from "components/bug-report-popup/popup";
// eslint-disable-next-line
// @ts-ignore
import PaneControlStateHandler from "components/utils/pane-control-state-handler";
// eslint-disable-next-line
// @ts-ignore
import ModalPopup from "components/modal-popup/popup";

import AllBanners from "components/banner/all-banners";

import * as S from "./styles";

import log from "src/renderer-logging";

import { listContacts } from "action-creators/ipc-outgoing/contacts-actions";
import { listActiveCalls } from "action-creators/ipc-outgoing/active-calls-actions";
import { listHistoricCalls } from "action-creators/ipc-outgoing/call-history-actions";
import { listChats } from "action-creators/ipc-outgoing/messaging-actions";
import { listMeetings } from "action-creators/ipc-outgoing/meetings-actions";
import { getAllSettings } from "action-creators/ipc-outgoing/settings-actions";
import { getVoicemailFaxCount } from "action-creators/ipc-outgoing/voicemails-actions";
import { getAccount } from "action-creators/ipc-outgoing/core-actions";
import { getUser } from "action-creators/ipc-outgoing/user-actions";
import { StoreState } from "store/types";
import { LoginState } from "src/types";
import AppLogo from "assets/shared/max-logo.png";

/**
 * Render the Sidebar, Midbar, and Rightbar
 */
const MainWindow = (): JSX.Element => {
  const isLoggedIn = useSelector<StoreState, boolean>(
    (state) => state.coreReducer.account.loginState === LoginState.LOGGED_IN
  );

  const { t } = useTranslation();

  useEffect(() => {
    listContacts();
    listChats();
    listActiveCalls();
    listHistoricCalls();
    listMeetings();
    getAccount();
    getAllSettings();
    getVoicemailFaxCount();
    getUser();
  }, []);

  log.debug("Rendering main window when " + (isLoggedIn ? "" : "not ") + "logged in");

  const renderMainUi = (): JSX.Element => (
    <S.MainWindow>
      <Sidebar />
      <AllBanners />
      <Midbar />
      <Rightbar />
      <BugReportPopup />
      <UnimplementedPopup />
      <ModalPopup />
      <PaneControlStateHandler />
    </S.MainWindow>
  );

  const renderStartupScreen = (): JSX.Element => (
    <S.StartupScreen id="startupScreen">
      <img src={AppLogo} alt="" />
      <S.StartupText>{t("startupScreenText")}</S.StartupText>
    </S.StartupScreen>
  );

  return isLoggedIn ? renderMainUi() : renderStartupScreen();
};

export default MainWindow;
