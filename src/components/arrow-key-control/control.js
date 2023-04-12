// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns a wrapper element that enables navigation with arrow keys through it's children elements
 * that have passed in their id.
 */
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import log from "src/renderer-logging";

/**
 * Handle arrow key presses and focus changes to set the focus of the passed in children
 *
 * @param {List(String)} idList - A list of ids of the focusable elements
 * @param {Component} children - The children wrapped in this wrapper
 */
const ArrowKeyControl = ({ idList, children }) => {
  // Generate element list
  const elementList = [];
  idList.forEach((id) => elementList.push(document.getElementById(id)));

  // Generate ref for the parent control element, and initialise state
  const controlRef = useRef();
  const [activeElement, setActiveElement] = useState(elementList[0]);
  const [triggerRerender, setTriggerRerender] = useState(false);

  useEffect(() => {
    if (!activeElement || !elementList.includes(activeElement)) {
      // If activeElement is not accessible, pop the control into the tab order - on focus
      // of the control, the focus is automatically shifted to the first available focusable
      controlRef.current.setAttribute("tabIndex", "0");
    }
    if (triggerRerender) {
      // If we can't find the next element to focus, trigger a re-render to refresh the element
      // list
      setTriggerRerender(false);
      if (activeElement) {
        // We are on the only active element, focus the next element in the refreshed element list
        const nextElement = findNextNthElement(activeElement, true);
        if (nextElement) nextElement.focus();
        // If we couldn't find the next element worst case scenario is the user has to click a
        // second time
      } else {
        // There are no active elements, refocus the control component
        handleFocus({ target: controlRef.current });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeElement, elementList, triggerRerender]);

  /**
   * Determine and return the next nth element
   *
   * @param {HTMLElement} element
   * @param {Boolean} forward - true if moving forwards, false if backwards
   * @param {integer} n - number of elements to move forward
   */
  const findNextNthElement = (element, forward, n = 1) => {
    const index = elementList.indexOf(element);
    // Not in list, return first focusable in list instead
    if (index === -1) {
      log.error("Arrow key control: Unexpected element");
      return elementList[0];
    }

    if (forward) {
      // Check if we will reach the end of the list
      return index < elementList.length - n
        ? // Won't reach end of list, move forward n
          elementList[index + n]
        : // Will reach end of list, check if moving 1 step
        n === 1
        ? // Only moving 1 step, loop back to start
          elementList[0]
        : // Moving multiple steps, stop at end of list
          elementList[elementList.length - 1];
    } else {
      // Backwards
      // Check if we will reach the start of the list
      return index > n - 1
        ? // Won't reach start of list, move back n
          elementList[index - n]
        : // Will reach start of list, check if moving 1 step
        n === 1
        ? // Only moving 1 step, loop back to end
          elementList[elementList.length - 1]
        : // Moving multiple steps, stop at start of list
          elementList[0];
    }
  };

  /**
   * Handle key down events - if arrow keys change the focus and tabIndex to move the focus to
   * the next element
   *
   * @param {event} event
   */
  const handleKeyDown = (event) => {
    let nextElement = false;
    let forward;
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        // Find next element
        nextElement = findNextNthElement(event.target, true);
        forward = true;
        break;
      case "ArrowUp":
      case "ArrowLeft":
        // Find previous element
        nextElement = findNextNthElement(event.target, false);
        forward = false;
        break;
      case "Home":
        // Find first element in list
        nextElement = elementList[0];
        forward = true;
        break;
      case "End":
        // Find last element in list
        nextElement = elementList[elementList.length - 1];
        forward = false;
        break;
      case "PageUp":
        // Find 8th previous element
        nextElement = findNextNthElement(event.target, false, 8);
        forward = false;
        break;
      case "PageDown":
        // Find 8th next element
        nextElement = findNextNthElement(event.target, true, 8);
        forward = true;
        break;
      default:
        break;
    }
    if (nextElement !== false) {
      nextElement = findNextAccessibleElement(nextElement, forward);

      if (!nextElement) {
        // If we still can't find any accessible element, trigger a re-render.
        setTriggerRerender(true);
        event.preventDefault();
        return;
      }
      // Found the next focusable, focus it
      nextElement.focus();
      event.preventDefault();
    }
  };

  const findNextAccessibleElement = (currentElement, forward) => {
    let nextElement = currentElement;

    // Limit the number of retries to the lenght of elementList so we don't get stuck in an infinite
    // loop if all elements are inaccessible.
    let retry = 0;
    while (!nextElement && retry < elementList.length) {
      nextElement = findNextNthElement(nextElement, forward);
      retry += 1;
    }

    return nextElement;
  };

  /**
   * Handle focus being brought to a element through all methods e.g. setting focus
   * in handleKeyDown, mouse click, screen speech control
   *
   * @param {event} event
   */
  const handleFocus = (event) => {
    // On focussing the control element, immediately pass focus to the first button
    if (event.target === controlRef.current) {
      const nextElement = findNextAccessibleElement(elementList[0], true);
      // If we still can't access any child element, trigger a re-render (elements may not be
      // fully rendered yet)
      if (!nextElement) {
        setTriggerRerender(true);
        return;
      }
      nextElement.focus();
      nextElement.setAttribute("tabIndex", "0");
      controlRef.current.setAttribute("tabIndex", "-1");
      setActiveElement(nextElement);
    } else {
      // Change the tab index to match the new focus
      if (activeElement) activeElement.setAttribute("tabIndex", "-1");
      event.target.setAttribute("tabIndex", "0");
      setActiveElement(event.target);
    }
  };

  return (
    <>
      {/* The <div> element has a child <button> element that allows keyboard interaction */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div
        onKeyDown={(e) => {
          handleKeyDown(e);
        }}
        onFocus={(e) => {
          handleFocus(e);
        }}
        ref={controlRef}
        role="application"
      >
        {children}
      </div>
    </>
  );
};

ArrowKeyControl.propTypes = {
  children: PropTypes.any,
  idList: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ArrowKeyControl;
