// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Helper components to form a menu.
 * These components should be used along with Tippyjs, to form a menu overlay.
 */

import React, { useState, useEffect, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import log from "src/renderer-logging";

import * as S from "components/menu/styles";
import ArrowKeyControl from "components/arrow-key-control/control";

import DisclosureIndicator from "assets/shared/disclosure-indicator.svg";

/**
 * Return the outer menu component.
 * Should be used for all Menus!
 *
 * @param {Elements} children - Pass through the child components
 * @param {object} keyboardNavTools - object containing functions to make keyboard navigation work.
 * @param {String} id - The id for the menu
 * @param {arrayOf(String)} idList - list of element ids to be used in ArrowKeyControl.
 * See ArrowKeyControl for more details.
 */
export const Menu = ({ children, keyboardNavTools, id, idList }) => {
  const closeMenu = () => {
    keyboardNavTools.setVisible(false);
    if (keyboardNavTools.buttonRef?.current) keyboardNavTools.buttonRef.current.focus();
  };

  const onKeyHandler = (e) => {
    if (e.key === "Escape" || e.key === "Tab") {
      log.userAction("Closed menu by pressing Tab or Escape key");
      closeMenu();
      e.preventDefault();
    }
  };

  const firstElement = document.getElementById(idList[0]);

  // Whether the focus has been automatically set to the first element when the menu becomes visible
  // We only want to do this once every time the menu becomes visible.
  const [initialFocusSet, setInitialFocusSet] = useState(false);

  useEffect(() => {
    if (keyboardNavTools.visible) {
      if (!firstElement) {
        // Menu is visible but first element is not yet rendered. Set initialFocusSet to null
        // so we trigger a re-render.
        setInitialFocusSet(null);
        return;
      }

      // If we haven't focus to the first element yet, do that and set initialFocusSet to true.
      if (!initialFocusSet) {
        log.debug("Move focus to first element in the menu");
        firstElement.focus();
        setInitialFocusSet(true);
      }
    } else {
      // Menu has been closed, reset the initialFocusSet for the next time the menu becomes visible.
      if (initialFocusSet) setInitialFocusSet(false);
    }
  }, [initialFocusSet, keyboardNavTools.visible, firstElement]);

  return (
    <S.Menu id={id} onKeyDown={(e) => onKeyHandler(e)}>
      {keyboardNavTools.visible ? (
        <ArrowKeyControl idList={idList}>{children}</ArrowKeyControl>
      ) : (
        children
      )}
    </S.Menu>
  );
};

Menu.propTypes = {
  id: PropTypes.string,
  children: PropTypes.any.isRequired,
  keyboardNavTools: PropTypes.exact({
    setVisible: PropTypes.func.isRequired,
    buttonRef: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired,
  }),
  idList: PropTypes.arrayOf(PropTypes.string).isRequired,
};

/**
 * Returns a section component to surround the menu buttons.
 * Should be used for all Menus!
 *
 * @param {boolean} props.borderBottom - Optional border at the bottom of a section to separate
 * menu sections
 * @param {Elements} props.children - Pass through the child components
 */
export const Section = (props) => {
  return <S.Section border={props.borderBottom}>{props.children}</S.Section>;
};

Section.propTypes = { children: PropTypes.any.isRequired, borderBottom: PropTypes.bool };

/**
 * Return a section title component.
 * Should be used at least once for all Menus!
 *
 * @param {String} text - Text for the title
 */
export const Title = ({ text }) => {
  return <S.Title>{text}</S.Title>;
};

Title.propTypes = { text: PropTypes.string.isRequired };

/**
 * Return a section title component meant for the user's
 * display name in avatar menu.
 *
 * @param {String} text - Text for the title
 */
export const DisplayName = ({ text }) => {
  return <S.DisplayName>{text}</S.DisplayName>;
};

DisplayName.propTypes = { text: PropTypes.string.isRequired };

/**
 * Return a section sub-title component meant for the user's
 * account number in avatar menu.
 *
 * @param {String} text - Text for the title
 */
export const AccountNumber = ({ text }) => {
  return <S.AccountNumber>{text}</S.AccountNumber>;
};

AccountNumber.propTypes = { text: PropTypes.string.isRequired };

/**
 * Return a menu button component.
 *
 * @param {String} imageSrc - The image to use in the button
 * @param {String} text - The text to use in the button
 * @param {String} detail - Optional text to use in the button. Grey formatting.
 * @param {func} clickAction - Optional function to be called on click
 * @param {String} id - The unique id to give the button
 * @param {String} color - Optional colour for the item text.
 */
export const Button = ({ clickAction, color, detail, disabled = false, imageSrc, text, id }) => {
  const buttonClickHandler = () => {
    // To avoid double logging we expect the clickAction to log the user action,
    // and log ourselves if the button is disabled explicitly, or because it has no action.
    if (clickAction && !disabled) {
      clickAction();
    } else {
      log.userAction(`Clicked disabled ${text} button`);
    }
  };

  return (
    <S.MenuItemButton onClick={() => buttonClickHandler()} id={id} disabled={disabled}>
      <img src={imageSrc} alt="" />
      <S.TextAndDetail>
        <S.Text color={color}>{text}</S.Text>
        <S.Detail>{detail}</S.Detail>
      </S.TextAndDetail>
    </S.MenuItemButton>
  );
};

Button.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  detail: PropTypes.string,
  clickAction: PropTypes.func,
  id: PropTypes.string.isRequired,
  color: PropTypes.string,
  disabled: PropTypes.bool,
};

