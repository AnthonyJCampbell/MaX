// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Provides the MessageBox, the box a user can compose and send chat messages with
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import TextareaAutosize from "react-textarea-autosize";
import Tippy from "@tippyjs/react";
import _ from "lodash";

import * as S from "./styles";
import log from "src/renderer-logging";

import MessageMenuToggle from "./message-menu-toggle";
import InputAttach from "assets/rightbar/input-attach.svg";
import InputEmoji from "assets/rightbar/input-emoji.svg";
import { formatPhoneNumber } from "components/utils/phone-formatter";

import { createChatMessage } from "action-creators/ipc-outgoing/messaging-actions";
import { showUnimplemented } from "action-creators/navigation/actions";
import { saveDrafts } from "action-creators/navigation/actions";
import { sendTypingIndicator } from "action-creators/ipc-outgoing/contacts-actions";
import { Contact, Drafts } from "src/types";
import { StoreState } from "store/types";
import { CountryCode } from "libphonenumber-js";

import { getOperatingSystem } from "src/components/utils/common";
import Tooltip from "components/tooltip/tip";
import { selectMessageRemoteParty } from "store/selectors/paneManagement";

// Define this object outside the component definition to mirror the component's `messages` state.
// This is required when running saveDrafts() when the component unmounts. Ideally, saveDrafts()
// would takes the component's `messages` state as its argument, however that doesn't work, it will
// always have a blank `messages` object. Instead, it must takes `messagesBackup` as its argument.
//
// The reason for this isn't 100% clear at the moment. Our best understanding is that when
// `useEffect()` defines the cleanup function with a reference to `messages` that reference somehow
// doesn't get updated when the `setMessages()` function is called. This will be an artifact of the
// internals of `useEffect()` and `useState()`. HMW to investigate further sometime.
//
// For now, this solution works - it's just a bit ugly.
let messagesBackup = {};

/**
 * A component for sending chat messages. It contains:
 *   - A textarea to type a message
 *   - A hint that pops up when typing telling the user how to send their message
 *   - Currently unused "emoji" and "add" buttons
 */

const { app } = window.require("@electron/remote");

