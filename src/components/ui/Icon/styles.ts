// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import styled from "styled-components";

import { Colors } from "components/utils/style-constants";
import { IconVariant } from "components/ui/Icon/types";

interface SVGIconProps extends React.HTMLProps<SVGAElement> {
  variant?: IconVariant;
  color?: string;
}

const variants = {
  primary: `fill: ${Colors.icons.primary};`,
  dark: `fill: ${Colors.icons.dark};`,
  outlined: `fill: ${Colors.backgroundColor}; stroke: ${Colors.icons.primary};`,
  disabled: `fill: ${Colors.icons.disabled};`,
};

export const SVGIcon = styled.svg<SVGIconProps>`
  ${({ variant, color }): string | undefined => {
    if (color) {
      return undefined;
    }

    if (variant) {
      return variants[variant];
    }

    return variants.primary;
  }}
`;
