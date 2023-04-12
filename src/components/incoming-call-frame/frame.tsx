// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the incoming call frame, with the callers Avatar, Name, and Number (where possible)
 */

import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { fullname } from "components/utils/common";
import { formatPhoneNumber } from "components/utils/phone-formatter";

import { selectOneContactWithPhoneNumber } from "store/selectors/contacts";
import {
  updateActiveCall,
  deleteActiveCall,
} from "action-creators/ipc-outgoing/active-calls-actions";
import DefaultProfilePicture from "assets/shared/default-profile-picture.png";
import Accept from "assets/shared/button-answer.svg";
import Reject from "assets/shared/button-hang-up.svg";
import * as S from "./styles";
import log from "src/renderer-logging";
import Tippy from "@tippyjs/react";
import Tooltip from "components/tooltip/tip";

import { ActiveCall, CallStatus, EasRegion, WindowTypes } from "src/types";
import { MaXWindow, StoreState } from "../../store/types";
/**
 * Render the incoming call frame
 */
const IncomingCallFrame: React.FC = () => {
  const { t } = useTranslation();

  const windowInformation = useSelector<StoreState, MaXWindow>((state) => state.windowReducer);
  // Do not render if window is not an incoming call window
  if (windowInformation.type !== WindowTypes.incomingCall) return <></>;
  const remoteParty = windowInformation.metadata.remoteParty;
  const uid = windowInformation.identifiers.uid;

  const contact = useSelector(selectOneContactWithPhoneNumber(remoteParty));
  const activeCalls = useSelector<StoreState, ActiveCall[]>(
    (state) => state.activeCallsReducer.activeCalls
  );
  const easRegion = useSelector<StoreState, EasRegion>(
    (state) => state.settingsReducer.settings.general.easRegion
  );

  const phoneNumber = formatPhoneNumber(remoteParty, easRegion);

  // TODO: Implement phone number matching more than one contact
  const activeCall = activeCalls.filter((c) => c?.remoteParty === remoteParty)[0];

  const defaultImage = (
    <S.ProfilePicture src={DefaultProfilePicture} alt="Default profile picture" />
  );

  const defaultDetails = (
    <div>
      <S.UpperDetails>{phoneNumber}</S.UpperDetails>
      <S.LowerDetails>{t("incomingCall")}</S.LowerDetails>
    </div>
  );

  const acceptCall = (): void => {
    log.userAction("Clicked to accept the call");
    updateActiveCall(activeCall?.uid ? activeCall.uid : uid, CallStatus.CURRENT);
  };

  const rejectCall = (): void => {
    log.userAction("Clicked to reject the call");
    deleteActiveCall(activeCall?.uid ? activeCall.uid : uid);
  };

  let image = defaultImage;
  let details = defaultDetails;

  if (contact) {
    // Determine image
    if (contact.identity?.profilePicture) {
      image = <S.ProfilePicture src={contact.identity?.profilePicture} alt="Profile picture" />;
    }
    // Determine details
    // TODO DUIR-3351: This logic shouldn't depend on a translated string
    if (fullname(contact) !== t("noName")) {
      details = (
        <div>
          <S.UpperDetails>{fullname(contact)}</S.UpperDetails>
          <S.LowerDetails>{phoneNumber}</S.LowerDetails>
        </div>
      );
    }
  }

  log.debug("Rendering incoming call frame");
  return (
    <S.Background id="incomingCallFrame">
      <S.Info>
        {image}
        {details}
      </S.Info>
      <S.ButtonContainer>
        <Tippy content={<Tooltip text={t("acceptCall")} />} delay={[600, 0]} placement="bottom">
          <S.StyleButton id="acceptButton" onClick={acceptCall}>
            <img src={Accept} alt={t("acceptCall")} />
          </S.StyleButton>
        </Tippy>
        <Tippy content={<Tooltip text={t("rejectCall")} />} delay={[600, 0]} placement="bottom">
          <S.StyleButton id="rejectButton" onClick={rejectCall}>
            <img src={Reject} alt={t("rejectCall")} />
          </S.StyleButton>
        </Tippy>
      </S.ButtonContainer>
    </S.Background>
  );
};

export default IncomingCallFrame;
