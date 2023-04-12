// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the in call frame
 */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import InCallPopOut from "components/rightbar/content-header-panel/in-call-header-panel/in-call-pop-out";
import Draggable from "./draggable/draggable";

import * as S from "./styles";

import log from "src/renderer-logging";

import { getContact } from "action-creators/ipc-outgoing/contacts-actions";
import { listActiveCalls } from "action-creators/ipc-outgoing/active-calls-actions";
import { listMeetings } from "action-creators/ipc-outgoing/meetings-actions";
import { getAllSettings } from "action-creators/ipc-outgoing/settings-actions";
import { setSelectedContact } from "action-creators/navigation/actions";
import { selectOneContactWithPhoneNumber } from "store/selectors/contacts";
import { tippyResizeWindowCallback } from "src/components/utils/common";
import { Contact } from "src/types";
import { noSelectedContactUid } from "shared/constants";
import { StoreState, MaXWindow } from "store/types";
import { PhoneNumberType, WindowTypes } from "shared/types";

/**
 * Render the call window containing the InCallPopOut
 * @param {String} phoneNumber - The phone number of the caller
 */
const InCallWindow: React.FC = () => {
  const dispatch = useDispatch();

  // We can only render the InCallPopOut once the relevant contact has been requested, made
  // its way to the Redux store, and been selected
  const selectedContactUid = useSelector<StoreState, string>(
    (state) => state.contactReducer.selectedContact.uid
  );
  const windowInformation = useSelector<StoreState, MaXWindow>((state) => state.windowReducer);
  // Do not render if window is not an incoming call window
  if (windowInformation.type !== WindowTypes.inCall) return null;
  const remoteParty = windowInformation.metadata.remoteParty;

  const reduxStoreHasSelectedContact = selectedContactUid !== noSelectedContactUid;
  const contact = useSelector(selectOneContactWithPhoneNumber(remoteParty));

  if (!reduxStoreHasSelectedContact) {
    dispatch(setSelectedContact(Contact.fromPhoneNumber(remoteParty)));
  } else if (contact !== null && selectedContactUid !== contact.uid) {
    dispatch(setSelectedContact(contact));
  }

  // Retrieve all activeCalls and meetings
  // Get the contact information using the phone number
  useEffect(() => {
    listActiveCalls();
    listMeetings();
    getAllSettings();
    getContact({ phone: [{ value: remoteParty, type: PhoneNumberType.UNRECOGNIZED }] });
  }, []);

  // Tippy window listener for resizing
  const tippyListener = new MutationObserver(() =>
    tippyResizeWindowCallback(windowInformation.type, windowInformation.identifiers, 74, 100)
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

  log.debug("Rendering popped-out call window");
  return (
    <S.InCallWindow id="contentHeaderPanel">
      {reduxStoreHasSelectedContact ? (
        <Draggable>
          <InCallPopOut />
        </Draggable>
      ) : (
        <React.Fragment />
      )}
    </S.InCallWindow>
  );
};

export default InCallWindow;
