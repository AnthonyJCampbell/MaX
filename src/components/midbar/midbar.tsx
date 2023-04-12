// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns a searchbar and a scrollable list, that depends on the activeMidPane.
 */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import ContactList from "./contact-list/contact-list";
import CallList from "./call-list/call-list";
import ChatList from "./chat-list/chat-list";
import ChatNotSignedIn from "./chat-list/sign-into-chat";
import MeetingManagement from "./meeting-management/management";
import SearchBar from "./search-bar/search-bar";

import {
  appendDigitToSearch,
  setIsMidPaneDialPadVisible,
  setSearchTerm,
  setSelectedContact,
  focusRightbarMessage,
} from "action-creators/navigation/actions";
import { createActiveCall } from "action-creators/ipc-outgoing/active-calls-actions";
import { sendAnalytic } from "store/action-creators/ipc-outgoing/analytics-actions";
import { selectOneContactWithPhoneNumber } from "store/selectors/contacts";
import { removeNumberFormatting } from "components/utils/common";
import { Contact } from "src/types";

import * as S from "./midbar-styles";

import log from "src/renderer-logging";
import { isAriaHiddenByModal } from "components/utils/common";
import IconButton from "components/ui/IconButton/IconButton";
import { IconVariant } from "components/ui/Icon/types";
import Dialpad from "components/ui/Dialpad";
import { selectCanCall } from "store/selectors/paneManagement";
import { IconButtonVariant } from "components/ui/IconButton/types";
import { IconName } from "assets/icons/iconsLib";
import { GridAreas, Sizes } from "components/utils/style-constants";
import { DialKeyValue, StoreState } from "src/store/types";
import { ModalPopupTypes } from "src/types";
/**
 * Render the middle pane - a search bar and a scrollable list, which depends on the activeMidPane.
 */
const Midbar: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const searchTerm = useSelector<StoreState, string>(
    (state) => state.paneManagementReducer.searchTerm
  );
  const activeMidPane = useSelector<StoreState, string>(
    (state) => state.paneManagementReducer.activeMidPane
  );
  const showModalPopup = useSelector<StoreState, ModalPopupTypes>(
    (state) => state.paneManagementReducer.showModalPopup
  );
  const dialPadVisible = useSelector<StoreState, boolean>(
    (state) => state.paneManagementReducer.isMidPaneDialPadVisible
  );
  const chatSignedIn = useSelector<StoreState, boolean>(
    (state) => state.settingsReducer.settings.messaging.isSignedIn
  );
  const canCall = useSelector(selectCanCall);
  const contact = useSelector(selectOneContactWithPhoneNumber(removeNumberFormatting(searchTerm)));

  const toggleDialpad = (): void => {
    dispatch(setIsMidPaneDialPadVisible(!dialPadVisible));
  };

  /**
   * Render the content, depending on the value of activeMidPane
   */
  const renderMidBarContent = (): JSX.Element => {
    switch (activeMidPane) {
      case "contacts":
        return <ContactList />;

      case "calls":
        return <CallList />;

      case "chat":
        if (chatSignedIn) {
          return <ChatList />;
        } else {
          return <ChatNotSignedIn />;
        }

      case "meetings":
        return <MeetingManagement />;

      default:
        return <></>;
    }
  };

  const onDialpadClick = (value: DialKeyValue): void => {
    dispatch(appendDigitToSearch(value));
  };

  const makeCall = (): void => {
    log.userAction(`User initiated call from dialpad button with search term "${searchTerm}"`);
    createActiveCall(searchTerm);
    dispatch(setSearchTerm(""));
  };

  const sendSMS = (): void => {
    log.userAction(`User initiated SMS from dialpad button with search term "${searchTerm}"`);
    const numberToDial = removeNumberFormatting(searchTerm);
    dispatch(
      setSelectedContact(contact ? contact : Contact.fromPhoneNumber(numberToDial), numberToDial)
    );
    dispatch(focusRightbarMessage());
    dispatch(setSearchTerm(""));
    sendAnalytic("USER_CHAT_FROM_SEARCHBAR");
  };

  log.debug("Rendering Midbar");

  return (
    <S.Midbar
      id="midbar"
      aria-hidden={isAriaHiddenByModal(showModalPopup)}
      dialpadVisible={dialPadVisible}
    >
      <SearchBar />
      <IconButton
        id="showKeypadButton"
        ariaLabel={dialPadVisible ? t("hideKeypad") : t("showKeypad")}
        tooltipText={dialPadVisible ? t("hideKeypad") : t("showKeypad")}
        icon={dialPadVisible ? IconName.dialpadOpen : IconName.dialpad}
        variant={IconButtonVariant.white}
        iconVariant={dialPadVisible ? IconVariant.primary : IconVariant.dark}
        iconSize={17}
        width={Sizes.midbar.dialpadButtonSize}
        height={Sizes.midbar.dialpadButtonSize}
        onClickHandler={toggleDialpad}
      />

      {dialPadVisible && (
        <Dialpad
          id="midbarDialpad"
          callButtonVisible={true}
          callButtonDisabled={!canCall}
          margin={Sizes.midbar.dialPadMargin}
          gridArea={GridAreas.midbar.dialpad}
          onDialpadClick={onDialpadClick}
          onCall={makeCall}
          onSMS={sendSMS}
        />
      )}
      <S.MidbarContent>{renderMidBarContent()}</S.MidbarContent>
    </S.Midbar>
  );
};

export default Midbar;
