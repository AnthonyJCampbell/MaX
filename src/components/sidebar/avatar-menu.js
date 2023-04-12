// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the 'Avatar' menu.
 * Contains various buttons for general app/user function.
 */

import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import Tippy from "@tippyjs/react";

import {
  Button,
  Menu,
  PresenceButton,
  Section,
  AccountNumber,
  DisplayName,
} from "components/menu/menu";
import PresenceMenu from "components/presence/presence-menu";
import CustomStatus from "components/presence/custom-status";

import Avatar from "assets/sidebar/menu-avatar.svg";
import ChangePassword from "assets/sidebar/menu-password.svg";
import Settings from "assets/sidebar/menu-settings.svg";
import Logout from "assets/sidebar/menu-logout.svg";
import Quit from "assets/sidebar/menu-close.svg";
import About from "assets/sidebar/menu-about.svg";
import CheckForUpdates from "assets/sidebar/menu-updates.svg";
import Help from "assets/sidebar/menu-help.svg";
import CallParkOrbits from "assets/sidebar/menu-park.svg";
import CommportalAccount from "assets/shared/menu-external.svg";
import CommportalApps from "assets/sidebar/menu-download.svg";
import CommportalGroup from "assets/sidebar/menu-groups.svg";
import ConferenceManager from "assets/sidebar/menu-conference.svg";

import {
  viewSettings,
  viewChangeAvatar,
  viewCallParkOrbits,
  viewCommportalAccount,
  viewCommportalApps,
  viewCommportalGroup,
  viewConferenceManager,
  viewCallManager,
} from "action-creators/ipc-outgoing/settings-actions";

import {
  viewAbout,
  viewChangePassword,
  viewHelp,
  viewCheckForUpdates,
} from "action-creators/ipc-outgoing/core-actions";
import { updateUser } from "action-creators/ipc-outgoing/user-actions";

import {
  setCustomStatusState,
  setPresenceMenuState,
  showConfirmLogOutPopup,
} from "action-creators/navigation/actions";
import {
  prettyPresence,
  setPresence,
  CustomStatusState,
  PresenceMenuState,
} from "components/utils/common";
import { formatPhoneNumber } from "components/utils/phone-formatter";

import log from "src/renderer-logging";
import { PresenceState, UpdateableUser } from "src/types";

const { app } = window.require("@electron/remote");

// Index numbers are provided in comments to make it easier to check that test code
// that refers to these things by index is using correct values
const idList = [
  "avatarMenuRow-ChangePresence", // 0
  "avatarMenuRow-SetCustomStatus", // 1
  "avatarMenuRow-ChangeAvatar", // 2
  "avatarMenuRow-ChangePassword", // 3
  "avatarMenuRow-Settings", // 4
  "avatarMenuRow-Park", // 5
  "avatarMenuRow-Apps", // 6
  "avatarMenuRow-Conference", // 7
  "avatarMenuRow-Groups", // 8
  "avatarMenuRow-Account", // 9
  "avatarMenuRow-CheckForUpdates", // 10
  "avatarMenuRow-About", // 11
  "avatarMenuRow-Help", // 12
  "avatarMenuRow-Logout", // 13
  "avatarMenuRow-Quit", // 14
];

