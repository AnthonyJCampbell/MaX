// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import "test/react-ut/components/require-mock";
import React from "react";
import Avatar from "components/avatar/avatar";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { bilbo } from "shared/mocks/mock-contacts";
import * as S from "components/avatar/styles";
import DefaultProfilePicture from "assets/shared/default-profile-picture.png";
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import InitialsAvatar from "components/avatar/initials-avatar/initials-avatar";
import log from "src/renderer-logging";

configure({ adapter: new Adapter() });

jest.mock("components/avatar/initials-avatar/initials-avatar");
jest.mock("src/renderer-logging");
jest.mock("store/store");

beforeEach(() => log.test(`Start running: ${expect.getState().currentTestName}`));

afterEach(() => {
  jest.clearAllMocks();
  log.test(`End running: ${expect.getState().currentTestName}`);
});

describe("<Avatar />", () => {
  it("Calls the correct methods with a normal contact", () => {
    const wrap = shallow(<Avatar contact={bilbo} />);
    expect(wrap.containsMatchingElement(<S.PresenceImage />)).toBeTruthy();
    expect(wrap.containsMatchingElement(<S.PresencePlaceholder />)).not.toBeTruthy();
    expect(wrap.containsMatchingElement(<S.ProfilePicture />)).toBeTruthy();
    expect(wrap.containsMatchingElement(<InitialsAvatar contact={bilbo} />)).not.toBeTruthy();
  });

  it("Renders correctly when the contact has no presence", () => {
    const bilboNoPresence = mutableCloneDeep(bilbo);
    bilboNoPresence.presence = null;
    const wrap = shallow(<Avatar contact={bilboNoPresence} />);
    expect(wrap.containsMatchingElement(<S.PresenceImage />)).not.toBeTruthy();
    expect(wrap.containsMatchingElement(<S.PresencePlaceholder />)).toBeTruthy();
  });

  it("Auto-generates an avatar if none is supplied", () => {
    const bilboNoAvatar = mutableCloneDeep(bilbo);
    bilboNoAvatar.identity.profilePicture = null;
    const wrap = shallow(<Avatar contact={bilboNoAvatar} />);
    expect(wrap.containsMatchingElement(<S.ProfilePicture />)).not.toBeTruthy();
    expect(
      wrap.containsMatchingElement(
        <InitialsAvatar
          firstName={bilboNoAvatar.identity.firstName}
          lastName={bilboNoAvatar.identity.lastName}
        />
      )
    ).toBeTruthy();
  });

  it("Uses a default avatar if none can be generated", () => {
    const bilboNoAvatarNoName = mutableCloneDeep(bilbo);
    bilboNoAvatarNoName.identity.profilePicture = null;
    bilboNoAvatarNoName.identity.firstName = "";
    bilboNoAvatarNoName.identity.lastName = "";
    const wrap = shallow(<Avatar contact={bilboNoAvatarNoName} />);
    expect(
      wrap.containsMatchingElement(<S.ProfilePicture src={DefaultProfilePicture} />)
    ).toBeTruthy();
    expect(
      wrap.containsMatchingElement(<InitialsAvatar contact={bilboNoAvatarNoName} />)
    ).not.toBeTruthy();
  });
});
