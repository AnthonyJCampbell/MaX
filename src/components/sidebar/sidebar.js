// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the user's avatar, an 'add' button and the 4 tab buttons.
 */

import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  setActiveMidPane,
  focusMidbarSearch,
  setSearchTerm,
} from "action-creators/navigation/actions";
import { updateHistoricCall } from "action-creators/ipc-outgoing/call-history-actions";
import ArrowKeyControl from "components/arrow-key-control/control";
import Tooltip from "components/tooltip/tip";
import { setAppBadge } from "components/utils/app-badge";
import { callSorter, isAriaHiddenByModal, chatAttention } from "components/utils/common";

import Tippy from "@tippyjs/react";

import * as S from "./styles";
import BottomButtons from "./bottom-buttons/buttons";

import ContactButton from "assets/sidebar/tab-contacts.svg";
import PhoneButton from "assets/sidebar/tab-phone.svg";
import ChatButton from "assets/sidebar/tab-chat.svg";
import MeetingButton from "assets/sidebar/tab-meeting.svg";
import ActiveContactButton from "assets/sidebar/tab-contacts-active.svg";
import ActivePhoneButton from "assets/sidebar/tab-phone-active.svg";
import ActiveChatButton from "assets/sidebar/tab-chat-active.svg";
import ActiveMeetingButton from "assets/sidebar/tab-meeting-active.svg";
import AddNew from "assets/shared/add-new.svg";
import log from "src/renderer-logging";

import AddMenu from "./add-menu";

import SidebarAvatar from "../avatar/sidebar-avatar/sidebar-avatar";

/**
 * Render the left-hand pane - the user's avatar, an 'add' button,
 * and the 4 tab buttons that control activeMidPane.
 */
