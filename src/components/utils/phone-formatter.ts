// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import parsePhoneNumber, { CountryCode } from "libphonenumber-js";

import { PhoneNumber } from "shared/types";

export const formatPhoneNumber = (
  phoneNumber: PhoneNumber | string,
  easRegion: CountryCode
): string => {
  const phoneNumberAsString = typeof phoneNumber === "string" ? phoneNumber : phoneNumber.value;

  const formatted = parsePhoneNumber(phoneNumberAsString, easRegion);

  if (formatted && formatted.country === easRegion) {
    return formatted.formatNational() || phoneNumberAsString;
  } else if (formatted && formatted.country !== easRegion) {
    return formatted.formatInternational() || phoneNumberAsString;
  }

  return phoneNumberAsString;
};