/**
 * Return a button that is used like a menu button to Presence Submenu.
 * @param {func} clickAction - Optional function to be called on click
 * @param {String} color - Optional colour for the item text.
 * @param {String} detail - Optional text to use in the button. Grey formatting.
 * @param {String} disabled - Optional to show if button is disabled
 * @param {String} expanded - Param to set aria-expanded
 * @param {String} text - The text to use in the button
 * @param {String} id - The unique id to give the button
 *
 */

// Disabled because of this issue https://github.com/yannickcr/eslint-plugin-react/issues/2269
// eslint-disable-next-line react/display-name
export const PresenceButton = forwardRef(
  (
    {
      clickAction,
      color,
      detail,
      expanded,
      id,
      imageSrc,
      text,
      disabled = false,
      showDisclosureIndicator = true,
    },
    ref
  ) => {
    const { t } = useTranslation();
    const buttonHandler = () => {
      if (clickAction) {
        clickAction();
      }
    };

    return (
      <S.MenuItemButton
        onClick={buttonHandler}
        id={id}
        aria-label={t("setStatusCurrentStatus", { currentStatus: text })}
        aria-expanded={expanded}
        ref={ref}
        disabled={disabled}
      >
        <img src={imageSrc} alt="" />
        <S.TextAndDetail>
          <S.Text color={color}>{text}</S.Text>
          <S.Detail>{detail}</S.Detail>
        </S.TextAndDetail>
        {showDisclosureIndicator && <S.PresenceDisclosure src={DisclosureIndicator} alt="" />}
      </S.MenuItemButton>
    );
  }
);
// eslint-disable-next-line i18next/no-literal-string
PresenceButton.displayName = "PresenceButton";

PresenceButton.propTypes = {
  color: PropTypes.string,
  detail: PropTypes.string,
  expanded: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  imageSrc: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  clickAction: PropTypes.func,
  disabled: PropTypes.bool,
  showDisclosureIndicator: PropTypes.bool,
};

/**
 * Return a set of radio buttons for a menu.
 *
 * @param {String} activeImage - The image to use to represent which button is selected.
 * @param {arrayOf(String)} buttons - A list (text, id) arrays for each button.
 */
export const RadioButtons = ({ activeImage, buttons }) => {
  const [activeButton, setActiveButton] = useState(buttons[0]);

  return buttons.map((button) => {
    return (
      <S.MenuItemButton key={button} onClick={() => setActiveButton(button[0])} id={button[1]}>
        <S.Box activeButton={activeButton} thisButton={button}>
          <img src={activeImage} alt="" />
        </S.Box>
        <p>{button}</p>
      </S.MenuItemButton>
    );
  });
};

RadioButtons.propTypes = {
  activeImage: PropTypes.string.isRequired,
  buttons: PropTypes.arrayOf(PropTypes.array).isRequired,
};

/**
 * Return a menu slider component.
 *
 * @param {String} label - The accessibility label
 * @param {String} id - The unique id to give the button
 */
export const Slider = ({ label, id }) => {
  const [isActive, setActive] = useState(false);

  const onKeyHandler = (e) => {
    if (e.key === "Enter") {
      setActive(true);
      e.stopPropagation();
    }
    if (isActive) {
      if (e.key === "Escape") {
        setActive(false);
      }
      e.stopPropagation();
    }
  };

  return (
    <S.MenuItemSlider
      type="range"
      min="1"
      max="100"
      aria-label={label}
      onKeyDown={(e) => onKeyHandler(e)}
      id={id}
    />
  );
};

Slider.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
