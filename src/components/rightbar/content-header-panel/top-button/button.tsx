// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the TopButton for use in content header panels.
 */

import React, { useRef, useEffect } from "react";
import Tooltip from "components/tooltip/tip";
import Tippy from "@tippyjs/react";

import * as S from "./styles";

import log from "src/renderer-logging";

export interface TopButtonProps {
  id?: string;

  /**
   * Image for the button
   */
  imageSrc: string;

  /**
   * Name of the button, used in accessibility label and tooltip
   */
  altName: string;

  /**
   * Text for the tooltip, if different from altName
   */
  tooltipText?: string;

  /**
   * The parent content-header-panel. Determines button formatting.
   */
  parent: string;

  /**
   * Optional function to be called on click.
   */
  clickAction?: () => void;

  /**
   * Whether the button should appear inactive, i.e. faded out and not
   * react to hover. Defaults to false.
   */
  disabled?: boolean;

  /**
   * Whether keyboard focus should move to the button when the
   * button is rendered. Defaults to false.
   */
  focusOnRender?: boolean;
}

/**
 * Return the TopButton component, with tooltip.
 */
const TopButton: React.FC<TopButtonProps> = ({
  id,
  imageSrc,
  altName,
  tooltipText,
  parent,
  clickAction,
  disabled = false,
  focusOnRender = false,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const buttonClickHandler = (): void => {
    log.userAction(`Clicked ${altName} button`);
    if (!disabled && clickAction) {
      clickAction();
    }
  };

  useEffect(() => {
    if (focusOnRender) {
      buttonRef?.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <S.ButtonWrapper>
      {/* Show a tooltip, with a delay of 800ms before showing, and 0ms after mouse out */}
      <Tippy
        content={<Tooltip text={tooltipText ? tooltipText : altName} />}
        delay={[600, 0]}
        placement="bottom"
      >
        <S.StyleTopButton
          id={id}
          onClick={(): void => buttonClickHandler()}
          parent={parent}
          altName={altName}
          disabled={disabled}
          ref={buttonRef}
          onDoubleClick={(e: React.MouseEvent<HTMLButtonElement>): void => e.stopPropagation()}
        >
          <img src={imageSrc} alt={altName} aria-live="polite" />
        </S.StyleTopButton>
      </Tippy>
    </S.ButtonWrapper>
  );
};

export default TopButton;
