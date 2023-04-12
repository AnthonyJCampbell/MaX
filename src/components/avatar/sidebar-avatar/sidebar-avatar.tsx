// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns an avatar representing the logged account for showing
 * avatar (or initials), presence and custom status info.
 */

import React, { useRef, useState } from "react";
import { CustomStatusState, prettyPresence, setPresence } from "components/utils/common";
// ESLint bug https://github.com/typescript-eslint/typescript-eslint/issues/2337
// eslint-disable-next-line no-unused-vars
import { GeneralSettings, PresenceState } from "src/types";
import { setCustomStatusState } from "action-creators/navigation/actions";
import CustomStatusIcon from "assets/shared/menu-status.svg";
import InitialsAvatar from "components/avatar/initials-avatar/initials-avatar";
import { useTranslation } from "react-i18next";
// AvatarMenu code has not been converted to Typescript, yet.
// eslint-disable-next-line
// @ts-ignore
import AvatarMenu from "components/sidebar/avatar-menu";
import log from "src/renderer-logging";

import * as S from "./styles";
import Tippy from "@tippyjs/react";
import Tooltip from "components/tooltip/tip";
import { useDispatch, useSelector } from "react-redux";
import { StoreState } from "store/types";

/**
 * Render avatar for the sidebar, representing the logged in user.
 */
const SidebarAvatar: React.FC = () => {
  const presenceState = useSelector<StoreState, PresenceState>(
    (state) => state.userReducer.user.presence.state
  );
  const presenceCustomStatus = useSelector<StoreState, string>(
    (state) => state.userReducer.user.presence.customStatus
  );
  const general = useSelector<StoreState, GeneralSettings>(
    (state) => state.settingsReducer.settings.general
  );

  const [avatarMenuVisible, setAvatarMenuVisible] = useState(false);
  const avatarButtonRef = useRef<HTMLButtonElement>(null);
  const dispatch = useDispatch();

  const avatarClickHandler = (): void => {
    log.userAction(`Clicked avatar button`);
    setAvatarMenuVisible(!avatarMenuVisible);
  };

  const { t } = useTranslation();
  const presenceStateIcon = (): React.ReactElement | null => {
    if (!presenceState && PresenceState.ONLINE) {
      return null;
    }

    const icon = setPresence(presenceState);

    if (!icon) {
      return null;
    }

    return (
      <S.SidebarPresenceBorder>
        <S.SidebarPresenceIcon src={icon} alt="" />
      </S.SidebarPresenceBorder>
    );
  };

  const presenceCustomStatusIcon = (): React.ReactElement | null => {
    if (!presenceCustomStatus) {
      return null;
    }

    return (
      <S.SidebarCustomStatusBorder>
        <S.SidebarCustomStatusIcon src={CustomStatusIcon} alt="" />
      </S.SidebarCustomStatusBorder>
    );
  };

  const renderAvatar = (): React.ReactElement | null => {
    let avatar = null;

    if (general?.profilePicture) avatar = <S.SidebarPicture src={general.profilePicture} alt="" />;
    else if (general?.displayName) {
      const names = general.displayName.split(" ");
      const firstName = names[0];
      const lastName = names.length > 1 ? names[names.length - 1] : "";
      avatar = <InitialsAvatar firstName={firstName} lastName={lastName} isSidebar={true} />;
    }

    return avatar;
  };

  return (
    <>
      <Tippy
        content={<Tooltip text={t("profile")} />}
        delay={[600, 0]}
        placement="right"
        zIndex={0}
      >
        <Tippy
          content={
            <AvatarMenu
              keyboardNavTools={{
                visible: avatarMenuVisible,
                setVisible: setAvatarMenuVisible,
                buttonRef: avatarButtonRef,
              }}
            />
          }
          interactive={true}
          visible={avatarMenuVisible}
          onClickOutside={(): void => {
            dispatch(setCustomStatusState(CustomStatusState.INITIAL));
            setAvatarMenuVisible(false);
          }}
          placement="right-end"
        >
          <S.SideBarPictureContainer
            aria-label={t("profileButtonStatus", {
              status: prettyPresence(presenceState),
              customStatus: presenceCustomStatus,
            })}
            id="profileButton"
            ref={avatarButtonRef}
            onClick={(): void => avatarClickHandler()}
          >
            {renderAvatar()}
            {presenceStateIcon()}
            {presenceCustomStatusIcon()}
            <S.SidebarPresencePlaceholder />
          </S.SideBarPictureContainer>
        </Tippy>
      </Tippy>
    </>
  );
};

export default SidebarAvatar;
