// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns an ENUM and ENUM-string logic for the contact details sections
 */
import i18n from "i18next";
import log from "src/renderer-logging";

/** Standard contact details section types */
enum ContactDetailsSectionEnum {
  NICKNAME,
  JOB_TITLE,
  COMPANY,
  PHONE,
  EMAIL,
  ADDRESS,
  HISTORY,
}

export type ContactDetailsSection = ContactDetailsSectionEnum;
export const ContactDetailsSection = ContactDetailsSectionEnum;

/**
 * Return the formatted contact details section header.
 * @param {String} sectionType - Section type
 */
export const prettyContactDetailSectionHeader = (
  sectionType: ContactDetailsSection
): string | null => {
  if (sectionType == null) {
    return null;
  }

  switch (sectionType) {
    case ContactDetailsSection.NICKNAME:
      return i18n.t("nickname");
    case ContactDetailsSection.JOB_TITLE:
      return i18n.t("jobTitle");
    case ContactDetailsSection.COMPANY:
      return i18n.t("company");
    case ContactDetailsSection.PHONE:
      return i18n.t("phone");
    case ContactDetailsSection.EMAIL:
      return i18n.t("email");
    case ContactDetailsSection.ADDRESS:
      return i18n.t("address");
    case ContactDetailsSection.HISTORY:
      return i18n.t("history");
    default:
      log.warn(`Invalid section type: ${sectionType}`);
      return null;
  }
};
