// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Electron FV tests related to in-call UI.
 */

import { CallStatus } from "shared/types";
import { ipcChannels } from "shared/constants";

import { protoBilbo, protoGandalf, protoPeter } from "shared/mocks/mock-contacts";
import {
  bilboCall,
  protoBilboCall,
  protoGandalfCall,
  gandalfCall,
} from "shared/mocks/mock-active-calls";
import { mutableCloneDeep } from "shared/mocks/ts-utils";

import { Section, WindowType } from "test/electron-fv/utils/interface";
import { waitForCondition, expectWithinTimeout, pause } from "test/utils/utils";
import { Application } from "spectron";
import { MockWispa } from "../../utils/mock-wispa";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UI } from "../utils/interface";

export const inCallHeaderPanel = {
  title: "In call header panel",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();
      mockWispa.createDataStore.activeCalls = [protoBilboCall];
      mockWispa.data.contacts = [protoBilbo, protoPeter, protoGandalf];

      await app.client.refresh();

      await UI.midbar.contactList.waitForSomeContacts(3);
      const contacts = await UI.midbar.contactList.contacts();
      // Select Bilbo, who only has one phone number.
      await contacts[0].click();
      await waitForCondition(async () => {
        return (await UI.rightbar.contentHeaderPanel.contact.name()) === "Bilbo Baggins";
      });
    });

    it("displays correct add/transfer menu", async () => {
      const panel = UI.rightbar.contentHeaderPanel;
      await expectWithinTimeout(
        async () => await panel.callButton.isVisible(),
        "Call button did not become visible"
      );

      await panel.callButton.click();
      await expectWithinTimeout(
        async () => await panel.addTransferButton.isVisible(),
        "Add/Transfer button did not become visible"
      );

      await panel.addTransferButton.click();
      await expectWithinTimeout(
        async () => await panel.addTransferButton.menu.isVisible(),
        "Add/Transfer menu did not become visible"
      );

      expect(await panel.addTransferButton.menu.rowTexts()).toEqual([
        "Add someone to this call",
        "Attended transfer",
        "Blind transfer",
      ]);
    });

    it("displays correct overflow menu", async () => {
      const panel = UI.rightbar.contentHeaderPanel;
      await expectWithinTimeout(
        async () => await panel.callButton.isVisible(),
        "Call button did not become visible"
      );

      await panel.callButton.click();
      await expectWithinTimeout(
        async () => await panel.inCallMoreButton.isVisible(),
        "In Call more button did not become visible"
      );

      await panel.inCallMoreButton.click();
      await expectWithinTimeout(
        async () => await panel.inCallMoreButton.menu.isVisible(),
        "In Call more menu did not become visible"
      );

      expect(await panel.inCallMoreButton.menu.rowTexts()).toEqual([
        "Move call to another device",
        "Show keypad",
        "Add to favourites",
        "Notify when available",
        "Edit contact",
        "Delete contact",
      ]);
    });

    // This test is skipped as something about the docking of the in-call window makes it flakey.
    // This is okay since we're expecting to do away with the in-call window until GA anyway
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('does not display "Edit contact" and "Delete contact" options in overflow menu when in a call with a non-contact', async () => {
      const panel = UI.rightbar.contentHeaderPanel;

      const protoNonContactCurrent = mutableCloneDeep(protoBilboCall);
      protoNonContactCurrent.status = CallStatus.CURRENT;
      protoNonContactCurrent.remoteParty = "01773299423";

      mockWispa.data.activeCalls = [protoNonContactCurrent];
      mockWispa.sendActiveCall(protoNonContactCurrent.uid);
      await expectWithinTimeout(
        async () => (await app.client.getWindowCount()) === 2,
        "In call window did not appear"
      );

      await app.client.windowByIndex(1);
      await UI.inCallFrame.dockButton.click();

      await app.client.windowByIndex(0);
      await expectWithinTimeout(
        async () => (await UI.windowType()) === WindowType.MAIN,
        "The main window did not focus after the in call window was docked"
      );
      await panel.expectToBeInCall();

      await panel.inCallMoreButton.click();
      await expectWithinTimeout(
        async () => await panel.inCallMoreButton.menu.isVisible(),
        "In Call more menu did not become visible"
      );
      expect(await panel.inCallMoreButton.menu.rowTexts()).toEqual([
        "Move call to another device",
        "Show keypad",
      ]);
    });

    it("buttons display tooltips", async () => {
      // Use Gandalf for this one since Bilbo has no IM address, meaning no meeting button
      const [, gandalf] = await UI.midbar.contactList.contacts();
      await gandalf.click();

      const panel = UI.rightbar.contentHeaderPanel;
      await panel.callButton.isVisible();

      const checkTooltip = async (button: Section, tooltipText: string): Promise<void> => {
        await button.hover();
        await expectWithinTimeout(async () => {
          // Wrap `getText` in a try/catch statement so that we don't error out if the tooltip does't
          // exist yet. It's not sufficient to wait for the tooltip to exist and then try to get its
          // text as if it's the tooltip from the previous button then it's very possible for it to
          // disappear in between checking that it is shown and getting its text.
          try {
            return (await UI.tooltip.getText()) === tooltipText;
          } catch (err) {
            return false;
          }
        }, `Tooltip did not display text "${tooltipText}"`);
      };

      await panel.expectToBeOutOfCall();
      await checkTooltip(panel.defaultMeetingButton, "Start meeting");
      await checkTooltip(panel.callButton, "Call");
      await checkTooltip(panel.defaultMoreButton, "More");

      mockWispa.data.activeCalls = [protoGandalfCall];
      mockWispa.sendActiveCallsList();
      await panel.hangUpButton.waitForVisible(5000);

      // When accepting a call the hang up button is focused without mouse. This makes its tooltip
      // show (as expected). However it messes up our testing as it won't disappear until we click
      // somewhere (not just hover somewhere else), so click somewhere inocuous before carrying on
      // with the test to force it to clear.
      await UI.sidebar.click();

      await checkTooltip(panel.addTransferButton, "Add or transfer");
      await checkTooltip(panel.muteButton, "Mute");
      await checkTooltip(panel.inCallMeetingButton, "Start meeting");
      await checkTooltip(panel.recordButton, "Record");
      await checkTooltip(panel.holdButton, "Put on hold");
      await checkTooltip(panel.hangUpButton, "Hang up");
      await checkTooltip(panel.inCallMoreButton, "More call actions");
    });

    it("should not display meeting button", async () => {
      const panel = UI.rightbar.contentHeaderPanel;
      const hasMeetingEnabled = false;

      mockWispa.data.settings = {
        ...mockWispa.data.settings,
        meetings: {
          enabled: hasMeetingEnabled,
        },
      };
      mockWispa.sendSettings();

      // Use Gandalf for this one since Bilbo has no IM address, meaning no meeting button
      const [, gandalf] = await UI.midbar.contactList.contacts();
      await gandalf.click();

      await panel.callButton.isVisible();

      await panel.expectToBeOutOfCall(hasMeetingEnabled);

      mockWispa.data.activeCalls = [protoGandalfCall];
      mockWispa.sendActiveCallsList();

      await panel.expectToBeInCall(hasMeetingEnabled);

      // When accepting a call the hang up button is focused without mouse. This makes its tooltip
      // show (as expected). However it messes up our testing as it won't disappear until we click
      // somewhere (not just hover somewhere else), so click somewhere inocuous before carrying on
      // with the test to force it to clear.
      await UI.sidebar.click();

      await expectWithinTimeout(
        async () => (await panel.inCallMeetingButton.isVisible()) === false,
        "Meeting Button was not hide"
      );
    });

    it("displays in call UI with connecting... when clicking the call button", async () => {
      const protoBilboConnecting = mutableCloneDeep(protoBilboCall);
      protoBilboConnecting.status = CallStatus.CONNECTING;
      mockWispa.createDataStore.activeCalls = [protoBilboConnecting];
      const panel = UI.rightbar.contentHeaderPanel;

      await panel.expectToBeOutOfCall();
      await panel.callButton.click();

      await expectWithinTimeout(() => {
        return mockWispa.hasReceivedRequest("activecalls", "create", {
          uid: "",
          remoteParty: protoBilbo.phone[0].value,
          datetimeStarted: "",
        });
      }, "Mock WISPA did not receive request to start a call.");

      await panel.expectToBeInCall();
      await expectWithinTimeout(async () => {
        return (await UI.rightbar.contentHeaderPanel.contact.detail()) === "Connecting...";
      }, "Connecting... not displayed within timeout");
    });

    it("displays in call UI with ringing... when receiving a ringing WISPA message", async () => {
      const protoBilboRinging = mutableCloneDeep(protoBilboCall);
      protoBilboRinging.status = CallStatus.RINGING;
      mockWispa.createDataStore.activeCalls = [protoBilboRinging];
      const panel = UI.rightbar.contentHeaderPanel;

      await panel.expectToBeOutOfCall();
      await panel.callButton.click();

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("activecalls", "create", {
            uid: "",
            remoteParty: protoBilbo.phone[0].value,
            datetimeStarted: "",
          }),
        "Mock WISPA did not receive request to start a call."
      );

      await panel.expectToBeInCall();

      await expectWithinTimeout(
        async () => (await UI.rightbar.contentHeaderPanel.contact.detail()) === "Ringing...",
        "Ringing... not displayed within timeout"
      );
    });

    it("displays in call UI with timer when receiving a current WISPA message", async () => {
      mockWispa.createDataStore.activeCalls = [protoBilboCall];
      const panel = UI.rightbar.contentHeaderPanel;

      await panel.expectToBeOutOfCall();

      await panel.callButton.click();
      await expectWithinTimeout(() => {
        return mockWispa.hasReceivedRequest("activecalls", "create", {
          uid: "",
          remoteParty: protoBilbo.phone[0].value,
          datetimeStarted: "",
        });
      }, "Mock WISPA did not receive request to start a call.");

      await panel.expectToBeInCall();

      await expectWithinTimeout(async () => {
        const detail = await UI.rightbar.contentHeaderPanel.contact.detail();
        const pattern = new RegExp("[0-5][0-9]:[0-5][0-9]");
        return pattern.exec(detail) != null;
      }, "Call time not displayed within timeout");
    });

    it("displays normal UI when clicking the hang up button", async () => {
      mockWispa.createDataStore.activeCalls = [protoBilboCall];
      const panel = UI.rightbar.contentHeaderPanel;
      await panel.callButton.isVisible();
      await panel.callButton.click();
      await expectWithinTimeout(() => {
        return mockWispa.hasReceivedRequest("activecalls", "create", {
          uid: "",
          remoteParty: protoBilbo.phone[0].value,
          datetimeStarted: "",
        });
      }, "Mock WISPA did not receive request to start a call.");

      await panel.expectToBeInCall();

      await panel.hangUpButton.click();
      await expectWithinTimeout(() => {
        return mockWispa.hasReceivedRequest("activecalls", "delete", {
          uid: bilboCall.uid,
          remoteParty: "",
          datetimeStarted: "",
        });
      }, "Mock WISPA did not receive request to end a call.");
      await waitForCondition(async () => {
        return await panel.callButton.isVisible();
      });
      await panel.expectToBeOutOfCall();
    });

    it('sends a "create meeting" request to WISPA when clicking meeting button and not in a meeting', async () => {
      const [, gandalf] = await UI.midbar.contactList.contacts();
      await gandalf.click();
      await expectWithinTimeout(
        async () => (await UI.rightbar.contentHeaderPanel.contact.name()) === "Gandalf The ⚪",
        "Gandalf did not become the selected contact"
      );

      mockWispa.createDataStore.activeCalls = [protoGandalfCall];
      const panel = UI.rightbar.contentHeaderPanel;
      await panel.callButton.click();
      await expectWithinTimeout(
        async () => UI.rightbar.contentHeaderPanel.callButton.menu.isVisible(),
        "Gandalf's phone number dropdown list did not become visible "
      );
      await (await UI.rightbar.contentHeaderPanel.callButton.menu.rows())[0].click();
      await expectWithinTimeout(
        async () => await panel.hangUpButton.isVisible(),
        "Call with Gandalf did not start"
      );

      await panel.inCallMeetingButton.click();
      await expectWithinTimeout(() => {
        return mockWispa.hasReceivedRequest("meeting", "create", {
          remoteParty: [{ value: protoGandalf.im.value }],
          upliftCall: protoGandalfCall.uid,
          uid: "",
        });
      }, "Mock WISPA did not receive create meeting request");
    });

    it('sends an "update meeting" request to WISPA when clicking meeting button and in a meeting', async () => {
      mockWispa.createDataStore.activeCalls = [protoBilboCall];
      mockWispa.sendMeeting();

      const [, gandalf] = await UI.midbar.contactList.contacts();
      await gandalf.click();
      await expectWithinTimeout(
        async () => (await UI.rightbar.contentHeaderPanel.contact.name()) === "Gandalf The ⚪",
        "Gandalf did not become the selected contact"
      );

      mockWispa.createDataStore.activeCalls = [protoGandalfCall];
      const panel = UI.rightbar.contentHeaderPanel;
      await panel.callButton.click();
      await expectWithinTimeout(
        async () => UI.rightbar.contentHeaderPanel.callButton.menu.isVisible(),
        "Gandalf's phone number dropdown list did not become visible "
      );
      await (await UI.rightbar.contentHeaderPanel.callButton.menu.rows())[0].click();
      await expectWithinTimeout(
        async () => await panel.hangUpButton.isVisible(),
        "Call with Gandalf did not start"
      );

      await panel.inCallMeetingButton.click();
      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("meeting", "update", {
            remoteParty: [{ value: protoGandalf.im.value }],
            upliftCall: gandalfCall.uid,
            uid: "",
          }),
        "Mock WISPA did not receive update meeting request"
      );
    });

    it("sends an update active call request to WISPA when clicking hold button and call is connected", async () => {
      mockWispa.createDataStore.activeCalls = [protoBilboCall];
      const panel = UI.rightbar.contentHeaderPanel;
      await panel.callButton.click();

      await expectWithinTimeout(
        async () => await panel.holdButton.isVisible(),
        "Hold button did not become visible"
      );

      await panel.holdButton.click();
      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("activecalls", "update", {
            uid: bilboCall.uid,
            remoteParty: "",
            datetimeStarted: "",
            status: CallStatus.HOLD,
          }),
        "Mock WISPA did not receive request to put call on hold"
      );
    });

    it("sends an update active call request to WISPA when clicking hold button and call is on hold", async () => {
      const protoBilboHold = mutableCloneDeep(protoBilboCall);
      protoBilboHold.status = CallStatus.HOLD;
      mockWispa.createDataStore.activeCalls = [protoBilboHold];
      const panel = UI.rightbar.contentHeaderPanel;
      await panel.callButton.click();
      await waitForCondition(async () => {
        return await panel.holdButton.isVisible();
      });

      await panel.holdButton.click();

      await expectWithinTimeout(() => {
        return mockWispa.hasReceivedRequest("activecalls", "update", {
          uid: protoBilboHold.uid,
          remoteParty: "",
          datetimeStarted: "",
          status: CallStatus.CURRENT,
        });
      }, "Mock WISPA did not receive request to take call off hold");
    });

    it("sends an update active call request to WISPA when muting", async () => {
      mockWispa.createDataStore.activeCalls = [protoBilboCall];
      const panel = UI.rightbar.contentHeaderPanel;
      await panel.callButton.click();

      await waitForCondition(async () => await panel.muteButton.isVisible());

      await panel.muteButton.click();
      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("activecalls", "update", {
            uid: bilboCall.uid,
            remoteParty: "",
            datetimeStarted: "",
            microphoneIsMuted: true,
          }),
        "Mock WISPA did not receive request to mute microphone"
      );
    });

    it("sends an update active call request to WISPA when unmuting", async () => {
      const protoBilboMuted = mutableCloneDeep(protoBilboCall);
      protoBilboMuted.microphoneIsMuted = true;

      mockWispa.createDataStore.activeCalls = [protoBilboMuted];
      const panel = UI.rightbar.contentHeaderPanel;
      await panel.callButton.click();

      await expectWithinTimeout(
        async () => await panel.muteButton.isVisible(),
        "Mute button did not become visible"
      );

      await panel.muteButton.click();

      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("activecalls", "update", {
            uid: bilboCall.uid,
            remoteParty: "",
            datetimeStarted: "",
            microphoneIsMuted: false,
          }),
        "Mock WISPA did not receive request to unmute microphone"
      );
    });
  },
};

