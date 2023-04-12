// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Helper file, containing commonly used CSS values.
 */
/* eslint-disable i18next/no-literal-string */

/**
 * The primary colour used throughout the app. Blue by default
 */
export const primaryColour = "#2F78CA";

/**
 * All non-zero z-indexes
 */
export const zIndexes = {
  avatarBackground: 1,
  avatarPresenceIcon: 2,
  contentHeaderPanel: 3,
  unimplementedPopup: 4,
};

export const Colors = {
  paneDividerColor: "#f2f2f2",
  textColor: "#000000",
  backgroundColor: "#ffffff",
  transparentBorder: "2px solid transparent",

  focusColor: `${primaryColour}4d`,
  hoverColor: `${primaryColour}1a`,
  activeColor: `${primaryColour}80`,
  hoverBorder: `2px solid ${primaryColour}4d`,
  focusBorder: `2px solid ${primaryColour}`,
  focusShadow: `inset 0 0 0 2px white`,

  whiteHoverColor: "#ffffff1a",
  whiteHoverBorder: `2px solid #ffffff4d`,
  whiteActiveColor: "#ffffff80",
  whiteFocusBorder: "2px solid white",
  whiteFocusShadow: `inset 0 0 0 2px ${primaryColour}`,

  // Small text colours.
  smallColor: "#636363",
  warningColor: "#ee0000",

  notificationDot: "#cd0200",

  icons: {
    primary: primaryColour,
    dark: "rgba(0, 0, 0, 0.54)",
    disabled: "rgba(0, 0, 0, 0.3)",
  },

  sidebar: {
    background: primaryColour,
    accentColor: "#ffffff",
  },

  banner: {
    background: "#dadada",
    hoverColor: `#eeeeee`,
    activeBorder: `2px solid #ffffff`,
    transparentBorder: "2px solid transparent",
  },

  midbar: {
    inputContainerBackground: "#ffffff",
    dialerBackground: "#c1c1c1",
    background: "#efefef",

    // Block
    blockNameColor: "#323232",
    blockFocusShadow: "inset 0 0 0 2px #efefef",

    // Avatar
    defaultAvatarBackground: primaryColour,
    defaultAvatarForeground: "#ffffff",

    // Contact-List
    contactGroupTitleColor: "#686868",

    // Meeting-Management
    upperButtonColor: "#000000de",
    upperButtonBoxShadow: "0px 0px 10px #d0d0d0",
    lowerButtonColor: "#FFFFFF",
    lowerButtonBackground: primaryColour,
  },

  rightbar: {
    ContentHeaderPanelFontColor: "#4c4c4c",
    InCallHeaderPanelFontColor: "#ffffff",
    InCallHeaderPanelBackgroundColor: primaryColour,

    detailsFontColor: "#757575",
    detailsLinkColor: primaryColour,
    detailsTextColor: "#4c4c4c",

    sentMessageColor: `${primaryColour}21`,
    receivedMessageColor: "#f5f5f5",
    separatorColor: "#ffffffed",
  },

  menu: {
    inputBoxBackground: "#f7f7f7",
  },

  button: {
    fontColor: "#000000",
    disabledFontColor: "#00000030",
  },
};

export const Effects = {
  transition: "0.2s",

  focusOpacity: "0.8",
  focusTransform: "",

  hoverOpacity: "0.6",
  hoverTransform: "translateY(-5px)",

  activeOpacity: "0.4",
  activeTransform: "translateY(0px)",
};

export const Sizes = {
  mainWindow: {
    minWidth: "830px",
    minHeight: "511px",
  },

  inCallWindow: {
    width: "460px",
    height: "80px",
  },

  avatar: {
    contactInitialsFontSize: "16px",
    accountInitialsFontSize: "18px",
  },

  banner: {
    dNDBannerFontSize: "12px",
    defaultFontSize: "12px",
  },

  sidebar: {
    width: "65px",
  },

  midbar: {
    minWidth: "265px",
    maxWidth: "400px",
    largeFontSize: "14px",
    smallFontSize: "12px",
    blockTimeFontSize: "11px",
    dialpadButtonSize: "37px",
    searchBarContainerPadding: "10px",
    searchBarHeight: "37px",
    searchBarExpandedHeight: "82px",
    dialPadMargin: "0 8px 0 10px",

    contactBlockStarIconSize: 12,
    contactBlockNotifyIconSize: 13,
  },

  rightbar: {
    minWidth: "500px",

    ContentHeaderPanelFontSize: "15px",
    ContentHeaderPanelHeight: "80px",
    ContentHeaderPanelPresenceFontSize: "11px",
    ContentHeaderPanelPresenceLineHeight: "1.2",
    ContentHeaderPanelButtonFontSize: "13px",

    sectionTitleFontSize: "11px",

    contentsFontSize: "14px",
    smallContentFontSize: "12px",

    lineHeight: "1.4",

    chatPaneContentMinWidth: "480px",
    chatPaneContentMaxWidth: "800px",

    chatTypeButtonSize: "26px",
  },

  button: {
    defaultIconSize: 13,
  },
};

export const GridAreas = {
  mainWindow: {
    sidebar: "sidebar",
    midbar: "midbar",
    rightbar: "rightbar",
    notificationBanner: "notificationBanner",
  },

  midbar: {
    searchBar: "searchBar",
    dialpadButton: "dialpadButton",
    dialpad: "dialpad",
    content: "content",
  },

  rightbar: {
    contentHeaderPanel: "contentHeaderPanel",
    tabs: "tabs",
    contentPanel: "contentPanel",
  },
};
