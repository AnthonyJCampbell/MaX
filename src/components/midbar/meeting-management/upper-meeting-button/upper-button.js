// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * White shadowed buttons used in the meetings tab
 */
import React from "react";
import PropTypes from "prop-types";

import * as S from "./styles";

/**
 * A large white button with a shadowed background. Displays an image with some text below it
 *
 * @param {String} image - String representing the image to be rendered slightly above the
 * middle of the button
 * @param {String} ariaLabel - String for the button's ARIA label
 * @param {String} text - Text to display on the button
 * @param {String} clickAction - Action for the button
 */
const UpperMeetingButton = ({ image, ariaLabel, text, clickAction }) => {
  return (
    <S.Button onClick={() => clickAction()} aria-label={ariaLabel}>
      <img src={image} alt="" width="50%" />
      <p aria-hidden={true}>{text}</p>
    </S.Button>
  );
};

UpperMeetingButton.propTypes = {
  image: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  clickAction: PropTypes.func.isRequired,
};

export default UpperMeetingButton;
