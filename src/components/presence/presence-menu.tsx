// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Presence Menu component.
 */

import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import * as S from "components/presence/styles";
// Menu code has not been converted to Typescript, yet.
// eslint-disable-next-line
// @ts-ignore
import { Section } from "components/menu/menu";

import Busy from "assets/shared/presence-busy.svg";
import Dnd from "assets/shared/presence-dnd.svg";
import Online from "assets/shared/presence-online.svg";
import CallManager from "assets/shared/call-manager.svg";

import { PresenceState, CallManagerType } from "shared/types";
import { PresenceMenuState } from "../utils/common";
import { StoreState } from "store/types";

export interface Props {
  presenceState: PresenceState;
  onSelectPresence: (presenceState: PresenceState) => void;
  onClosePresenceMenu: () => void;
  onCloseAvatarMenu: () => void;
  onOpenCallManager: () => void;
}

const PresenceMenu: React.FC<Props> = (props) => {
  const { t } = useTranslation();

  const menuRef = useRef<HTMLUListElement>(null);
  const firstMenuItem = useRef<HTMLAnchorElement>(null);

  /**
   * Get the Call Manager type.  Valid options are:
   * - CallManagerType.ICM (Incoming Call Manager)
   * - CallManagerType.ECM (Easy Call Manager)
   * - CallManagerType.BCM (Business Call Manager)
   * - CallManagerType.NONE (No call manager configured)

   * See https://metacom2.metaswitch.com/confluence/x/hVNFBg for more info.
   */
  const callManagerType = useSelector<StoreState, CallManagerType>(
    (state) => state.settingsReducer.settings.call.callManagerType
  );
  const DNDAvailable =
    callManagerType === CallManagerType.BCM || callManagerType === CallManagerType.ECM;
  const callManagerAvailable = callManagerType !== CallManagerType.NONE;

  const idList = ["presenceMenuRow-Online"];
  if (props.presenceState === PresenceState.IN_A_MEETING) idList.push("presenceMenuRow-InAMeeting");
  idList.push("presenceMenuRow-Busy");
  if (DNDAvailable) idList.push("presenceMenuRow-DoNotDisturb");
  if (callManagerAvailable) idList.push("presenceMenuRow-OpenCallManager");

  const presenceMenuState = useSelector<StoreState, number>(
    (state: StoreState) => state.paneManagementReducer.presenceMenuState
  );

  useEffect(() => {
    if (presenceMenuState === PresenceMenuState.OPEN) {
      firstMenuItem?.current?.focus();
    }
  }, [presenceMenuState]);

  const isInCall = useSelector<StoreState, boolean>(
    (state: StoreState) => state.activeCallsReducer.activeCalls.length !== 0
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLUListElement>): void => {
    event.preventDefault();
    event.stopPropagation();

    switch (event.key) {
      case "Escape":
        props.onClosePresenceMenu();
        break;
      case "Enter":
      case " ": //https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values Space key value
        {
          // eslint-disable-next-line i18next/no-literal-string
          const clickEvent = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
          });
          event.target?.dispatchEvent(clickEvent);
        }
        break;
      case "ArrowDown":
      case "ArrowRight":
        focusNextElement();
        break;
      case "ArrowUp":
      case "ArrowLeft":
        focusPrevElement();
        break;
      case "Home":
        setFocusToFirstItem();
        break;
      case "End":
        setFocusToLastItem();
        break;
      default:
        break;
    }
  };

  const setFocusToFirstItem = (): void => {
    document.getElementById(idList[0])?.focus();
  };

  const setFocusToLastItem = (): void => {
    document.getElementById(idList[idList.length - 1])?.focus();
  };

  const focusNextElement = (): void => {
    const menuElements = getMenuElements();
    if (menuElements) {
      const focusIndex = getElementFocusIndex(menuElements);
      if (focusIndex < menuElements.length - 1) {
        menuElements[focusIndex + 1].focus();
      }
      if (focusIndex === menuElements.length - 1) {
        setFocusToFirstItem();
      }
    }
  };

  const focusPrevElement = (): void => {
    const menuElements = getMenuElements();
    if (menuElements) {
      const focusIndex = getElementFocusIndex(menuElements);
      if (focusIndex > -1) {
        if (!focusIndex) {
          setFocusToLastItem();
        } else {
          menuElements[focusIndex - 1].focus();
        }
      }
    }
  };

  const getElementFocusIndex = (elements: HTMLElement[]): number => {
    return elements.indexOf(document.activeElement as HTMLElement);
  };

  const getMenuElements = (): HTMLAnchorElement[] => {
    const menu = menuRef.current as HTMLElement;
    return Array.from(menu.getElementsByTagName("a"));
  };

  const renderFirstMenuItem = (): React.ReactElement => {
    if (isInCall) {
      return (
        <S.MenuItem
          id={"presenceMenuRow-Online"}
          role="menuitem"
          tabIndex={-1}
          onClick={(): void => onSelectPresence(PresenceState.ONLINE)}
          ref={firstMenuItem}
        >
          <img src={Busy} alt="" />
          <p>
            {t("online")} - {t("inACall")}
          </p>
        </S.MenuItem>
      );
    }

    return (
      <S.MenuItem
        id={"presenceMenuRow-Online"}
        role="menuitem"
        tabIndex={-1}
        onClick={(): void => onSelectPresence(PresenceState.ONLINE)}
        ref={firstMenuItem}
      >
        <img src={Online} alt="" />
        <p>{t("online")}</p>
      </S.MenuItem>
    );
  };

  const renderInAMeetingItem = (): React.ReactElement | null => {
    if (props.presenceState === PresenceState.IN_A_MEETING) {
      return (
        <li role="none">
          <S.MenuItem
            id={"presenceMenuRow-InAMeeting"}
            role="menuitem"
            tabIndex={-1}
            onClick={(): void => props.onCloseAvatarMenu()}
          >
            <img src={Busy} alt="" />
            <p>{t("inAMeeting")}</p>
          </S.MenuItem>
        </li>
      );
    }
    return null;
  };

  const renderDNDItem = (): React.ReactElement | null => {
    if (DNDAvailable) {
      return (
        <li role="none">
          <S.MenuItem
            id={"presenceMenuRow-DoNotDisturb"}
            role="menuitem"
            tabIndex={-1}
            onClick={(): void => onSelectPresence(PresenceState.DO_NOT_DISTURB)}
          >
            <img src={Dnd} alt="" />
            <p>{t("doNotDisturb")}</p>
          </S.MenuItem>
        </li>
      );
    }
    return null;
  };

  const renderCallManagerItem = (): React.ReactElement | null => {
    if (callManagerAvailable) {
      return (
        <Section>
          <li role="none">
            <S.MenuItem
              id={"presenceMenuRow-OpenCallManager"}
              role="menuitem"
              tabIndex={-1}
              onClick={(): void => onOpenCallManager()}
            >
              <img src={CallManager} alt="" />
              <p>{t("openCallManager")}</p>
            </S.MenuItem>
          </li>
        </Section>
      );
    }
    return null;
  };

  const { onSelectPresence, onOpenCallManager } = props;
  return (
    <S.Submenu
      id="presenceMenu"
      role="menu"
      aria-label="Presence Menu"
      onKeyDown={(event: React.KeyboardEvent<HTMLUListElement>): void => handleKeyDown(event)}
      ref={menuRef}
    >
      <Section borderBottom={callManagerAvailable}>
        <li role="none">{renderFirstMenuItem()}</li>
        {renderInAMeetingItem()}
        <li role="none">
          <S.MenuItem
            id={"presenceMenuRow-Busy"}
            role="menuitem"
            tabIndex={-1}
            onClick={(): void => onSelectPresence(PresenceState.BUSY)}
          >
            <img src={Busy} alt="" />
            <p>{t("busy")}</p>
          </S.MenuItem>
        </li>
        {renderDNDItem()}
      </Section>
      {renderCallManagerItem()}
    </S.Submenu>
  );
};

export default PresenceMenu;
