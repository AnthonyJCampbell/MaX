// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Text context menus for windows.
 */
"use strict";
const i18n = require("i18next");
const { Menu, clipboard } = require("../electron-wrapper");
const log = require("../main-logging");

const separator = { type: "separator" };

/** Context menu template for fixed text. */
const fixedTextTemplate = [{ role: "copy", accelerator: "CommandOrControl+C" }];

/**
 * Context menu template for links
 * @param {String} linkText Text associated with the link. May be an empty string
 * @param {String} linkURL The URL of the link, including tel: and mailto:
 * @returns
 */
const copyLinkToClipboard = (linkText, linkURL) => {
  const isPhone = linkURL.startsWith("tel:");

  // Removing mailto: because we copy the button information from their links
  // and the user would ultimately only be interested in the data
  // We are not removing "tel:" from phone numbers, because we want to copy
  // formatted phone numbers. The `linkText` in this case, is already formatted
  const clipboardText = isPhone ? linkText : linkURL?.replace(/(^mailto:)/, "");

  return [
    {
      label: i18n.t("copy"),
      click: () =>
        clipboard.write({
          bookmark: linkText,
          text: clipboardText,
        }),
    },
  ];
};

/** Context menu template for editable text. */
const editableTextTemplate = (hasText) => [
  { role: "cut", accelerator: "CommandOrControl+X", enabled: hasText },
  { role: "copy", accelerator: "CommandOrControl+C", enabled: hasText },
  { role: "paste", accelerator: "CommandOrControl+V" },
];

/** Returns a menu item that replaces the current misspelt word. */
const popUpSuggestion = (window, suggestion) => {
  return {
    label: suggestion,
    click: () => window.webContents.replaceMisspelling(suggestion),
  };
};

/** Returns a menu item that adds the current word to the dictionary. */
const addToDictionary = (window, word) => {
  return {
    label: i18n.t("addToDictionary"),
    click: () => window.webContents.session.addWordToSpellCheckerDictionary(word),
  };
};

/**
 * Provide the spell check list of menu items for a given context.
 *
 * This includes any suggested alternative words and the option to add to the
 * dictionary.
 */
const spellCheckMenu = (window, params) => {
  let template = params.dictionarySuggestions.map((s) => popUpSuggestion(window, s));
  if (params.dictionarySuggestions.length > 0) template.push(separator);
  if (params.misspelledWord) template.push(addToDictionary(window, params.misspelledWord));
  return template;
};

/**
 * Based on the type of Non-editable text, returns a template for the context menu
 * @param {*} params - Parameters from the context-menu event.
 * @returns The text template for non editable text
 */
const getNonEditableTextTemplate = (params) => {
  // This selection check comes first, because we want to copy the whole selected
  // text even when right clicking on the link inside that selection
  if (params.selectionText.trim().length > 0) {
    return fixedTextTemplate;
  } else if (params.linkURL) {
    return copyLinkToClipboard(params.linkText, params.linkURL);
  }
};

/**
 * Returns a template for the context menu after doing a spellcheck on the editable text
 * @param {BrowserWindow} window - Window the context menu is for.
 * @param {*} params - Parameters from the context-menu event.
 * @returns
 */
const geEditableTextTemplate = (window, params) => {
  let spellCheck = spellCheckMenu(window, params);
  // Disables the Copy and Cut options if no text was highlighted
  const hasText = params.selectionText.trim().length > 0;
  return spellCheck.length > 0
    ? [...spellCheck, separator, ...editableTextTemplate(hasText)]
    : editableTextTemplate(hasText);
};

/**
 * Generate a context menu given the specific window and parameters.
 *
 * This generates two types of menu, one that deals with fixed text (e.g.
 * received messages) or one that deals with editable text (e.g. writing a message).
 *
 * @param {BrowserWindow} window - Window the context menu is for.
 * @param {*} params - Parameters from the context-menu event.
 */
function contextMenu(window, params) {
  const template = params.isEditable
    ? geEditableTextTemplate(window, params)
    : getNonEditableTextTemplate(params);
  log.debug("Creating context menu: " + JSON.stringify(template));
  return Menu.buildFromTemplate(template);
}

module.exports = {
  contextMenu,
};