export const inCallWindow = {
  title: "In Call Window",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();
      mockWispa.sendActiveCallsList();

      await expectWithinTimeout(
        async () => (await app.client.getWindowCount()) === 1,
        "Window count did not return to 1 in preparation for next in-call window test"
      );

      await app.client.windowByIndex(0);

      mockWispa.data.contacts = [protoBilbo, protoPeter, protoGandalf];

      await app.client.refresh();
      await app.client.windowByIndex(0);
      await UI.midbar.contactList.waitForSomeContacts(3);

      const [, gandalf] = await UI.midbar.contactList.contacts();
      await gandalf.click();
      await waitForCondition(
        async () => (await UI.rightbar.contentHeaderPanel.contact.name()) === "Gandalf The ⚪"
      );

      mockWispa.data.activeCalls = [protoGandalfCall];
      mockWispa.sendActiveCall(protoGandalfCall.uid);

      await UI.rightbar.contentHeaderPanel.expectToBeInCall();
    });

    it("Appears when selecting a different contact", async () => {
      const contacts = await UI.midbar.contactList.contacts();
      await contacts[1].click();
      await waitForCondition(
        async () => (await UI.rightbar.contentHeaderPanel.contact.name()) === "Gandalf The ⚪"
      );
      await expectWithinTimeout(
        async () => (await app.client.getWindowCount()) === 2,
        "In call window did not appear within timeout"
      );

      await app.client.windowByIndex(1);
      await UI.inCallFrame.contact.waitForVisible();
    });

    it("Appears when blurring the main window", async () => {
      app.browserWindow.blur();

      await expectWithinTimeout(
        async () => (await app.client.getWindowCount()) === 2,
        "In call window did not appear within timeout after blurring main window"
      );

      await app.client.windowByIndex(1);
      await UI.inCallFrame.contact.waitForVisible();
    });

    // This test is skipped as something about the docking of the in-call window makes it flakey.
    // This is okay since we're expecting to do away with the in-call window until GA anyway
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip("Docks when clicking the dock button", async () => {
      // Select a different contact so we can verify the original is selected again when we dock
      const [, , peter] = await UI.midbar.contactList.contacts();
      await peter.click();
      await expectWithinTimeout(
        async () => (await UI.rightbar.contentHeaderPanel.contact.name()) === "Peter Parker",
        "Peter did not become selected contact after clicking him"
      );

      app.browserWindow.blur();
      await expectWithinTimeout(
        async () => (await app.client.getWindowCount()) === 2,
        "In call window did not appear after blurring main window"
      );

      await app.client.windowByIndex(1);
      await UI.inCallFrame.dockButton.click();

      await app.client.windowByIndex(0);
      await expectWithinTimeout(
        async () => app.browserWindow.isFocused(),
        "The main window did not focus after the in call window was docked"
      );
      await expectWithinTimeout(
        async () => (await UI.rightbar.contentHeaderPanel.contact.name()) === "Gandalf The ⚪",
        "The main window did not update its selected contact after the in call window was docked"
      );
    });

    it("Appears twice if there are two current calls", async () => {
      mockWispa.data.activeCalls = [protoBilboCall, protoGandalfCall];
      mockWispa.sendActiveCall(protoGandalfCall.uid);

      const contacts = await UI.midbar.contactList.contacts();
      await contacts[2].click();
      await expectWithinTimeout(
        async () => (await UI.rightbar.contentHeaderPanel.contact.name()) === "Peter Parker",
        "Peter did not become selected contact after clicking him"
      );
      await expectWithinTimeout(
        async () => (await app.client.getWindowCount()) === 3,
        "One or more in call windows did not appear after selecting a different contact"
      );

      // The in call windows could be listed in either order. Check the first one contains either
      // Bilbo or Gandalf, then set this variable to be the name of the other so that we can check the
      // second in call window contains it.
      let secondInCallWindowName: string;
      await app.client.windowByIndex(1);
      await expectWithinTimeout(
        async () => (await UI.windowType()) === WindowType.IN_CALL,
        "First extra window was not an in call window"
      );
      await expectWithinTimeout(async () => {
        const name = await UI.inCallFrame.contact.name();
        if (name === "Bilbo Baggins") {
          secondInCallWindowName = "Gandalf The ⚪";
          return true;
        } else if (name === "Gandalf The ⚪") {
          secondInCallWindowName = "Bilbo Baggins";
          return true;
        } else {
          return false;
        }
      }, "First in call window did not contain Bilbo or Gandalf");

      await app.client.windowByIndex(2);
      await expectWithinTimeout(
        async () => (await UI.windowType()) === WindowType.IN_CALL,
        "Second extra window was not an in call window"
      );
      await expectWithinTimeout(
        async () => (await UI.inCallFrame.contact.name()) === secondInCallWindowName,
        `Second in call window did not contain the correct name}`
      );
    });

    // ESLint wrongly thinks this test is in the same describe block as another of the same name
    // eslint-disable-next-line jest/no-identical-title
    it("should not display meeting button", async () => {
      mockWispa.data.settings = {
        ...mockWispa.data.settings,
        meetings: {
          enabled: false,
        },
      };
      mockWispa.sendSettings();

      app.browserWindow.blur();

      await expectWithinTimeout(
        async () => (await app.client.getWindowCount()) === 2,
        "In call window did not appear after blurring main window"
      );

      await app.client.windowByIndex(1);
      await UI.inCallFrame.contact.waitForVisible();

      await expectWithinTimeout(
        async () => (await UI.inCallFrame.inCallMeetingButton.isVisible()) === false,
        "Meeting Button was not hide"
      );
    });

    it("Hangs up when clicking the hang up button", async () => {
      app.browserWindow.blur();
      await expectWithinTimeout(
        async () => (await app.client.getWindowCount()) === 2,
        "In call window did not appear after blurring main window"
      );

      await app.client.windowByIndex(1);
      await UI.inCallFrame.hangUpButton.click();
      await expectWithinTimeout(
        () =>
          mockWispa.hasReceivedRequest("activecalls", "delete", {
            uid: protoGandalfCall.uid,
            remoteParty: "",
            datetimeStarted: "",
          }),
        "Mock Wispa did not receive call deletion request"
      );

      mockWispa.data.activeCalls = [];
      mockWispa.sendActiveCallsList();
      await expectWithinTimeout(
        async () => (await app.client.getWindowCount()) === 1,
        "In call window did not disappear after the corresponding activeCall was deleted"
      );
    });

    it("Shows tooltips", async () => {
      // Select a new contact to make the window pop out
      const contacts = await UI.midbar.contactList.contacts();
      await contacts[2].click();
      await expectWithinTimeout(
        async () => (await UI.rightbar.contentHeaderPanel.contact.name()) === "Peter Parker",
        "Peter did not become selected contact after clicking him"
      );
      app.browserWindow.blur();
      await expectWithinTimeout(
        async () => (await app.client.getWindowCount()) === 2,
        "In call window did not appear after blurring main window"
      );

      await app.client.windowByIndex(1);
      await expectWithinTimeout(
        async () => (await UI.windowType()) === WindowType.IN_CALL,
        "Could not select in-call window"
      );
      await expectWithinTimeout(
        async () => await UI.inCallFrame.isVisible(),
        "In-call window did not become visible"
      );

      const checkTooltip = async (button: Section, tooltipText: string): Promise<void> => {
        await button.hover();
        await expectWithinTimeout(async () => {
          // Wrap `getText` in a try/catch statement so that we don't error out if the tooltip does't
          // exist yet. It's not sufficient to wait for the tooltip to exist and then try to get its
          // text as if its the tooltip from the previous button then it's very possible for it to
          // disappear in between checking that it is shown and getting its text.
          try {
            return (await UI.tooltip.getText()) === tooltipText;
          } catch (err) {
            return false;
          }
        }, `Tooltip did not display text "${tooltipText}"`);
      };

      await checkTooltip(UI.inCallFrame.muteButton, "Mute");
      await checkTooltip(UI.inCallFrame.inCallMeetingButton, "Start meeting");
      await checkTooltip(UI.inCallFrame.holdButton, "Put on hold");
      await checkTooltip(UI.inCallFrame.hangUpButton, "Hang up");
      await checkTooltip(UI.inCallFrame.dockButton, "Dock window");
    });
  },
};

