// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Used to format the tooltips used throughout the codebase
 */

import React from "react";

import * as S from "./styles";

interface TooltipProps {
  text: string;
}

/**
 * Formatting for the tooltips, should be called like this:
 *
 * <Tippy content={<Tooltip text={INSERT_TEXT_HERE} />} delay={[600, 0]}>
 *
 * INSERT JSX FOR ELEMENT WHICH WILL SHOW THE TOOLTIP
 *
 * @param {String} text - Text to display in the tooltip
 */
const Tooltip: React.FC<TooltipProps> = ({ text }) => {
  // aria-hidden is set to true as the tooltip duplicates what the accessibility tech (e.g. screen
  // readers) already gets from the button name.
  return <S.Float aria-hidden="true">{text}</S.Float>;
};

export default Tooltip;
