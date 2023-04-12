// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import "test/react-ut/components/require-mock";
import ContactList from "components/midbar/contact-list/contact-list";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { peter, gandalf, bilbo } from "shared/mocks/mock-contacts";
import * as redux from "react-redux";
import * as S from "components/midbar/contact-list/styles";
import ContactBlock from "components/midbar/contact-list/contact-block/contact-block";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("action-creators/navigation/actions");
jest.mock("react-redux");
jest.mock("components/midbar/contact-list/contact-block/contact-block");
jest.mock("src/renderer-logging");
jest.mock("react", () => {
  const react = jest.requireActual("react");

  return { ...react, memo: (component) => component };
});

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

const mockState = {
  contactReducer: { contacts: [gandalf, bilbo, peter] },
  paneManagementReducer: { displayFavs: false, searchTerm: "" },
};

describe("<ContactList />", () => {
  const useSelectorMock = jest.spyOn(redux, "useSelector");
  useSelectorMock.mockImplementation((callback) => callback(mockState));
  const useDispatchMock = jest.spyOn(redux, "useDispatch");
  useDispatchMock.mockReturnValue(() => jest.fn());

  it("Renders alphabetically", () => {
    const wrap = shallow(<ContactList />);
    const ContactBlocks = wrap.find(ContactBlock);

    expect(ContactBlocks.first().props().contact).toEqual(bilbo);
    expect(ContactBlocks.at(1).props().contact).toEqual(gandalf);
    expect(ContactBlocks.at(2).props().contact).toEqual(peter);
  });

  it("Renders an empty list", () => {
    mockState.contactReducer.contacts = [];

    const wrap = shallow(<ContactList />);

    expect(wrap.containsMatchingElement(<ContactBlock />)).toBe(false);
    expect(wrap.containsMatchingElement(<S.NoResultsContainer />)).toBe(false);
  });

  it("filters contact lists with a search term present", () => {
    mockState.contactReducer.contacts = [bilbo, gandalf];
    mockState.paneManagementReducer.searchTerm = "bil";

    const wrap = shallow(<ContactList />);
    const ContactBlocks = wrap.find(ContactBlock);

    // We show Bilbo and hide Gandalf with a partial string match.
    expect(ContactBlocks.first().props().contact).toEqual(bilbo);
    expect(ContactBlocks).toHaveLength(1);
  });

  it("shows 'No Results' text when a search term is present but no contacts match the search", () => {
    mockState.contactReducer.contacts = [bilbo, gandalf];
    mockState.paneManagementReducer.searchTerm = "gandalf";

    const wrap = shallow(<ContactList />);

    expect(wrap.containsMatchingElement(S.NoResultsContainer)).toBe(true);
  });

  it("show favorites as title", () => {
    mockState.contactReducer.contacts = [bilbo, gandalf];
    mockState.paneManagementReducer.searchTerm = "gandalf";

    const wrap = shallow(<ContactList />);

    expect(wrap.containsMatchingElement(S.FavouritesTitle)).toBe(true);
  });

  it("filters contact lists based on nickname", () => {
    mockState.contactReducer.contacts = [bilbo, peter, gandalf];
    mockState.paneManagementReducer.searchTerm = peter.identity.nickname;

    const wrap = shallow(<ContactList />);
    const ContactBlocks = wrap.find(ContactBlock);

    expect(ContactBlocks.first().props().contact).toEqual(peter);
    expect(ContactBlocks).toHaveLength(1);
  });

  it("filters contact lists based on email", () => {
    mockState.contactReducer.contacts = [bilbo, peter, gandalf];
    mockState.paneManagementReducer.searchTerm = peter.email[1].address;

    const wrap = shallow(<ContactList />);
    const ContactBlocks = wrap.find(ContactBlock);

    expect(ContactBlocks.first().props().contact).toEqual(peter);
    expect(ContactBlocks).toHaveLength(1);
  });

  it("filters contact lists based on phone number", () => {
    mockState.contactReducer.contacts = [bilbo, peter, gandalf];
    mockState.paneManagementReducer.searchTerm = gandalf.phone[1].value;

    const wrap = shallow(<ContactList />);
    const ContactBlocks = wrap.find(ContactBlock);

    expect(ContactBlocks.first().props().contact).toEqual(gandalf);
    expect(ContactBlocks).toHaveLength(1);
  });

  it("filters contact lists based on organisation", () => {
    mockState.contactReducer.contacts = [bilbo, peter, gandalf];
    mockState.paneManagementReducer.searchTerm = "Avengers";

    const wrap = shallow(<ContactList />);
    const ContactBlocks = wrap.find(ContactBlock);

    // We show Bilbo and hide Gandalf with a partial string match.
    expect(ContactBlocks.first().props().contact).toEqual(peter);
    expect(ContactBlocks).toHaveLength(1);
  });

  it("is capable of handling extra white space when searching for a phone number", () => {
    mockState.contactReducer.contacts = [bilbo, gandalf];
    mockState.paneManagementReducer.searchTerm = "01 234 567";

    const wrap = shallow(<ContactList />);
    const ContactBlocks = wrap.find(ContactBlock);

    // We show Bilbo and hide Gandalf with a partial string match.
    expect(ContactBlocks.first().props().contact).toEqual(bilbo);
    expect(ContactBlocks).toHaveLength(1);
  });

  /**
   * The idList state is not tested at UT level, as it would require going out of
   * scope of the contact-list component.
   */
});
