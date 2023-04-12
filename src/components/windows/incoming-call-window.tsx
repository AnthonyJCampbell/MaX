// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the incoming call frame
 */
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import IncomingCallFrame from "components/incoming-call-frame/frame";
import Draggable from "components/windows/draggable/draggable";

import * as S from "./styles";

import log from "src/renderer-logging";

import { getContact } from "action-creators/ipc-outgoing/contacts-actions";
import { tippyResizeWindowCallback } from "src/components/utils/common";
import { MaXWindow, StoreState } from "../../store/types";
import { WindowTypes } from "../../shared/types";
import { PhoneNumberType } from "protobuf-wispa/dist/telephony";

/**
 * Render the incoming call window
 * @param {String} phoneNumber - The phone number of the caller
 */
const IncomingCallWindow: React.FC = () => {
  const windowInformation = useSelector<StoreState, MaXWindow>((state) => state.windowReducer);
  //  Do not render if window is not an incoming call window
  if (windowInformation.type !== WindowTypes.incomingCall) return <></>;
  const phoneNumber = windowInformation.metadata.remoteParty;

  // Get the contact information using the phone number
  useEffect(() => {
    getContact({ phone: [{ value: phoneNumber, type: PhoneNumberType.OTHER_NUMBER }] });
  }, [phoneNumber]);

  // Tippy window listener for resizing
  const tippyListener = new MutationObserver(() =>
    tippyResizeWindowCallback(windowInformation.type, windowInformation.identifiers, 75, 100)
  );
  useEffect(() => {
    tippyListener.observe(document.body, { childList: true, subtree: true });
    return (): void => {
      tippyListener.disconnect();
    };
    // We only want to call this useEffect once, so we don't add multiple observers,
    // leaving the useEffect deps empty is the only way to do this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  log.debug("Rendering incoming call window");
  return (
    <S.IncomingCallWindow>
      <Draggable>
        <IncomingCallFrame />
      </Draggable>
    </S.IncomingCallWindow>
  );
};

export default IncomingCallWindow;
