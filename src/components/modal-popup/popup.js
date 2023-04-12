// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import FocusTrap from "focus-trap-react";
import { useDispatch, useSelector } from "react-redux";

import ConfirmDeletePopup from "./confirm-delete-popup/popup";
import ConfirmLogOut from "./confirm-log-out/popup";
import { hideModalPopup } from "action-creators/navigation/actions";
import { ModalPopupTypes } from "src/types";

import log from "src/renderer-logging";
import * as S from "./styles";

/**
 * Return the Modal Popup component
 * A popup with a grey background and focus trap
 */
const ModalPopup = () => {
  const dispatch = useDispatch();
  const { showModalPopup } = useSelector((state) => state.paneManagementReducer);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") dispatch(hideModalPopup());
  };

  // Decide which content to show
  const generateContent = () => {
    switch (showModalPopup) {
      case ModalPopupTypes.deleteContact:
        log.debug("Modal pop-up type = confirm delete");
        return <ConfirmDeletePopup />;
      case ModalPopupTypes.logOut:
        log.debug("Modal pop-up type = confirm log out");
        return <ConfirmLogOut />;
      default:
        return <></>;
    }
  };
  /* The main text of the content has to have a div witg the "dialogText" id
   * to been read and shown to the user.
   */
  if (showModalPopup !== ModalPopupTypes.noModal) {
    log.debug("Rendering modal pop-up");
    return (
      <S.Background onKeyDown={(e) => handleKeyDown(e)}>
        <FocusTrap
          focusTrapOptions={{
            escapeDeactivates: false,
          }}
        >
          <S.PopupContainer role="dialog" aria-labelledby="dialogTitle" tabIndex="-1">
            <S.ContentContainer>{generateContent()}</S.ContentContainer>
          </S.PopupContainer>
        </FocusTrap>
      </S.Background>
    );
  } else {
    return <></>;
  }
};

export default ModalPopup;