const MessageBox: React.FC = () => {
  const dispatch = useDispatch();
  const [isTyping, setIsTyping] = useState(false);
  const selectedContact = useSelector<StoreState, Contact>(
    (state) => state.contactReducer.selectedContact
  );
  const drafts = useSelector<StoreState, Drafts>((state) => state.messagingReducer.drafts);
  const focusMessage = useSelector<StoreState, number>(
    (state) => state.paneManagementReducer.focusMessage
  );
  const messageRemoteParty = useSelector(selectMessageRemoteParty);
  const easRegion = useSelector<StoreState, CountryCode>(
    (state) => state.settingsReducer.settings.general.easRegion
  );
  const [messages, setMessages] = useState({});
  const input = useRef<HTMLTextAreaElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    log.debug("Loading draft messages:");
    log.debug(drafts.toString());
    setMessages(drafts);

    return (): void => {
      log.debug("Saving draft messages:");
      log.debug(messagesBackup.toString());
      dispatch(saveDrafts(messagesBackup));
    };
  }, [drafts, dispatch]);

  useEffect(() => {
    // Contact clicked, bring the focus to the new input box,
    // so the user can immediately start typing.
    if (input && input.current && focusMessage !== 0) {
      input.current.focus();
    }
  }, [focusMessage, dispatch]);

  const activeMessage = messages[selectedContact.uid] || "";

  const clearTyping = (): void => {
    setIsTyping(false);
    sendTypingIndicator(selectedContact.uid, false);
  };

  const clearTypingAfter5sec = useCallback(_.debounce(clearTyping, 5000), []);

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    updateActiveMessage(event.target.value);

    if (event.target.value.length === 0) {
      clearTyping();
    } else {
      handleTyping();
    }
  };

  const handleTyping = (): void => {
    if (!isTyping) {
      setIsTyping(true);
      sendTypingIndicator(selectedContact.uid, true);
    }
    clearTypingAfter5sec();
  };

  const onNavigatingAway = (): void => {
    // Only send when typing is true
    if (isTyping) {
      clearTyping();
    }
  };

  // Determine if keypress of Enter key needs to result in a newline or the message submission
  const submitIfEnter = (keyPressEvent: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (keyPressEvent.key === "Enter") {
      // The ctrl and alt modifiers stop Chromium from adding a newline when Enter is pressed but
      // shift doesn't.
      // The meta key is another kind of modifier that is very rarely used by modern systems
      if (keyPressEvent.ctrlKey || keyPressEvent.altKey || keyPressEvent.metaKey) {
        updateActiveMessage(activeMessage + "\n");
      } else if (keyPressEvent.shiftKey) {
        return;
      } else {
        // Prevent default to avoid a newline being added to the message box
        keyPressEvent.preventDefault();
        submitMessage();
        clearTyping();
      }
    }
  };

  const cleanUpMessage = (input: string): string | null => {
    // Return null if no actual text is passed in
    return input.length > 0 ? input : null;
  };

  const submitMessage = (): void => {
    // Strip message of any trailing or leading whitespace
    const message = cleanUpMessage(activeMessage);

    if (message === null) return;

    log.userAction(`User submitted new message "${message}"`);
    createChatMessage(message, selectedContact, messageRemoteParty);
    updateActiveMessage("");
  };

  const updateActiveMessage = (text: string): void => {
    const updatedMessages = { ...messages, [selectedContact.uid]: text };
    messagesBackup = { ...updatedMessages };

    setMessages(updatedMessages);
  };

  // Set modifier key based on user's OS
  // eslint-disable-next-line i18next/no-literal-string
  const platformMainModifierKey = getOperatingSystem() === "macOS" ? "Cmd" : "Ctrl";
  const enterToSendHint = (
    <span>
      <pre>{t("pressEnterToSendMessage", { platformMainModifierKey })}</pre>
    </span>
  );

  const showEmojiPanel = (): void => {
    if (!app.isEmojiPanelSupported()) return;

    input.current?.focus();
    app.showEmojiPanel();
  };

  const placeholderText = (): string => {
    if (messageRemoteParty === "IM" && selectedContact.im?.value) {
      return t("sendAMessage");
    } else if (selectedContact.phone.some((phone) => phone.value === messageRemoteParty)) {
      const phoneNumber = formatPhoneNumber(messageRemoteParty, easRegion);
      return t("sendAnSMS", { phoneNumber });
    } else {
      log.error(
        `Invalid message remote party: ${messageRemoteParty} doesn't match selected contact: ${selectedContact}`
      );
      return t("sendAMessage");
    }
  };

  return (
    <S.InputContainer id="messageBox">
      <MessageMenuToggle focusRefOnClose={input} />
      <S.InputTextbox>
        <TextareaAutosize
          ref={input}
          maxRows={4}
          placeholder={placeholderText()}
          value={activeMessage || ""}
          onChange={handleTextareaChange}
          onKeyDown={submitIfEnter}
          onBlur={onNavigatingAway}
          aria-label={placeholderText()}
        />
        <S.Hint>{activeMessage ? enterToSendHint : ""}</S.Hint>
      </S.InputTextbox>
      <S.ButtonContainer>
        <Tippy content={<Tooltip text={t("addEmoji")} />} delay={[600, 0]} placement="bottom">
          <button aria-label={t("addEmoji")} onClick={showEmojiPanel} id="addEmojiButton">
            <img src={InputEmoji} alt="" />
          </button>
        </Tippy>
        <button
          aria-label={t("attach")}
          onClick={(): void => {
            dispatch(showUnimplemented("Attach file button"));
          }}
        >
          <img src={InputAttach} alt="" />
        </button>
      </S.ButtonContainer>
    </S.InputContainer>
  );
};

export default MessageBox;
