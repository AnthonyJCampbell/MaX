// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React, { useEffect, useRef } from "react";
import * as S from "./styles";

export enum MenuState {
  INITIAL,
  CLOSE,
  OPEN,
}

export interface MenuProps {
  id?: string;
  state: MenuState;
  itemToFocus?: number;
  onClose?: () => void;
  onDismiss?: () => void;
  ariaLabel?: string;
  title?: string;
  icon?: boolean;
  children: JSX.Element | JSX.Element[];
}

export const Menu: React.FC<MenuProps> = ({
  id,
  state,
  itemToFocus,
  onClose,
  onDismiss,
  ariaLabel,
  title,
  children,
}) => {
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    /**
     * Handle whole screen mouse click even.
     * Check if the clicked element, aka: `event.target` is a children of menu,
     * otherwise, trigger the onDismiss function.
     */
    const handlePageClick: EventListener = (event: Event): void => {
      const targetClick = event.target as HTMLDocument;

      const clickedOutsideMenu = menuRef.current !== null && !menuRef.current.contains(targetClick);

      if (clickedOutsideMenu) {
        onDismiss && onDismiss();
      }
    };

    /**
     * When the menu state changes from anything to OPEN,
     * attach the handlePageClick event to window document,
     * and set the focus for the first children element.
     */
    if (state === MenuState.OPEN) {
      window.addEventListener("click", handlePageClick);
      setFocusToFirstItem(itemToFocus);
    }

    /**
     * When the component is unmounted, removes the handlePageClick
     * event from window document.
     */
    return (): void => window.removeEventListener("click", handlePageClick);
  }, [state]);

  if (state !== MenuState.OPEN) {
    return null;
  }

  const getMenuElements = (): HTMLAnchorElement[] => {
    const menu = menuRef.current as HTMLElement;
    return Array.from(menu.getElementsByTagName("a"));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLUListElement>): void => {
    event.preventDefault();
    event.stopPropagation();

    switch (event.key) {
      case "Escape":
      case "Tab":
        onClose && onClose();
        break;
      case "Enter":
      case " ": //https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values Space key value
        {
          // eslint-disable-next-line i18next/no-literal-string
          const clickEvent = new MouseEvent("click", {
            view: window,
            bubbles: true,
            cancelable: true,
          });
          event.target?.dispatchEvent(clickEvent);
        }
        break;
      case "ArrowDown":
      case "ArrowRight":
        focusNextElement();
        break;
      case "ArrowUp":
      case "ArrowLeft":
        focusPrevElement();
        break;
      case "Home":
        setFocusToFirstItem();
        break;
      case "End":
        setFocusToLastItem();
        break;
      default:
        break;
    }
  };

  const setFocusToFirstItem = (itemToFocus = 0): void => {
    const elements = getMenuElements();
    // eslint-disable-next-line security/detect-object-injection
    if (elements[itemToFocus]) {
      // eslint-disable-next-line security/detect-object-injection
      elements[itemToFocus].focus();
    } else if (elements) elements[0].focus();
  };

  const setFocusToLastItem = (): void => {
    const elements = getMenuElements();
    if (elements) {
      elements[elements.length - 1].focus();
    }
  };

  const getElementFocusIndex = (elements: HTMLElement[]): number => {
    return elements.indexOf(document.activeElement as HTMLElement);
  };

  const focusNextElement = (): void => {
    const elements = getMenuElements();
    if (elements) {
      const focusIndex = getElementFocusIndex(elements);

      if (focusIndex < elements.length - 1) {
        elements[focusIndex + 1].focus();
      } else if (focusIndex === elements.length - 1) {
        elements[0].focus();
      }
    }
  };

  const focusPrevElement = (): void => {
    const elements = getMenuElements();
    if (elements) {
      const focusIndex = getElementFocusIndex(elements);

      if (focusIndex < 1) {
        elements[elements.length - 1].focus();
      } else {
        elements[focusIndex - 1].focus();
      }
    }
  };

  return (
    <S.Menu
      id={id}
      aria-label={ariaLabel}
      role="menu"
      ref={menuRef}
      onKeyDown={(event: React.KeyboardEvent<HTMLUListElement>): void => handleKeyDown(event)}
    >
      {title && <S.MenuTitle>{title}</S.MenuTitle>}
      {children}
    </S.Menu>
  );
};

export default Menu;
