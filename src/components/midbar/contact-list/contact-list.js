// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the contact list.
 */

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { setSearchResultsCount } from "action-creators/navigation/actions";
import { selectFavourites } from "selectors/contacts";

import ContactBlock from "./contact-block/contact-block";
import { fullname } from "components/utils/common";
import ArrowKeyControl from "components/arrow-key-control/control";
import Icon from "components/ui/Icon/Icon";

import * as S from "./styles";

import log from "src/renderer-logging";

/**
 * Render the list of contact blocks.
 */
const ContactList = () => {
  // Use Redux state for retrieving contacts and favourite contacts.
  const { contacts } = useSelector((state) => state.contactReducer);
  const favourites = useSelector(selectFavourites());
  const { displayFavs, searchTerm } = useSelector((state) => state.paneManagementReducer);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const isNumeric = (char) => char >= "0" && char <= "9";

  // Numeric names should be sorted to after lettered names
  const contactSorter = (contactA, contactB) => {
    const nameA = fullname(contactA);
    const nameB = fullname(contactB);

    // If only one is numeric, move it down
    if (isNumeric(nameA[0]) && !isNumeric(nameB[0])) return 1;
    if (!isNumeric(nameA[0]) && isNumeric(nameB[0])) return -1;
    // Otherwise, sort as normal
    return nameA.localeCompare(nameB);
  };

  /** Filter according to searchTerm string, case insensitively. */
  const matchSearch = (contact) => {
    const cleanedUpSearchTerm = searchTerm.toLowerCase();
    const fullName = fullname(contact).toLowerCase();
    const { identity, phone, email } = contact;
    return (
      fullName.includes(cleanedUpSearchTerm) ||
      identity?.nickname.toLowerCase().includes(cleanedUpSearchTerm) ||
      phone?.some((num) =>
        num.value.includes(cleanedUpSearchTerm.replace(/[\s\-(),[\]{}()<>+]/g, ""))
      ) ||
      identity?.organisation.toLowerCase().includes(cleanedUpSearchTerm) ||
      email?.some((email) => email.address.toLowerCase().includes(cleanedUpSearchTerm))
    );
  };

  /** Sort contacts alphabetically and filter if necessary. */
  const prepareContacts = (contacts) => {
    const sorted = [...contacts].sort(contactSorter);
    return searchTerm ? sorted.filter(matchSearch) : sorted;
  };

  // Sorted and filtered contacts and favourites
  const preparedContacts = prepareContacts(contacts);
  const preparedFavourites = prepareContacts(favourites);

  // How many results we're displaying.
  const searchResultsCount = preparedContacts.length + preparedFavourites.length;
  useEffect(() => {
    dispatch(setSearchResultsCount(searchResultsCount));
  }, [searchResultsCount, dispatch]);

  const contactsIdList = preparedContacts.map((contact) => {
    return `contactBlock-${contact.uid}`;
  });

  const favsIdList = preparedFavourites.map((contact) => {
    return `contactBlock-${contact.uid}-f`;
  });

  /**
   * Render each item in the list of contacts passed in
   * @param {Contact[]} contacts
   * @param {boolean} inFavSection - Optional, whether block is to be rendered
   * in favourites section
   */
  const renderContacts = (contacts = [], inFavSection = false) => {
    // Returns a Contact Block for each contact passed in.
    return contacts.map((contact) => {
      const id = `contactBlock-${contact.uid}${inFavSection ? "-f" : ""}`;
      return <ContactBlock key={contact.uid} contact={contact} id={id} />;
    });
  };

  /**
   * Sort and group the contact list
   *
   * - Contacts are already sorted and filtered (through prepareContacts())
   * - Group contacts by letter (i.e. {A: [{}, {}], B: {}......})
   * - For each group, render a block for the given letter (i.e. A, B, etc.) and render the
   *   associated contacts within that block
   */
  const renderContactList = () => {
    // Create groups
    const groupedContacts = preparedContacts.reduce((groups, contact) => {
      const letter = fullname(contact).charAt(0).toUpperCase();

      // While these operations could cause object injection, we know that letter is a
      // single char and hence these operations are safe.
      // eslint-disable-next-line security/detect-object-injection
      groups[letter] = groups[letter] || [];
      // eslint-disable-next-line security/detect-object-injection
      groups[letter].push(contact);

      return groups;
    }, {});

    const result = Object.keys(groupedContacts);

    // We want all letter groups to appear above all number groups, so do some shuffling
    result.sort((a, b) => {
      // If only one is numeric, move it down
      if (isNumeric(a) && !isNumeric(b)) return 1;
      if (!isNumeric(a) && isNumeric(b)) return -1;
      // Otherwise, sort as normal
      return a > b;
    });

    // Render blocks and associated contacts
    return result.map((letter) => {
      return (
        <div key={letter}>
          <S.ContactGroupTitle>{letter}</S.ContactGroupTitle>
          {/* eslint-disable-next-line security/detect-object-injection */}
          {renderContacts(groupedContacts[letter])}
        </div>
      );
    });
  };

  /** Render the favourites block. */
  const renderFavourites = (showGroup) => {
    if (preparedFavourites && preparedFavourites.length !== 0) {
      return (
        <div>
          <S.FavouritesTitle id="favouritesSectionTitle">
            <Icon icon="star" size={12} variant="dark" />
            {t("favourites")}
          </S.FavouritesTitle>

          {/* Favorites are rendered as part of the total contact list, only once toggled */}
          {showGroup ? renderContacts(preparedFavourites, true) : null}
        </div>
      );
    }
  };

  if (searchTerm !== "" && searchResultsCount === 0) {
    log.debug(`No contacts matching the search term ${searchTerm}`);
    // Render "No Results" text
    return (
      <S.NoResultsContainer>
        <h1>{t("noResults")}</h1>
        <p>{t("noResultsMessage")}</p>
      </S.NoResultsContainer>
    );
  } else {
    log.debug("Rendering contact list");
    return (
      <S.ContactListContainer id="contactList">
        <ArrowKeyControl
          idList={
            displayFavs
              ? ["favouritesButton", ...favsIdList, ...contactsIdList]
              : ["favouritesButton", ...contactsIdList]
          }
        >
          {renderFavourites(displayFavs)}
          {renderContactList()}
        </ArrowKeyControl>
      </S.ContactListContainer>
    );
  }
};

export default ContactList;
