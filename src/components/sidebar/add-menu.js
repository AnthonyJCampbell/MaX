// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the 'Add' menu.
 * Contains various buttons for general app/user function.
 */

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import { Menu, Section, Button } from "components/menu/menu";

import AddContact from "assets/sidebar/menu-add-contact.svg";
import NewCall from "assets/sidebar/menu-keypad.svg";
import NewGroupChat from "assets/sidebar/menu-chat.svg";
import StartMeeting from "assets/sidebar/menu-start.svg";
import ScheduleMeeting from "assets/sidebar/menu-schedule.svg";

import { addContact } from "action-creators/ipc-outgoing/contacts-actions";
import {
  scheduleMeeting,
  createMeetingWithOptions,
} from "action-creators/ipc-outgoing/meetings-actions";

import { focusMidbarSearch } from "action-creators/navigation/actions";

import log from "src/renderer-logging";
import { showCreateGroupChat } from "store/action-creators/ipc-outgoing/messaging-actions";

const AddMenu = ({ keyboardNavTools }) => {
  const { focusSearch } = useSelector((state) => state.paneManagementReducer);
  const inAMeeting = useSelector((state) => state.meetingReducer.meetings.length) !== 0;

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const idList = [
    "addMenuRow-NewCall",
    "addMenuRow-NewGroupChat",
    "addMenuRow-AddContact",
    "addMenuRow-StartMeeting",
    "addMenuRow-ScheduleMeeting",
  ];

  const closeMenu = () => {
    keyboardNavTools.setVisible(false);
    if (keyboardNavTools.addButtonRef?.current) keyboardNavTools.addButtonRef.current.focus();
  };

  const clickHandler = (action, logText) => {
    log.userAction(`Clicked ${logText} Button`);
    action();
    closeMenu();
  };

  return (
    <Menu keyboardNavTools={keyboardNavTools} id="addMenu" idList={idList}>
      <Section borderBottom={true}>
        <Button
          imageSrc={NewCall}
          text={t("newCall")}
          id={idList[0]}
          clickAction={() =>
            // eslint-disable-next-line i18next/no-literal-string
            clickHandler(() => dispatch(focusMidbarSearch(focusSearch + 1)), "New call")
          }
        />
        <Button
          imageSrc={NewGroupChat}
          text={t("newGroupChat")}
          id={idList[1]}
          // eslint-disable-next-line i18next/no-literal-string
          clickAction={() => clickHandler(showCreateGroupChat, "New group chat...")}
        />
      </Section>
      <Section borderBottom={true}>
        <Button
          imageSrc={AddContact}
          text={t("addContact")}
          id={idList[2]}
          // eslint-disable-next-line i18next/no-literal-string
          clickAction={() => clickHandler(addContact, "Add contact")}
        />
      </Section>
      <Section borderBottom={true}>
        <Button
          imageSrc={StartMeeting}
          text={inAMeeting ? t("inviteOthers") : t("createAMeeting")}
          id={idList[3]}
          clickAction={() =>
            // eslint-disable-next-line i18next/no-literal-string
            clickHandler(createMeetingWithOptions, inAMeeting ? "Invite others" : "Create Meeting")
          }
        />
        <Button
          imageSrc={ScheduleMeeting}
          text={t("scheduleAMeeting")}
          id={idList[4]}
          // eslint-disable-next-line i18next/no-literal-string
          clickAction={() => clickHandler(scheduleMeeting, "Schedule Meeting")}
        />
      </Section>
    </Menu>
  );
};

AddMenu.propTypes = {
  keyboardNavTools: PropTypes.object,
};

export default AddMenu;