const AvatarMenu = ({ keyboardNavTools }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const presenceButtonRef = useRef(null);

  const [presenceMenuExpanded, setPresenceMenuExpanded] = useState(false);
  const presenceMenuState = useSelector((state) => state.paneManagementReducer.presenceMenuState);
  const customStatusState = useSelector((state) => state.paneManagementReducer.customStatusState);
  const presenceState = useSelector((state) => state.userReducer.user.presence.state);
  const general = useSelector((state) => state.settingsReducer.settings.general);
  const easRegion = useSelector((state) => state.settingsReducer.settings.general.easRegion);

  useEffect(() => {
    if (presenceMenuState === PresenceMenuState.CLOSE) {
      presenceButtonRef.current.focus();
    }
  }, [presenceMenuState]);

  useEffect(() => {
    if (customStatusState === CustomStatusState.CLOSE) {
      document.getElementById(idList[1]).focus();
    }
  }, [customStatusState]);

  const presenceMenuVisible = presenceMenuState === PresenceMenuState.OPEN;

  const closeMenu = () => {
    onClosePresenceMenu();
    keyboardNavTools.setVisible(false);
    if (keyboardNavTools.buttonRef?.current) keyboardNavTools.buttonRef.current.focus();
  };

  const clickHandler = (action, logText) => {
    log.userAction(`Clicked ${logText} menu button`);
    dismissPresenceMenu();
    dismissCustomStatus();
    action();
    closeMenu();
  };

  const quitApp = () => {
    log.userAction(`Clicked quit button`);
    dismissPresenceMenu();
    dismissCustomStatus();
    closeMenu();
    app.quit();
  };

  const handlePresenceMenuClick = () => {
    log.userAction(`Toggle presence menu`);
    if (presenceMenuVisible) {
      dispatch(setPresenceMenuState(PresenceMenuState.CLOSE));
      presenceButtonRef.current.focus();
      setPresenceMenuExpanded(false);
    } else {
      dispatch(setPresenceMenuState(PresenceMenuState.OPEN));
      setPresenceMenuExpanded(true);
      dismissCustomStatus();
    }
  };

  const onClosePresenceMenu = () => {
    dispatch(setPresenceMenuState(PresenceMenuState.CLOSE));
    setPresenceMenuExpanded(false);
  };

  const dismissPresenceMenu = () => {
    dispatch(setPresenceMenuState(PresenceMenuState.INITIAL));
  };

  const dismissCustomStatus = () => {
    if (customStatusState === CustomStatusState.EDITING) {
      dispatch(setCustomStatusState(CustomStatusState.INITIAL));
    }
  };

  const handleOpenCallManager = () => {
    log.userAction(`Open call manager`);
    viewCallManager();
    closeMenu();
  };

  const handleUpdatePresence = (presenceState) => {
    log.userAction(`Change presence to ${prettyPresence(presenceState)}`);
    const user = {
      presence: {
        state: presenceState,
      },
    };
    updateUser(user);
    closeMenu();
  };

  const presenceStateIcon = () => {
    if (!presenceState && PresenceState.ONLINE) {
      return null;
    }
    return setPresence(presenceState);
  };

  const presenceStateText = () => {
    if (!presenceState && PresenceState.ONLINE) {
      return null;
    }
    return prettyPresence(presenceState);
  };

  const customStatusEvents = {
    onSave: (newCustomStatus) => {
      log.userAction(`Clicked to save custom status`);
      dismissPresenceMenu();
      const user = UpdateableUser.fromObject({
        presence: {
          customStatus: newCustomStatus,
        },
      });

      updateUser(user);
      dispatch(setCustomStatusState(CustomStatusState.CLOSE));
      closeMenu();
    },
    onCancel: (callback) => {
      log.userAction(`Clicked to cancel custom status`);
      dismissPresenceMenu();
      dispatch(setCustomStatusState(CustomStatusState.CLOSE));
      if (callback) {
        callback();
      }
    },
    onEdit: () => {
      log.userAction(`Clicked to edit custom status`);
      dismissPresenceMenu();
      dispatch(setCustomStatusState(CustomStatusState.EDITING));
    },
    onClean: (callback) => {
      log.userAction(`Clicked to clear custom status`);
      dismissPresenceMenu();
      const user = UpdateableUser.fromObject({
        presence: {
          customStatus: "",
        },
      });

      updateUser(user);
      dispatch(setCustomStatusState(CustomStatusState.CLOSE));

      if (callback) {
        callback();
      }
    },
    onClick: () => {
      log.userAction(`Clicked set custom status menu button`);
      dismissPresenceMenu();
      dispatch(setCustomStatusState(CustomStatusState.EDITING));
    },
    onClose: (callback) => {
      dispatch(setCustomStatusState(CustomStatusState.CLOSE));
      if (callback) {
        callback();
      }
    },
  };

  const renderPresenceMenuItem = () => {
    const showPresenceSubMenu =
      presenceState !== PresenceState.OFFLINE &&
      presenceState !== PresenceState.UNKNOWN &&
      presenceState !== PresenceState.UNRECOGNIZED;

    if (showPresenceSubMenu) {
      return (
        <Tippy
          content={
            <PresenceMenu
              presenceState={presenceState}
              onClosePresenceMenu={onClosePresenceMenu}
              onCloseAvatarMenu={closeMenu}
              onSelectPresence={handleUpdatePresence}
              onOpenCallManager={handleOpenCallManager}
            />
          }
          interactive={true}
          visible={presenceMenuVisible}
          onHide={dismissPresenceMenu}
          placement="right-start"
        >
          <PresenceButton
            expanded={presenceMenuExpanded}
            id={idList[0]}
            imageSrc={presenceStateIcon()}
            text={presenceStateText()}
            clickAction={handlePresenceMenuClick}
            ref={presenceButtonRef}
          />
        </Tippy>
      );
    }

    return (
      <PresenceButton
        expanded={presenceMenuExpanded}
        id={idList[0]}
        imageSrc={presenceStateIcon()}
        text={presenceStateText()}
        ref={presenceButtonRef}
        showDisclosureIndicator={false}
        clickAction={closeMenu}
      />
    );
  };

  const renderMenuTitle = () => {
    return (
      <>
        {general?.displayName ? <DisplayName text={general.displayName} /> : null}
        {general?.accountNumber ? (
          <AccountNumber text={formatPhoneNumber(general?.accountNumber, easRegion)} />
        ) : null}
      </>
    );
  };

  const callParkOrbitsButton = () => {
    return (
      <Button
        imageSrc={CallParkOrbits}
        text={t("callParkOrbits")}
        id={idList[5]}
        // eslint-disable-next-line i18next/no-literal-string
        clickAction={() => clickHandler(viewCallParkOrbits, "Call Park Orbits")}
      />
    );
  };

  const commportalAccountButton = () => {
    return (
      <Button
        imageSrc={CommportalAccount}
        text={t("commportalAccount")}
        id={idList[9]}
        // eslint-disable-next-line i18next/no-literal-string
        clickAction={() => clickHandler(viewCommportalAccount, "Commportal account")}
      />
    );
  };

  const commportalAppsButton = () => {
    return (
      <Button
        imageSrc={CommportalApps}
        text={t("commportalApps")}
        id={idList[6]}
        // eslint-disable-next-line i18next/no-literal-string
        clickAction={() => clickHandler(viewCommportalApps, "Commportal apps")}
      />
    );
  };

  const commportalGroupButton = () => {
    return (
      <Button
        imageSrc={CommportalGroup}
        text={t("commportalGroup")}
        id={idList[8]}
        // eslint-disable-next-line i18next/no-literal-string
        clickAction={() => clickHandler(viewCommportalGroup, "Commportal group")}
      />
    );
  };

  const conferenceManagerButton = () => {
    return (
      <Button
        imageSrc={ConferenceManager}
        text={t("conferenceManager")}
        id={idList[7]}
        // eslint-disable-next-line i18next/no-literal-string
        clickAction={() => clickHandler(viewConferenceManager, "Conference Manager")}
      />
    );
  };

  return (
    <Menu keyboardNavTools={keyboardNavTools} id="avatarMenu" idList={idList}>
      <Section borderBottom={true}>{renderMenuTitle()}</Section>
      <Section borderBottom={true}>
        {renderPresenceMenuItem()}
        <CustomStatus id={idList[1]} events={customStatusEvents} />
      </Section>
      <Section borderBottom={true}>
        <Button
          imageSrc={Avatar}
          text={t("changeAvatar")}
          id={idList[2]}
          // eslint-disable-next-line i18next/no-literal-string
          clickAction={() => clickHandler(viewChangeAvatar, "Change avatar")}
        />
        <Button
          imageSrc={ChangePassword}
          text={t("changePassword")}
          id={idList[3]}
          // eslint-disable-next-line i18next/no-literal-string
          clickAction={() => clickHandler(viewChangePassword, "Change password")}
        />
        <Button
          imageSrc={Settings}
          text={t("settings")}
          id={idList[4]}
          clickAction={() => {
            dismissPresenceMenu();
            dismissCustomStatus();
            // eslint-disable-next-line i18next/no-literal-string
            clickHandler(viewSettings, "View General Settings");
          }}
        />
      </Section>
      <Section borderBottom={true}>
        {callParkOrbitsButton()}
        {commportalAppsButton()}
        {conferenceManagerButton()}
        {commportalGroupButton()}
        {commportalAccountButton()}
      </Section>
      <Section borderBottom={true}>
        <Button
          imageSrc={CheckForUpdates}
          text={t("checkForUpdates")}
          id={idList[10]}
          // eslint-disable-next-line i18next/no-literal-string
          clickAction={() => clickHandler(viewCheckForUpdates, "Check for updates")}
        />
        <Button
          imageSrc={About}
          text={t("about")}
          id={idList[11]}
          // eslint-disable-next-line i18next/no-literal-string
          clickAction={() => clickHandler(viewAbout, "View About")}
        />
        <Button
          imageSrc={Help}
          text={t("help")}
          id={idList[12]}
          // eslint-disable-next-line i18next/no-literal-string
          clickAction={() => clickHandler(viewHelp, "View help")}
        />
      </Section>
      <Section borderBottom={true}>
        <Button
          imageSrc={Logout}
          text={t("logOut")}
          id={idList[13]}
          clickAction={() =>
            // eslint-disable-next-line i18next/no-literal-string
            clickHandler(() => dispatch(showConfirmLogOutPopup()), "Log out")
          }
        />
        <Button imageSrc={Quit} text={t("quit")} id={idList[14]} clickAction={quitApp} />
      </Section>
    </Menu>
  );
};
AvatarMenu.propTypes = {
  keyboardNavTools: PropTypes.object,
};

export default AvatarMenu;
