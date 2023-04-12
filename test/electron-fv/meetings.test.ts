// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Meetings related Electron FV tests
 */
import { expectWithinTimeout, waitForCondition } from "test/utils/utils";
import { protoBilbo, protoPeter } from "shared/mocks/mock-contacts";
import { Application } from "spectron";
import { MockWispa } from "../utils/mock-wispa";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UI } from "./utils/interface";

export const meetingManagementPane = {
  title: "Meeting management pane",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();

      await app.client.refresh();

      await UI.sidebar.meetingsButton.waitForVisible();
      await UI.sidebar.meetingsButton.click();
      await waitForCondition(
        async () => await UI.midbar.meetingManagement.createButton.isVisible()
      );
    });

    it('sends a "Create Meeting With Options" request to WISPA when clicking "Create" button', async () => {
      await UI.midbar.meetingManagement.createButton.click();

      await expectWithinTimeout(
        () => {
          return mockWispa.hasReceivedRequest("meeting", "action", {
            createMeetingWithOptions: { tabToShow: 0 },
            scheduleAMeeting: false,
            viewScheduledMeetings: false,
            viewRecordedMeetings: false,
            joinAMeeting: false,
          });
        },
        "Mock WISPA did not receive meeting action 'createMeetingWithOptions' request",
        1000
      );
    });

    it('sends a "Schedule meeting" request to WISPA when clicking "Schedule" button', async () => {
      await UI.midbar.meetingManagement.scheduleButton.click();

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("meeting", "action", {
            scheduleAMeeting: true,
            viewScheduledMeetings: false,
            viewRecordedMeetings: false,
            joinAMeeting: false,
          }),
        "Mock WISPA did not receive meeting action 'scheduleAMeeting' request"
      );
    });

    it('sends a "Join meeting" request to WISPA when clicking "Join a meeting" button', async () => {
      await UI.midbar.meetingManagement.joinButton.click();

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("meeting", "action", {
            scheduleAMeeting: false,
            viewScheduledMeetings: false,
            viewRecordedMeetings: false,
            joinAMeeting: true,
          }),
        "Mock WISPA did not receive meeting action 'joinAMeeting' request"
      );
    });

    it('sends a "View Scheduled Meetings" request to WISPA when clicking "View upcoming meetings" button', async () => {
      await UI.midbar.meetingManagement.viewUpcomingButton.click();

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("meeting", "action", {
            scheduleAMeeting: false,
            viewScheduledMeetings: true,
            viewRecordedMeetings: false,
            joinAMeeting: false,
          }),
        "Mock WISPA did not receive meeting action 'viewScheduledMeetings' request"
      );
    });

    it('sends a "View Recorded Meetings" request to WISPA when clicking "View recorded meetings" button', async () => {
      await UI.midbar.meetingManagement.viewRecordedButton.click();

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("meeting", "action", {
            scheduleAMeeting: false,
            viewScheduledMeetings: false,
            viewRecordedMeetings: true,
            joinAMeeting: false,
          }),
        "Mock WISPA did not receive meeting action 'viewRecordedMeetings' request"
      );
    });
  },
};

export const meetingQuickLink = {
  title: "Meeting quick-link",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();
      mockWispa.data.contacts = [protoBilbo, protoPeter];

      await app.client.refresh();
      await UI.midbar.contactList.waitForSomeContacts(2);
      const contacts = await UI.midbar.contactList.contacts();
      // Select Peter, who has an IM address and can be invited to meetings.
      await contacts[1].click();
      await waitForCondition(
        async () => (await UI.rightbar.contentHeaderPanel.contact.name()) === "Peter Parker"
      );
    });

    it('sends a "create meeting" request to WISPA when clicking meeting button and not in a meeting', async () => {
      const panel = UI.rightbar.contentHeaderPanel;
      await panel.defaultMeetingButton.click();

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("meeting", "create", {
            remoteParty: [{ value: protoPeter.im.value }],
            upliftCall: "",
            uid: "",
          }),
        "Mock WISPA did not receive create meeting request"
      );
    });

    it('sends an "update meeting" request to WISPA when clicking meeting button and in a meeting', async () => {
      mockWispa.sendMeeting();
      const panel = UI.rightbar.contentHeaderPanel;
      await waitForCondition(async () => {
        return await panel.defaultMeetingButton.isVisible();
      });
      await panel.defaultMeetingButton.click();

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("meeting", "update", {
            remoteParty: [{ value: protoPeter.im.value }],
            upliftCall: "",
            uid: "",
          }),
        "Mock WISPA did not receive update meeting request"
      );
    });
  },
};
