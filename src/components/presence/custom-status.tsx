// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Custom presence.
 */

import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import CustomStatusIcon from "assets/shared/menu-status.svg";
import { CustomStatusState } from "components/utils/common";
// Menu code has not been converted to Typescript, yet.
// eslint-disable-next-line
// @ts-ignore
import { Button } from "components/menu/menu";
import * as S from "components/presence/styles";

import { StoreState } from "store/types";

interface CustomStatusEvents {
  onSave: (customStatus: string) => void;
  onCancel: (callback?: Function) => void;
  onClose: () => void;
  onEdit: () => void;
  onClean: (callback?: Function) => void;
  onClick: () => void;
}

export const MAX_CUSTOM_STATUS_LENGTH = 100;

interface Props {
  id: string;
  events: CustomStatusEvents;
}

/**
 * Avatar menu component which deals with setting, updating and viewing the user's custom status
 *
 * @param props The component's id and events passed to it
 * @returns Custom Status component
 */
const CustomStatus: React.FC<Props> = (props) => {
  const { t } = useTranslation();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const saveButtonRef = useRef<HTMLButtonElement>(null);

  const presenceCustomStatus = useSelector<StoreState, string>(
    (state: StoreState) => state.userReducer.user.presence.customStatus
  );

  const customStatusState = useSelector<StoreState, number>(
    (state: StoreState) => state.paneManagementReducer.customStatusState
  );

  const initialStatus = presenceCustomStatus || "";
  const [unsavedCustomStatus, setUnsavedCustomStatus] = useState(initialStatus);

  useEffect(() => {
    if (customStatusState === CustomStatusState.EDITING && textareaRef?.current) {
      textareaRef.current.focus();
      // On focusing the custom status field, set the cursor to the end of the string.
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  }, [customStatusState]);

  const characterCount = MAX_CUSTOM_STATUS_LENGTH - unsavedCustomStatus.length;
  const isUserTyping = characterCount >= 0;

  const isInitial =
    customStatusState === CustomStatusState.INITIAL ||
    customStatusState === CustomStatusState.CLOSE;

  const resetTextArea = (): void => {
    setUnsavedCustomStatus(initialStatus);
  };

  const cleanUpTextArea = (): void => {
    setUnsavedCustomStatus("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    event.stopPropagation();
    if (event.key === "Escape") {
      if (customStatusState === CustomStatusState.EDITING) {
        props.events.onCancel(resetTextArea);
      } else {
        props.events.onClose();
      }
    }

    const isEditModeAndTextAreaIsFocused =
      customStatusState === CustomStatusState.EDITING && textareaRef?.current;

    if (event.key === "Enter" && isEditModeAndTextAreaIsFocused) {
      event.preventDefault();
      props.events.onSave(unsavedCustomStatus);
    }

    /**
     * Tab focus trap.
     * Ugly, but at least it works ¯\_(ツ)_/¯
     */
    if (!event.shiftKey && event.key === "Tab") {
      switch (event.target) {
        case textareaRef.current: {
          event.preventDefault();
          saveButtonRef?.current?.focus();
          break;
        }
        case saveButtonRef.current: {
          event.preventDefault();
          cancelButtonRef?.current?.focus();
          break;
        }
        case cancelButtonRef.current:
        default:
          event.preventDefault();
          textareaRef?.current?.focus();
          break;
      }
    } else if (event.shiftKey && event.key === "Tab") {
      switch (event.target) {
        case cancelButtonRef.current: {
          event.preventDefault();
          saveButtonRef?.current?.focus();
          break;
        }
        case saveButtonRef.current: {
          event.preventDefault();
          textareaRef?.current?.focus();
          break;
        }
        case textareaRef.current:
        default:
          event.preventDefault();
          cancelButtonRef?.current?.focus();
          break;
      }
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setUnsavedCustomStatus(event.target.value);
  };

  const customStatusText = (): React.ReactElement | null => {
    if (customStatusState === CustomStatusState.EDITING) {
      return (
        <S.TextArea
          name="customStatus"
          id="customStatus"
          ref={textareaRef}
          aria-live="polite"
          aria-label={
            unsavedCustomStatus
              ? t("customStatusText", {
                  customStatusText: unsavedCustomStatus,
                  remainingCharacters: characterCount,
                })
              : t("customStatusTextDefault")
          }
          onChange={onChange}
          value={unsavedCustomStatus}
        ></S.TextArea>
      );
    }

    if (presenceCustomStatus && isInitial) {
      return <S.CustomStatusParagraph tabIndex={0}>{presenceCustomStatus}</S.CustomStatusParagraph>;
    }

    return null;
  };

  const editingButtons = (): React.ReactElement | null => {
    if (customStatusState === CustomStatusState.EDITING) {
      return (
        <>
          <S.ActionButton
            id="customStatusButtonSave"
            disabled={!isUserTyping}
            onClick={(): void => props.events.onSave(unsavedCustomStatus)}
            ref={saveButtonRef}
          >
            {t("save")}
          </S.ActionButton>
          <S.ActionButton
            id="customStatusButtonCancel"
            onClick={(): void => props.events.onCancel(resetTextArea)}
            ref={cancelButtonRef}
          >
            {t("cancel")}
          </S.ActionButton>
        </>
      );
    }

    return null;
  };

  const initialButtons = (): React.ReactElement | null => {
    if (isInitial) {
      return (
        <>
          <S.ActionButton id="customStatusButtonEdit" onClick={props.events.onEdit}>
            {t("edit")}
          </S.ActionButton>
          <S.ActionButton
            id="customStatusButtonClear"
            onClick={(): void => {
              props.events.onClean(cleanUpTextArea);
            }}
            ref={cancelButtonRef}
          >
            {t("clear")}
          </S.ActionButton>
        </>
      );
    }

    return null;
  };

  const hasCustomState =
    (presenceCustomStatus && isInitial) || customStatusState === CustomStatusState.EDITING;

  const showMenuButton = !presenceCustomStatus && isInitial;
  if (showMenuButton) {
    return (
      // Button is written in javascript which causes typing errors when this
      // file is imported from some files but not others, so cannot use
      // ts-expect-error here!
      // eslint-disable-next-line
      // @ts-ignore
      <Button
        text={t("setCustomStatus")}
        id={props.id}
        clickAction={props.events.onClick}
        imageSrc={CustomStatusIcon}
      />
    );
  }
  return (
    <S.CustomStatusContainer
      id={props.id}
      onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>): void => handleKeyDown(event)}
    >
      <S.TextAreaImage src={CustomStatusIcon} alt="" />
      {customStatusText()}
      {hasCustomState && (
        <S.Wrapper>
          {editingButtons()}
          {initialButtons()}
          {customStatusState === CustomStatusState.EDITING && (
            <S.CharacterCount isEnabled={isUserTyping}>{characterCount}</S.CharacterCount>
          )}
        </S.Wrapper>
      )}
    </S.CustomStatusContainer>
  );
};

export default CustomStatus;
