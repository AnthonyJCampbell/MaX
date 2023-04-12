// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import PropTypes from "prop-types";

import * as S from "./styles";

/**
 * Makes its contents draggable
 *
 * Uses `-webkit-app-region: drag;` to allow the Electron window to be dragged from one place to the next
 * when primary mouse button is held down. This will swallow any clicks on
 * Windows OS. This means that no region can be both draggable and clickable. As a result, we've added
 * `-webkit-app-region: no-drag;` to the button's styling.
 *
 * As a result of this, the double-click-to-dock functionality had to be removed.
 */
const Draggable = ({ children, enabled = true }) => {
  return <S.Wrapper enabled={enabled}>{children}</S.Wrapper>;
};

Draggable.propTypes = {
  children: PropTypes.object,
  enabled: PropTypes.bool,
};

export default Draggable;
