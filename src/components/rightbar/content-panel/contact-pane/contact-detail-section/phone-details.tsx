// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useSelector } from "react-redux";
import { CountryCode } from "libphonenumber-js";

import { prettyContactDetailType } from "components/utils/common";
import { formatPhoneNumber } from "components/utils/phone-formatter";

import * as S from "./styles";

import { PhoneNumber } from "shared/types";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { StoreState } from "store/types";
import { useTranslation } from "react-i18next";

export interface PhoneDetailsProps {
  data: PhoneNumber;
  index: number;
  easRegion: CountryCode;
  callback: (number: string) => void;
}

const types = (data: PhoneNumber, uid: string): React.ReactElement<typeof S.Detail> => (
  <>{uid !== "" && <S.DetailParagraph>{prettyContactDetailType(data.type)}</S.DetailParagraph>}</>
);

/* Individual phone number button JSX */
const PhoneDetails: React.FC<PhoneDetailsProps> = ({ data, index, easRegion, callback }) => {
  const phoneNumber = formatPhoneNumber(data, easRegion);
  const uid = useSelector<StoreState, string>((state) => state.contactReducer.selectedContact.uid);

  const { t } = useTranslation();
  const onClick: React.MouseEventHandler<HTMLAnchorElement> = (e): void => {
    // Stop it from opening the tel: URI with another application, since we're already handling it
    // in-app.
    e.preventDefault();
    callback(data.value);
  };

  return (
    <S.PhoneDetail key={`${data.value}, ${data.type}, ${index}`}>
      <S.DetailValueLink
        href={`tel:${data.value}`}
        onClick={onClick}
        aria-label={`${t("call")} ${phoneNumber}${
          uid !== "" ? `, ${prettyContactDetailType(data.type)}` : ""
        }`}
      >
        {/* Wrap the text displayed on the button in a <span> to avoid a Windows narrator bug. See
        "Known Issues" in "docs/accessibility.md" for more information */}
        <span aria-hidden={true}>{phoneNumber}</span>
      </S.DetailValueLink>
      {types(data, uid)}
    </S.PhoneDetail>
  );
};

export default PhoneDetails;
