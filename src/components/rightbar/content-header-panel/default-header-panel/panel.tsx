// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the DefaultHeaderPanel for rightbar/Pane C.
 * It contains the selected contact's name, status, and several buttons to initiate calls and messages.
 */

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import Avatar from "components/avatar/avatar";
import TopButton from "components/rightbar/content-header-panel/top-button/button";
import { fullname, prettyPresenceWithStatus } from "components/utils/common";
import { formatPhoneNumber } from "components/utils/phone-formatter";
import IconButton from "components/ui/IconButton/IconButton";

import * as Shared from "../shared-styles";

import MeetingButton from "assets/rightbar/button-meeting.svg";
import AddToMeetingButton from "assets/rightbar/button-meeting-add.svg";
import MoreButton from "assets/rightbar/button-more.svg";

import CallButton from "./call-button/call-button";
import NotifyWhenAvailableButton from "./notify-button";
import MoreMenu from "../more-menu/more-menu";
import log from "src/renderer-logging";
import { createMeeting, updateMeeting } from "action-creators/ipc-outgoing/meetings-actions";
import { updateContactIsFavourite } from "action-creators/ipc-outgoing/contacts-actions";

import TopMenuButton from "../top-button/menu-button";
import { noSelectedContactUid } from "shared/constants";
import { IconVariant } from "components/ui/Icon/types";
import { StoreState } from "store/types";
import { Contact } from "src/types";
import { CountryCode } from "libphonenumber-js";
import { IconName } from "assets/icons/iconsLib";

export interface DefaultHeaderPanelProps {
  id?: string;
}
const DefaultHeaderPanel: React.FC<DefaultHeaderPanelProps> = ({ id }) => {
  const selectedContact = useSelector<StoreState, Contact>(
    (state) => state.contactReducer.selectedContact
  );
  const hasMeetings =
    useSelector<StoreState, number>((state) => state.meetingReducer.meetings.length) !== 0;
  const meetingEnabled = useSelector<StoreState, boolean>(
    (state) => state.settingsReducer.settings.meetings.enabled
  );
  const easRegion = useSelector<StoreState, CountryCode>(
    (state) => state.settingsReducer.settings.general.easRegion
  );
  const [startingMeeting, setStartingMeeting] = useState(false);

  const { t } = useTranslation();

  const startOrInviteMeeting = (inAMeeting = false): void => {
    log.userAction("Clicked on " + (inAMeeting ? "invite to" : "start") + " meeting for contact");

    setStartingMeeting(true);
    setTimeout(() => {
      setStartingMeeting(false);
    }, 5000);

    // Use the correct WISPA message to pass WISPA consistency check.
    if (selectedContact.im) {
      if (inAMeeting) {
        updateMeeting([{ value: selectedContact.im.value }], "");
      } else {
        createMeeting([{ value: selectedContact.im.value }], "");
      }
    }
  };

  /**
   * Render the enabled or disabled button depending on whether:
   * - the button has just been pressed
   * - the contact has an IM address
   */
  const meetingButton = (): JSX.Element | null => {
    if (!meetingEnabled) {
      return null;
    }

    const imAddress = selectedContact.im?.value;
    // Disable button if already attempting to start meeting or there is no IM address
    if (!imAddress) {
      return (
        <TopButton
          imageSrc={MeetingButton}
          altName={t("startMeeting")}
          parent="default"
          id="defaultMeetingButton"
          disabled={true}
        />
      );
    } else if (hasMeetings) {
      // Check if the user is already in a meeting
      return (
        <TopButton
          imageSrc={AddToMeetingButton}
          altName={t("inviteToMeeting")}
          parent="default"
          id="defaultMeetingButton"
          clickAction={(): void => startOrInviteMeeting(true)}
          disabled={startingMeeting}
        />
      );
    } else {
      return (
        <TopButton
          imageSrc={MeetingButton}
          altName={t("startMeeting")}
          parent="default"
          id="defaultMeetingButton"
          clickAction={(): void => startOrInviteMeeting()}
          disabled={startingMeeting}
        />
      );
    }
  };

  const toggleFavourite = (): void => {
    const toogleFavourite = !selectedContact.isFavourite;

    log.userAction(
      `Clicked header panel button to change ${toogleFavourite ? "true" : "false"} isFavourite`
    );

    updateContactIsFavourite(selectedContact.uid, toogleFavourite);
  };

  const renderFavouritesButton = (): JSX.Element | null => {
    if (selectedContact.uid === noSelectedContactUid || selectedContact.uid === "") return null;

    return (
      <IconButton
        ariaLabel={selectedContact.isFavourite ? t("removeFromFavourites") : t("addToFavourites")}
        id="addToFavouritesButton"
        iconVariant={selectedContact.isFavourite ? IconVariant.primary : IconVariant.outlined}
        icon={IconName.star}
        tooltipText={selectedContact.isFavourite ? t("removeFromFavourites") : t("addToFavourites")}
        onClickHandler={toggleFavourite}
      />
    );
  };

  /**
   * The text to be displayed representing the remote party's identity.
   *
   * Name if it exists, then phone number if it exists. Failing both, "No name"
   */
  const displayName = (): string => {
    if (selectedContact.uid === noSelectedContactUid) return t("selectAContact");

    const fullName = fullname(selectedContact);
    const firstPhoneNumber = selectedContact.phone[0];

    // TODO DUIR-3351: This logic shouldn't depend on a translated string
    if (fullName === t("noName") && firstPhoneNumber) {
      if (firstPhoneNumber.value == "" || firstPhoneNumber.value == "anonymous") {
        return t("anonymous");
      } else {
        const phoneNumberFormatted = formatPhoneNumber(firstPhoneNumber, easRegion);
        return phoneNumberFormatted;
      }
    } else {
      return fullName;
    }
  };

  log.debug("Rendering DefaultHeaderPanel");

  const disableMoreButton = selectedContact.uid === noSelectedContactUid;

  return (
    <Shared.ContentHeaderPanel id={id} panel="default">
      {/* Container for positioning purposes, contains contact info and avatar*/}
      <Shared.LeftSide id={"contentHeaderPanelContact"}>
        <Avatar contact={selectedContact} />
        <Shared.BasicInfo>
          <Shared.NameContainer>
            <h1>{displayName()}</h1>
            {renderFavouritesButton()}
            <NotifyWhenAvailableButton contact={selectedContact} />
          </Shared.NameContainer>
          <Shared.LowerDetail>{prettyPresenceWithStatus(selectedContact)}</Shared.LowerDetail>
        </Shared.BasicInfo>
      </Shared.LeftSide>

      {/* Button container */}
      <Shared.ButtonContainer>
        {meetingButton()}
        <CallButton phoneNumbers={selectedContact.phone} />
        <TopMenuButton
          disabled={disableMoreButton}
          imageSrc={MoreButton}
          altName={t("more")}
          parent="default"
          id="defaultMoreButton"
          menu={<MoreMenu contact={selectedContact} inCall={false} />}
        />
      </Shared.ButtonContainer>
    </Shared.ContentHeaderPanel>
  );
};

export default DefaultHeaderPanel;
