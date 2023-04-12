// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Long blue button used in the meetings tab
 */
import React from "react";
import PropTypes from "prop-types";

import * as S from "./styles";

/**
 * A long/wide blue button
 *
 * @param {String} text - Text to display on the button
 */
const LowerMeetingButton = ({ text, clickAction }) => {
  return <S.Button onClick={() => clickAction()}>{text}</S.Button>;
};

LowerMeetingButton.propTypes = {
  text: PropTypes.string.isRequired,
  clickAction: PropTypes.func.isRequired,
};

export default LowerMeetingButton;
