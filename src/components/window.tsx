// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the Main component to form a window
 */
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useSelector } from "react-redux";

// MainWindow code has not been converted to Typescript, yet.
// eslint-disable-next-line
// @ts-ignore
import MainWindow from "components/windows/main-window";
// IncomingCallWindow code has not been converted to Typescript, yet.
// eslint-disable-next-line
// @ts-ignore
import IncomingCallWindow from "components/windows/incoming-call-window";
// InCallWindow code has not been converted to Typescript, yet.
// eslint-disable-next-line
// @ts-ignore
import InCallWindow from "components/windows/in-call-window";
import { changeLanguage } from "components/localisation/i18n-utils";
import { WindowTypes } from "shared/types";
import { StoreState } from "store/types";

const Window: React.FC = () => {
  const { t } = useTranslation();
  // Decide which components to render based on window type
  const windowType = useSelector<StoreState, WindowTypes>((state) => state.windowReducer.type);

  const javaLocale = useSelector<StoreState, string>(
    (state) => state.settingsReducer.settings.general?.javaLocale
  );

  useEffect(() => {
    // eslint-disable-next-line i18next/no-literal-string
    changeLanguage(javaLocale);
  }, [javaLocale]);

  const renderWindow = (windowType: WindowTypes): React.ReactElement => {
    // eslint-disable-next-line i18next/no-literal-string
    switch (windowType) {
      case WindowTypes.incomingCall: {
        document.title = t("incomingCallWindowTitle");
        return <IncomingCallWindow />;
      }
      case WindowTypes.inCall: {
        document.title = t("inCallWindowTitle");
        return <InCallWindow />;
      }
      case WindowTypes.main:
      default: {
        document.title = t("mainWindowTitle");
        return <MainWindow />;
      }
    }
  };

  return <>{renderWindow(windowType)}</>;
};

export default Window;
