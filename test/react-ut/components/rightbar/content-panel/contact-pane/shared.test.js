// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import "test/react-ut/components/require-mock";
import {
  prettyContactDetailSectionHeader,
  ContactDetailsSection,
} from "components/rightbar/content-panel/contact-pane/shared";
import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { mockedT } from "shared/mocks/ts-utils";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("src/renderer-logging");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

describe("Pretty Contact Detail Section Header", () => {
  it("Returns null if sectionType is null", () => {
    const out = prettyContactDetailSectionHeader(null);
    expect(out).toBeNull();
  });
  it("Returns the corresponding string for the sectionType", () => {
    const out = prettyContactDetailSectionHeader(ContactDetailsSection.HISTORY);
    expect(out).toEqual(mockedT("history"));
  });
  it("Returns null for the sectionType not recognised", () => {
    const out = prettyContactDetailSectionHeader(8);
    expect(out).toBeNull();
  });
});
