// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns a basic contact details section
 * Just a heading and a single text value, no types, no buttons
 */

import React from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import { ContactDetailsSection, prettyContactDetailSectionHeader } from "../shared";

import * as S from "./styles";

import log from "src/renderer-logging";

/* Individual section JSX */
const detail = (data, type, id) => {
  const prettySectionHeader = prettyContactDetailSectionHeader(type);

  return (
    <S.BasicDetailSection>
      <S.SectionTitle>{prettySectionHeader}</S.SectionTitle>
      <S.BasicSectionContents id={id}>
        <S.Detail>
          <S.DetailValueGrey>{data}</S.DetailValueGrey>
        </S.Detail>
      </S.BasicSectionContents>
    </S.BasicDetailSection>
  );
};

/**
 * Render method for single-line text details, with no types
 * @param {String} type - Type of detail e.g. Nickname
 */
const BasicContactDetailSection = ({ type }) => {
  const { selectedContact } = useSelector((state) => state.contactReducer);

  let content;
  let id;

  switch (type) {
    case ContactDetailsSection.NICKNAME:
      content = selectedContact.identity?.nickname;
      id = "detailSection-nickname";
      break;
    case ContactDetailsSection.JOB_TITLE:
      content = selectedContact.identity?.jobTitle;
      id = "detailSection-jobTitle";
      break;
    case ContactDetailsSection.COMPANY:
      content = selectedContact.identity?.organisation;
      id = "detailSection-company";
      break;
    default:
      log.warn(`Unexpected section type - ${type}`);
      break;
  }

  if (!content) return <></>;

  return detail(content, type, id);
};

BasicContactDetailSection.propTypes = {
  type: PropTypes.number.isRequired,
};

export default BasicContactDetailSection;
