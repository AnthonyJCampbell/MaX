// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the email contact details section
 * Email heading followed by the email address link
 */

import React from "react";
import { useSelector } from "react-redux";
import i18n from "i18next";

import { prettyContactDetailSectionHeader, ContactDetailsSection } from "../shared";

import * as S from "./styles";

/* Individual email JSX */
const details = (data, index) => {
  return (
    <S.Detail key={`${data.address}, ${index}`}>
      {/* Wrap the text displayed on the button in a <span> to avoid a Windows narrator bug. See
      "Known Issues" in "docs/accessibility.md" for more information */}
      <S.DetailValueLink
        href={`mailto:${data.address}`}
        target="_blank"
        aria-label={i18n.t("sendEmailTo", { emailAddress: data.address })}
      >
        <span>{data.address}</span>
      </S.DetailValueLink>
    </S.Detail>
  );
};

/* Render method for emails */
const EmailContactDetailSection = () => {
  const { selectedContact } = useSelector((state) => state.contactReducer);

  if (selectedContact.email.length === 0) return <></>;

  const prettySectionHeader = prettyContactDetailSectionHeader(ContactDetailsSection.EMAIL);

  return (
    <S.DetailSection>
      <S.SectionTitle>{prettySectionHeader}</S.SectionTitle>
      <S.BasicSectionContents id={`detailSection-email`}>
        {selectedContact.email.map(details)}
      </S.BasicSectionContents>
    </S.DetailSection>
  );
};

export default EmailContactDetailSection;
