// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";

import Tooltip from "components/tooltip/tip";
import { showUnimplemented } from "action-creators/navigation/actions";

import Tippy from "@tippyjs/react";

import * as S from "./styles";

import log from "src/renderer-logging";
import { KeyboardNavTools } from "src/types";

export interface MenuWithKeyboardNavToolsProps {
  keyboardNavTools: KeyboardNavTools;
}

export interface TopMenuButtonProps {
  /**
   * id for the element
   */
  id?: string;

  /**
   * Image for the button
   */
  imageSrc: string;

  /**
   * Name of the button
   */
  altName: string;

  /**
   * The parent content-header-panel. Determines button formatting.
   */
  parent: string;

  /**
   * JSX element containing the menu to be shown on click.
   */
  menu: React.ReactElement;

  /**
   * Whether the button should appear inactive, i.e. faded out and not
   * react to hover.
   */
  disabled?: boolean;

  /**
   * Optional label for screen readers for the button. If not set, defaults to
   * altName.
   */
  label?: string;

  /**
   * If true, display the unimplemented popup on click instead of a menu
   */
  unimplemented?: boolean;
}

/**
 * Return the TopMenuButton component, with tooltip and menu behaviour
 */
const TopMenuButton: React.FC<TopMenuButtonProps> = ({
  id,
  imageSrc,
  altName,
  parent,
  menu,
  disabled = false,
  label,
  unimplemented,
}) => {
  const [visible, setVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dispatch = useDispatch();

  const buttonClickHandler = (): void => {
    log.userAction(`Clicked ${altName} button`);
    if (unimplemented) {
      dispatch(showUnimplemented("Audio menu"));
    } else {
      setVisible(!visible);
      log.debug(`Toggling ${altName} menu`);
    }
  };

  // We need to pass down some functions and variables to the menu so keyboard navigation works
  // correctly. See menu.js for details about these are used.
  const menuWithKeyboardNavTools = React.cloneElement<MenuWithKeyboardNavToolsProps>(menu, {
    keyboardNavTools: { visible, setVisible, buttonRef },
  });

  return (
    <S.ButtonWrapper>
      {/* Show a tooltip, with a delay of 800ms before showing, and 0ms after mouse out */}
      <Tippy
        content={<Tooltip text={altName} aria-label={altName} />}
        delay={[600, 0]}
        placement="bottom"
        zIndex={2}
      >
        <Tippy
          content={menuWithKeyboardNavTools}
          interactive={true}
          visible={visible}
          onClickOutside={(): void => setVisible(false)}
        >
          <S.StyleTopButton
            id={id}
            onClick={(): void => buttonClickHandler()}
            parent={parent}
            altName={altName}
            disabled={disabled}
            aria-label={label ? label : altName}
            ref={buttonRef}
          >
            <img src={imageSrc} alt="" width={"28px"} height={"28px"} />
          </S.StyleTopButton>
        </Tippy>
      </Tippy>
    </S.ButtonWrapper>
  );
};

export default TopMenuButton;
