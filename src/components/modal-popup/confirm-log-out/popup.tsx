// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { useTranslation } from "react-i18next";

import * as S from "./styles";

import { logOut } from "action-creators/ipc-outgoing/core-actions";
import { useDispatch } from "react-redux";

import { hideModalPopup } from "action-creators/navigation/actions";
import log from "src/renderer-logging";

const ConfirmLogOut: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const clickHandler = (logText: string, action?: () => void): void => {
    log.userAction(`Clicked ${logText} Button in Confirm Log Out Popup`);
    if (action) {
      action();
    }
    dispatch(hideModalPopup());
  };

  return (
    <span id="confirmLogOutPopup">
      <S.VariableText>
        <h1 id="dialogTitle">{t("warnLogOut")}</h1>
        <p>{t("logOutText")}</p>
      </S.VariableText>

      <S.ButtonsContainer>
        <S.Button
          logOut={true}
          // eslint-disable-next-line i18next/no-literal-string
          onClick={(): void => clickHandler("logOutButton", logOut)}
          id={"confirmLogOutPopup-LogOut"}
        >
          {t("logOutButton")}
        </S.Button>
        <S.Button
          // eslint-disable-next-line i18next/no-literal-string
          onClick={(): void => clickHandler("cancel")}
          id={"confirmLogOutPopup-Cancel"}
        >
          {t("cancel")}
        </S.Button>
      </S.ButtonsContainer>
    </span>
  );
};

export default ConfirmLogOut;
