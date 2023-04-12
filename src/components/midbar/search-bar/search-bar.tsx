// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import SearchOrDialIcon from "assets/midbar/search-icon.svg";
import SearchOnlyIcon from "assets/midbar/search-only-icon.svg";
import DismissButton from "assets/shared/button-dismiss.svg";

import * as S from "./styles";
import { Colors as C } from "components/utils/style-constants";
import {
  setActiveMidPane,
  setSearchTerm,
  setSelectedContact,
  focusRightbarMessage,
} from "action-creators/navigation/actions";
import { createActiveCall } from "action-creators/ipc-outgoing/active-calls-actions";
import { sendAnalytic } from "store/action-creators/ipc-outgoing/analytics-actions";
import { selectCanCall } from "store/selectors/paneManagement";
import Button from "components/ui/Button/Button";
import { IconVariant } from "components/ui/Icon/types";
import { IconName } from "assets/icons/iconsLib";
import { selectOneContactWithPhoneNumber } from "store/selectors/contacts";
import { removeNumberFormatting } from "components/utils/common";

import log from "src/renderer-logging";

import { StoreState } from "store/types";
import { Contact } from "src/types";

const SearchBar: React.FC = () => {
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const searchTerm = useSelector<StoreState, string>(
    (state) => state.paneManagementReducer.searchTerm
  );
  const contact = useSelector(selectOneContactWithPhoneNumber(removeNumberFormatting(searchTerm)));
  const canCall = useSelector<StoreState, boolean>(selectCanCall);

  const focusSearch = useSelector<StoreState, number>(
    (state) => state.paneManagementReducer.focusSearch
  );
  const searchResultsCount = useSelector<StoreState, number>(
    (state) => state.paneManagementReducer.searchResultsCount
  );
  const isMidPaneDialPadVisible = useSelector<StoreState, boolean>(
    (state) => state.paneManagementReducer.isMidPaneDialPadVisible
  );

  useEffect(() => {
    if (inputRef && inputRef.current && focusSearch !== 0) {
      inputRef.current.focus();
    }
  }, [focusSearch, dispatch]);

  useEffect(() => {
    if (inputRef && inputRef.current && isMidPaneDialPadVisible) {
      inputRef.current.focus();
    }
  }, [searchTerm, isMidPaneDialPadVisible]);

  const isExpanded = canCall && !isMidPaneDialPadVisible;

  const updateSearchTerm = (event: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch(setSearchTerm(event.target.value));
    dispatch(setActiveMidPane("contacts"));
  };

  const makeCall = (): void => {
    log.userAction(`User initiated call from search bar with search term "${searchTerm}"`);
    createActiveCall(searchTerm);
    dispatch(setSearchTerm(""));
  };

  const sendSMS = (): void => {
    log.userAction(`User initiated SMS from search bar with search term "${searchTerm}"`);
    const numberToDial = removeNumberFormatting(searchTerm);
    dispatch(
      setSelectedContact(contact ? contact : Contact.fromPhoneNumber(numberToDial), numberToDial)
    );
    dispatch(focusRightbarMessage());
    dispatch(setSearchTerm(""));
    sendAnalytic("USER_CHAT_FROM_SEARCHBAR");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    switch (event.key) {
      case "Enter": {
        if (event.ctrlKey) {
          log.userAction(`User pressed CTRL+ENTER when the search term is "${searchTerm}"`);
          if (canCall) {
            sendSMS();
          } else {
            log.debug(`"${searchTerm}" is not a valid number, so do nothing`);
          }
        } else {
          log.userAction(`User pressed ENTER when the search term is "${searchTerm}"`);
          if (canCall) {
            makeCall();
          } else {
            log.debug(`"${searchTerm}" is not a valid number, so do nothing`);
          }
        }
        break;
      }
      case "Escape": {
        dispatch(setSearchTerm(""));
        break;
      }
    }
  };

  let screenReaderLabel = "";
  if (canCall) {
    screenReaderLabel = t("resultCountOrEnterToCall_interval", {
      postProcess: "interval",
      count: searchResultsCount,
    });
  } else {
    screenReaderLabel = t("resultCount_interval", {
      postProcess: "interval",
      count: searchResultsCount,
    });
  }

  return (
    <S.SearchBarContainer id="searchBar" expanded={isExpanded}>
      <S.InputContainer>
        <S.InputContainerRow>
          <img src={searchTerm ? SearchOnlyIcon : SearchOrDialIcon} alt="" />
          <S.Input
            id="searchBarInput"
            value={searchTerm}
            placeholder={t("searchOrDialNumber")}
            aria-label={screenReaderLabel}
            // The following makes sure the label is read out everytime this component changes
            aria-live="polite"
            onChange={updateSearchTerm}
            onKeyDown={handleKeyDown}
            ref={inputRef}
          />
          {searchTerm && (
            <S.CloseButton
              onClick={(): void => {
                dispatch(setSearchTerm(""));
              }}
            >
              <img alt="Close Search Button" src={DismissButton} />
            </S.CloseButton>
          )}
        </S.InputContainerRow>
        {isExpanded && (
          <S.InputContainerRow id={"searchBarButtons"}>
            <Button
              icon={IconName.phone}
              iconVariant={IconVariant.primary}
              className="CallButton"
              text={t("call")}
              ariaLabel={t("call")}
              bgVariant={C.hoverColor}
              onClick={makeCall}
            />
            <Button
              icon={IconName.sms}
              iconVariant={IconVariant.primary}
              className="SMSButton"
              text={t("sms")}
              ariaLabel={t("sms")}
              bgVariant={C.hoverColor}
              onClick={sendSMS}
              iconSize={16}
            />
          </S.InputContainerRow>
        )}
      </S.InputContainer>
    </S.SearchBarContainer>
  );
};

export default SearchBar;
