// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the address contact details section
 * The address header, address text, followed by the type of address, spaced out 25px from the
 * longest address text field
 */

import React from "react";
import { useSelector } from "react-redux";

import { prettyContactDetailType } from "components/utils/common";
import { prettyContactDetailSectionHeader, ContactDetailsSection } from "../shared";

import * as S from "./styles";

/* Individual address text JSX */
const details = (data, index) => {
  // Join together on one line, replacing line breaks for both Windows and Mac
  const visibleText = data.line.join(", ").replace(/(\r)?\n/g, ", ");
  return (
    <S.Detail
      key={`${data.line}, ${data.type}, ${index}`}
      aria-label={`${visibleText}, ${prettyContactDetailType(data.type)}`}
    >
      <S.DetailValueGrey aria-hidden={true}>{visibleText}</S.DetailValueGrey>
    </S.Detail>
  );
};

/* Individual address type JSX */
const types = (data, index) => (
  <S.Detail key={`${data.line}, ${data.type}, ${index}`} aria-hidden={true}>
    <S.DetailType>{prettyContactDetailType(data.type)}</S.DetailType>
  </S.Detail>
);

/* Render method for postal addresses */
const AddressContactDetailSection = () => {
  const { selectedContact } = useSelector((state) => state.contactReducer);

  if (selectedContact.postal.length === 0) return <></>;

  return (
    <S.DetailSection>
      <S.SectionTitle>
        {prettyContactDetailSectionHeader(ContactDetailsSection.ADDRESS)}
      </S.SectionTitle>
      <S.SectionContents id={`detailSection-address`} numRows={selectedContact.postal.length}>
        {selectedContact.postal.map(details)}
        {selectedContact.postal.map(types)}
      </S.SectionContents>
    </S.DetailSection>
  );
};

export default AddressContactDetailSection;