export const inCallBlurredMainWindow = {
  title: "In Call, blurred main window",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();
      mockWispa.data.contacts = [protoBilbo, protoPeter, protoGandalf];

      await app.client.refresh();
      await UI.midbar.contactList.waitForSomeContacts(3);
      const contacts = await UI.midbar.contactList.contacts();
      // Select Bilbo, who only has one phone number.
      await contacts[0].click();
      await expectWithinTimeout(async () => {
        return (await UI.rightbar.contentHeaderPanel.contact.name()) === "Bilbo Baggins";
      }, "Bilbo was not selected as the selectedContact within the expected timeout");

      mockWispa.data.activeCalls = [protoBilboCall];
      mockWispa.sendActiveCall(protoBilboCall.uid);
      await UI.rightbar.contentHeaderPanel.expectToBeInCall();

      /**
       * Simulates the main window is blurred (aka: not focused)
       * This was done because:
       * 1. making use of `app.client.windowByIndex(1)`, was moving the focus to the secondary window, and then `UI.rightbar` was not being found
       * 2. making use of `app.browserWindow.blur()`, was not triggering the mainWindow `onBlur` action, which makes the pop-out window to appear, and redux be updated
       *
       * ⚠⚠⚠ You should never usually need to send IPC messages directly to webContent!!! ⚠⚠⚠
       */
      app.webContents.send(ipcChannels.sendMainWindowEvent, { focus: false });
    });

    it("Should disable in-call-header-panel buttons, when the main window is blurred", async () => {
      const contentHeaderPanel = UI.rightbar.contentHeaderPanel;

      await expectWithinTimeout(
        async () => await contentHeaderPanel.addTransferButton.isDisabled(),
        "The button 'addTransferButton' is NOT disabled"
      );
      await expectWithinTimeout(
        async () => await contentHeaderPanel.muteButton.isDisabled(),
        "The button 'muteButton' is NOT disabled"
      );
      await expectWithinTimeout(
        async () => await contentHeaderPanel.inCallMeetingButton.isDisabled(),
        "The button 'inCallMeetingButton' is NOT disabled"
      );
      await expectWithinTimeout(
        async () => await contentHeaderPanel.recordButton.isDisabled(),
        "The button 'recordButton' is NOT disabled"
      );
      await expectWithinTimeout(
        async () => await contentHeaderPanel.holdButton.isDisabled(),
        "The button 'holdButton' is NOT disabled"
      );
      await expectWithinTimeout(
        async () => await contentHeaderPanel.hangUpButton.isDisabled(),
        "The button 'hangUpButton' is NOT disabled"
      );
      await expectWithinTimeout(
        async () => await contentHeaderPanel.inCallMoreButton.isDisabled(),
        "The button 'inCallMoreButton' is NOT disabled"
      );
    });

    // This test is skipped because currently the test fails with a false negative: Spectron
    // complaining that the clicking the hangupButton is intercepted by another element, which is
    // actually what we expect since we have an overlay over the panel.
    // Skipping this is OK for now because we're not delivering in-call UI for GA and writing a proper
    // test for this will need some investigation.
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip("Clicking a disabled button, shouldn't trigger the action of it", async () => {
      const contentHeaderPanel = UI.rightbar.contentHeaderPanel;

      await contentHeaderPanel.hangUpButton.click();

      /**
       * Pause is need to avoid the following "false positive" scenario:
       *
       * 1. By some reason, clicking the hang up button really triggers it
       *    actions and hang up the call (it should NOT do it, and that's
       *    what this test is trying to assert)
       * 2. As the wispa might take couple of time to be properly dispatched,
       *    the bellow assert would pass: `contentHeaderPanel.isInCall()`, as
       *    there were no plaint of time to it be hanged out.
       */
      await pause(1000);

      await contentHeaderPanel.expectToBeInCall();
    });
  },
};
