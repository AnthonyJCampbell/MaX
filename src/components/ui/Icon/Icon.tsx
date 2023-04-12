// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/* eslint-disable i18next/no-literal-string */
import React from "react";
import { CSSProperties } from "styled-components";

import getIcon, { IconInterface, IconName } from "assets/icons/iconsLib";

import { IconVariant } from "components/ui/Icon/types";
import { SVGIcon } from "./styles";

/**
 * When rendering an array of elements, React requires unique keys,
 * so that it can find out what item was updated on re-renders,
 * avoiding the need to "remove" and "add" them all always.
 *
 * Further explanation: https://reactjs.org/docs/lists-and-keys.html#keys
 *
 * @param icon Icon name
 * @param index Path index
 * @returns a unique key name
 */
const getPathKey = (icon: IconName, index: number): string => `icon_${icon}_path_${index}`;

/**
 * Renders a list of `<path />` tag into SVG, based on `IconInterface.paths`.
 *
 * Path tag documentation: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/path
 *
 * @param icon Icon name
 * @param paths IconInterface.paths
 * @returns A list of `<path />` tag.
 */
const renderPaths = (
  icon: IconName,
  paths: React.SVGProps<SVGPathElement>[]
): React.SVGProps<SVGPathElement>[] =>
  paths.map((path, index) => <path key={getPathKey(icon, index)} {...path} />);

export interface IconProps {
  ariaLabel?: string;
  icon: IconName;
  size: number;
  style?: CSSProperties;
  variant?: IconVariant;
  color?: string;
  hasFill?: boolean;
  hasStroke?: boolean;
  strokeOpacity?: number;
}

const Icon: React.FC<IconProps> = ({
  ariaLabel,
  icon,
  size,
  style,
  variant,
  color,
  hasFill,
  hasStroke,
  strokeOpacity,
}) => {
  const _icon: IconInterface = getIcon(icon);

  return (
    <SVGIcon
      aria-label={ariaLabel}
      variant={variant}
      fill={color && hasFill ? color : undefined}
      stroke={color && hasStroke ? color : undefined}
      strokeOpacity={strokeOpacity || 1.0}
      color={color}
      style={style}
      width={`${size}px`}
      height={`${size}px`}
      viewBox={_icon.viewBox}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      {renderPaths(icon, _icon.paths)}
    </SVGIcon>
  );
};

export default Icon;