const Sidebar = () => {
  const activeMidPane = useSelector((state) => state.paneManagementReducer.activeMidPane);
  const activeRightPane = useSelector((state) => state.paneManagementReducer.activeRightPane);
  const focusSearch = useSelector((state) => state.paneManagementReducer.focusSearch);
  const chats = useSelector((state) => state.messagingReducer.chats);
  const historicCalls = useSelector((state) => state.callHistoryReducer.historicCalls);
  const voicemailFaxCount = useSelector((state) => state.voicemailsReducer.voicemailFaxCount);
  const meetingEnabled = useSelector((state) => state.settingsReducer.settings.meetings.enabled);
  const isMainWindowFocused = useSelector(
    (state) => state.paneManagementReducer.isMainWindowFocused
  );

  const selectedContact = useSelector((state) => state.contactReducer.selectedContact);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  // eslint-disable-next-line i18next/no-literal-string
  const idList = ["contactsTabButton", "callsTabButton", "chatsTabButton", "meetingsTabButton"];
  const [addButtonMenuVisibile, setAddButtonMenuVisibile] = useState(false);
  const { showModalPopup } = useSelector((state) => state.paneManagementReducer);

  const addButtonRef = useRef();

  // Set the badge/overlay icon (in useEffect as the value of
  // chatNotifications and missedCallNotifications needs to be calculated first)
  useEffect(() => {
    setAppBadge(chatNotifications + missedCallNotifications + voicemailFaxCount.newMessages);
  });

  // Calculate the number of conversations requesting attention
  const chatNotifications = chats.filter((chat) =>
    chatAttention(chat, selectedContact, activeRightPane, isMainWindowFocused)
  ).length;

  // Calculate the number of missed historic calls (out of the 50 shown in the midbar)
  // requesting attention.
  let missedCallNotifications = 0;
  if (Array.isArray(historicCalls)) {
    missedCallNotifications = historicCalls
      .sort(callSorter)
      .slice(0, 50)
      .filter((call) => {
        return call.attention === true;
      }).length;
  }

  // This method will clear attention from _all_ calls, not just the 50 shown in
  // the midbar.
  const clearCallNotifications = () => {
    historicCalls.forEach((call) => {
      if (call.attention === true) updateHistoricCall(call.uid, false);
    });
  };

  const buttonClickHandler = (pane) => {
    log.userAction(`Clicked sidebar button "${pane}"`);

    // Remove all historic call attention flags if clicking away from the calls tab
    if (activeMidPane === "calls" && pane !== "calls") clearCallNotifications();

    // Set the new activeMidPane
    dispatch(setActiveMidPane(pane));
    // Dispatch an action to focus the search bar in midbar
    dispatch(focusMidbarSearch(focusSearch + 1));
    // Clears the search bar
    dispatch(setSearchTerm(""));
  };

  const addClickHandler = () => {
    log.userAction(`Clicked add button`);
    setAddButtonMenuVisibile(!addButtonMenuVisibile);
  };

  const meetingButton = () => {
    if (!meetingEnabled) {
      return null;
    }

    return (
      <Tippy content={<Tooltip text={t("meetings")} />} delay={[600, 0]} placement="right">
        <button
          id={idList[3]}
          aria-label={t("meetings")}
          tabIndex="-1"
          onClick={() => buttonClickHandler("meetings")}
          role="tab"
          aria-selected={activeMidPane === "meetings"}
        >
          <img src={activeMidPane === "meetings" ? ActiveMeetingButton : MeetingButton} alt="" />
        </button>
      </Tippy>
    );
  };
  const getChatNotificationsLabel = () => {
    return t("chatsLabel_interval", { postProcess: "interval", count: chatNotifications });
  };

  const getMissedCallsNotification = () => {
    return t("callsLabel_interval", { postProcess: "interval", count: missedCallNotifications });
  };

  log.debug("Rendering Sidebar");

  return (
    <S.Sidebar id="sidebar" aria-hidden={isAriaHiddenByModal(showModalPopup)}>
      {/* TOP */}
      <S.TopContainer>
        {/* Profile Image at the top of the sidebar */}
        <SidebarAvatar />
        {/* Green Plus Button*/}
        <>
          <Tippy content={<Tooltip text={t("add")} />} delay={[600, 0]} placement="right">
            <Tippy
              content={
                <AddMenu
                  keyboardNavTools={{
                    visible: addButtonMenuVisibile,
                    setVisible: setAddButtonMenuVisibile,
                    buttonRef: addButtonRef,
                  }}
                />
              }
              interactive={true}
              visible={addButtonMenuVisibile}
              onClickOutside={() => setAddButtonMenuVisibile(false)}
              placement="right-end"
            >
              <S.AddButton
                aria-label={t("add")}
                id="addButton"
                ref={addButtonRef}
                onClick={() => addClickHandler()}
              >
                <img src={AddNew} alt="" />
              </S.AddButton>
            </Tippy>
          </Tippy>
        </>
        <S.ButtonDivider />

        <ArrowKeyControl idList={idList}>
          {/* Button container */}
          <S.ButtonContainer role="tablist">
            <Tippy content={<Tooltip text={t("contacts")} />} delay={[600, 0]} placement="right">
              <button
                id={idList[0]}
                aria-label={t("contacts")}
                tabIndex="0"
                onClick={() => buttonClickHandler("contacts")}
                role="tab"
                aria-selected={activeMidPane === "contacts"}
              >
                <img
                  src={activeMidPane === "contacts" ? ActiveContactButton : ContactButton}
                  alt=""
                />
              </button>
            </Tippy>
            <Tippy content={<Tooltip text={t("calls")} />} delay={[600, 0]} placement="right">
              <button
                id={idList[1]}
                aria-label={getMissedCallsNotification()}
                tabIndex="-1"
                onClick={() => buttonClickHandler("calls")}
                role="tab"
                aria-selected={activeMidPane === "calls"}
              >
                <img src={activeMidPane === "calls" ? ActivePhoneButton : PhoneButton} alt="" />
                {/* Show number of call notifications, if > 0 */}
                {missedCallNotifications !== 0 && (
                  <S.Notification aria-hidden={true}>
                    {missedCallNotifications > 9 ? "9+" : missedCallNotifications}
                  </S.Notification>
                )}
              </button>
            </Tippy>
            <Tippy content={<Tooltip text={t("chats")} />} delay={[600, 0]} placement="right">
              <button
                id={idList[2]}
                aria-label={getChatNotificationsLabel()}
                tabIndex="-1"
                onClick={() => buttonClickHandler("chat")}
                role="tab"
                aria-selected={activeMidPane === "chat"}
              >
                <img src={activeMidPane === "chat" ? ActiveChatButton : ChatButton} alt="" />
                {/* Show number of chat notifications, if > 0 */}
                {chatNotifications !== 0 && (
                  <S.Notification aria-hidden={true}>
                    {chatNotifications > 9 ? "9+" : chatNotifications}
                  </S.Notification>
                )}
              </button>
            </Tippy>
            {meetingButton()}
          </S.ButtonContainer>
        </ArrowKeyControl>
      </S.TopContainer>

      <BottomButtons voicemailFaxCount={voicemailFaxCount.newMessages} />
    </S.Sidebar>
  );
};

export default Sidebar;
