// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the pane telling users they're signed out of chat and inviting them
 * to sign in.
 */

import * as S from "./styles";
import React from "react";
import { useTranslation } from "react-i18next";
import log from "src/renderer-logging";
import { signIntoChat } from "action-creators/ipc-outgoing/settings-actions";

const ChatNotSignedIn = (): React.ReactElement => {
  const { t } = useTranslation();

  const clickHandler = (): void => {
    log.userAction(`Clicked signIntoChat Button`);
    signIntoChat();
  };

  return (
    <S.PanelContainer>
      <h1>{t("chatDisabled")}</h1>
      <p>{t("chatDisabledMessage")}</p>
      <S.Button onClick={clickHandler}>{t("signIntoChat")}</S.Button>
    </S.PanelContainer>
  );
};

export default ChatNotSignedIn;
