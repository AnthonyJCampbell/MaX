// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Tests to be carried out when the app is idle
 */
import { formatPhoneNumber } from "components/utils/phone-formatter";
import { protoBilbo, protoPeter, protoGandalf } from "shared/mocks/mock-contacts";
import {
  protoMissedHistoricCall,
  protoInboundHistoricCall,
  protoOutboundHistoricCall,
} from "shared/mocks/mock-historic-calls";
import { mutableCloneDeep } from "shared/mocks/ts-utils";

import { expectWithinTimeout } from "test/utils/utils";
import { Key } from "test/electron-fv/utils/interface";
import { Application } from "spectron";
import { MockWispa } from "../../utils/mock-wispa";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UI } from "../utils/interface";

export const recentCallsList = {
  title: "Recent Calls List",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();
      mockWispa.data.contacts = [protoBilbo, protoPeter, protoGandalf];
      mockWispa.data.historicCalls = [
        protoMissedHistoricCall,
        protoInboundHistoricCall,
        protoOutboundHistoricCall,
      ];

      await app.client.refresh();
      await UI.midbar.contactList.waitForSomeContacts(1);
    });

    it("has the correct labels", async () => {
      await UI.sidebar.callsButton.click();
      await UI.midbar.callList.waitForNCalls(3);

      const [call1, call2, call3] = await UI.midbar.callList.calls();

      expect(await call1.getAriaLabel()).toBe(
        `New, Missed call from Gandalf The ⚪, In a call at 12/1/20, ${formatPhoneNumber(
          protoMissedHistoricCall.remoteParty,
          "GB"
        )}, Mobile, Watching availability`
      );
      expect(await call2.getAriaLabel()).toBe(
        `Incoming call from Peter Parker, Offline at 1/31/19, ${formatPhoneNumber(
          protoInboundHistoricCall.remoteParty,
          "GB"
        )}, Other`
      );
      expect(await call3.getAriaLabel()).toBe(
        `Outgoing call from Gandalf The ⚪, In a call at 11/22/18, ${formatPhoneNumber(
          protoOutboundHistoricCall.remoteParty,
          "GB"
        )}, Mobile, Watching availability`
      );
    });

    it("displays the name, time and remote DN for each call", async () => {
      await UI.sidebar.callsButton.click();
      await UI.midbar.callList.waitForNCalls(3);

      const [call1, call2, call3] = await UI.midbar.callList.calls();
      expect(await call1.remoteDN()).toBe(
        formatPhoneNumber(protoMissedHistoricCall.remoteParty, "GB") + " (Mobile)"
      );
      expect(await call1.name()).toBe("Gandalf The ⚪");
      expect(await call1.time()).toBe("12/1/20");
      // TODO check type icon

      expect(await call2.remoteDN()).toBe(
        formatPhoneNumber(protoInboundHistoricCall.remoteParty, "GB") + " (Other)"
      );
      expect(await call2.name()).toBe("Peter Parker");
      expect(await call2.time()).toBe("1/31/19");
      // TODO check type icon

      expect(await call3.remoteDN()).toBe(
        formatPhoneNumber(protoOutboundHistoricCall.remoteParty, "GB") + " (Mobile)"
      );
      expect(await call3.name()).toBe("Gandalf The ⚪");
      expect(await call3.time()).toBe("11/22/18");
      // TODO check type icon
    });

    it("loads an empty calls list", async () => {
      mockWispa.data.historicCalls = [];
      mockWispa.sendCallHistoryList();

      expect(await UI.midbar.callList.calls()).toHaveLength(0);
    });

    it("updates with extra calls as they arrive", async () => {
      await UI.sidebar.callsButton.click();
      await UI.midbar.callList.waitForNCalls(3);

      const newProtoOutboundHistoricCall = mutableCloneDeep(protoOutboundHistoricCall);
      newProtoOutboundHistoricCall.uid = "new-uid";
      newProtoOutboundHistoricCall.remoteParty = protoBilbo.phone[0].value;
      newProtoOutboundHistoricCall.datetimeStarted = "2021-01-31T21:13:42.486Z";

      mockWispa.data.historicCalls = [
        ...mockWispa.data.historicCalls,
        newProtoOutboundHistoricCall,
      ];
      mockWispa.sendHistoricCall(newProtoOutboundHistoricCall.uid);

      await UI.midbar.callList.waitForNCalls(4);
      await UI.midbar.callList.expectToBe([
        "Bilbo Baggins",
        "Gandalf The ⚪",
        "Peter Parker",
        "Gandalf The ⚪",
      ]);
    });

    it("updates, removing calls that are deleted", async () => {
      await UI.sidebar.callsButton.click();
      await UI.midbar.callList.waitForNCalls(3);

      mockWispa.deleteHistoricCall(protoMissedHistoricCall.uid);

      await UI.midbar.callList.waitForNCalls(2);
      await UI.midbar.callList.expectToBe(["Peter Parker", "Gandalf The ⚪"]);
    });

    it("rightbar and attention indicators update when clicking a call", async () => {
      // Use a longer calls list with 2 missed calls
      const newProtoMissedHistoricCall = mutableCloneDeep(protoMissedHistoricCall);
      newProtoMissedHistoricCall.uid = "new-missed-call-uid";
      newProtoMissedHistoricCall.remoteParty = protoBilbo.phone[0].value;
      newProtoMissedHistoricCall.datetimeStarted = "2022-01-31T21:13:42.486Z";

      mockWispa.data.historicCalls = [
        protoMissedHistoricCall,
        protoInboundHistoricCall,
        protoOutboundHistoricCall,
        newProtoMissedHistoricCall,
      ];

      await app.client.refresh();
      await UI.midbar.contactList.waitForSomeContacts();

      await UI.sidebar.callsButton.click();
      await UI.midbar.callList.waitForNCalls(4);
      const [call1] = await UI.midbar.callList.calls();

      // Check the attention dot is present for the missed call
      expect(await call1.name()).toBe("Bilbo Baggins");
      expect(await call1.attendState()).toBeTruthy();

      // Check the sidebar button has a badge for the two missed calls
      await expectWithinTimeout(async () => {
        return (await UI.sidebar.callsButton.getText()) === "2";
      }, "Sidebar missed calls counter wrong");

      await call1.click();

      // Check the right panel updates
      await UI.rightbar.contentHeaderPanel.expectWillHavePresence(
        "Online - I'm Going On An Adventure!"
      );
      await UI.rightbar.contentHeaderPanel.expectWillHaveName("Bilbo Baggins");

      // And check the attention dot disappears
      expect(await call1.name()).toBe("Bilbo Baggins");
      expect(await call1.attendState()).toBeFalsy();

      // Check the sidebar button badge counter has decreased by 1
      await expectWithinTimeout(async () => {
        return (await UI.sidebar.callsButton.getText()) === "1";
      }, "Sidebar missed calls counter has not been updated within timeout");
    });

    it("rightbar missed calls indicator updates when clicking away from the calls tab", async () => {
      // Use a longer calls list with 2 missed calls
      const newProtoMissedHistoricCall = mutableCloneDeep(protoMissedHistoricCall);
      newProtoMissedHistoricCall.uid = "new-missed-call-uid";
      newProtoMissedHistoricCall.remoteParty = protoBilbo.phone[0].value;
      newProtoMissedHistoricCall.datetimeStarted = "2022-01-31T21:13:42.486Z";

      mockWispa.data.historicCalls = [
        protoMissedHistoricCall,
        protoInboundHistoricCall,
        protoOutboundHistoricCall,
        newProtoMissedHistoricCall,
      ];

      await app.client.refresh();
      await UI.midbar.contactList.waitForSomeContacts();

      await UI.sidebar.callsButton.click();
      await expectWithinTimeout(
        async () => await UI.midbar.callList.isVisible(),
        "Call list did not become visible"
      );

      // Check the sidebar button has a badge for the single missed call
      await expectWithinTimeout(
        async () => (await UI.sidebar.callsButton.getText()) === "2",
        "Sidebar missed calls counter wrong did not become 2"
      );

      await UI.sidebar.contactsButton.click();
      await expectWithinTimeout(
        async () => await UI.midbar.contactList.isVisible(),
        "Contact list did not become visible"
      );

      await expectWithinTimeout(
        async () => (await UI.sidebar.callsButton.getText()) === "",
        "Sidebar missed calls counter was not cleared"
      );
    });

    it("Clicking a non-contact historic call opens up contact details in Pane C", async () => {
      const nonContactMissedHistoricCall = mutableCloneDeep(protoMissedHistoricCall);
      nonContactMissedHistoricCall.uid = "new-missed-call-uid";
      nonContactMissedHistoricCall.remoteParty = "0620760661";

      mockWispa.data.historicCalls = [nonContactMissedHistoricCall];

      await app.client.refresh();
      await UI.midbar.contactList.waitForSomeContacts();

      await UI.sidebar.callsButton.click();
      await expectWithinTimeout(
        async () => await UI.midbar.callList.isVisible(),
        "Call list did not become visible"
      );

      const callBlock = (await UI.midbar.callList.calls())[0];
      await callBlock.click();

      await expectWithinTimeout(
        async () => await UI.rightbar.contactPane.isVisible(),
        "Contact Pane did not become visible"
      );

      expect(await UI.rightbar.conversationTabButton.isVisible()).toBe(false);

      expect(await UI.rightbar.contactDetailsTabButton.isVisible()).toBe(false);

      expect(await UI.rightbar.contactPane.addAsAContactButton.isVisible()).toBe(true);
    });

    /**
     * This component digs into the behaviour of the ArrowControl used for the contacts list.  These are
     * FV tests rather than UT due to the interactions between the control and other elements
     * meaning that we'd need more than a shallow render to test.
     */
    describe("Keyboard navigation", function () {
      beforeEach(async () => {
        mockWispa.reset();
        mockWispa.data.contacts = [protoPeter, protoBilbo, protoGandalf];
        mockWispa.data.historicCalls = [
          protoMissedHistoricCall,
          protoInboundHistoricCall,
          protoOutboundHistoricCall,
        ];

        await app.client.refresh();
        await UI.midbar.contactList.waitForSomeContacts(1);
      });

      it("rightbar updates when selecting 1st call", async () => {
        await UI.sidebar.callsButton.click();
        await UI.midbar.callList.waitForNCalls(3);
        const [call1] = await UI.midbar.callList.calls();

        // Tab to the 1st call, then Enter to select
        await UI.midbar.searchBar.input.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.midbar.dialpad.waitForActive();
        await UI.pressKey([Key.TAB]);
        await call1.waitForActive();
        await UI.pressKey([Key.ENTER]);

        await UI.rightbar.contentHeaderPanel.expectWillHavePresence(
          "In a call - 🧙‍♂️ 🔥 👹 ✔ ਅਨਾਨਾਸ"
        );
        await UI.rightbar.contentHeaderPanel.expectWillHaveName("Gandalf The ⚪");
      });

      it("rightbar updates when selecting last call via UP", async () => {
        await UI.sidebar.callsButton.click();
        await UI.midbar.callList.waitForNCalls(3);
        const [call1, , call3] = await UI.midbar.callList.calls();

        // Tab past the VM button to the 1st call, then Enter to select
        await UI.midbar.searchBar.input.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.midbar.dialpad.waitForActive();
        await UI.pressKey([Key.TAB]);
        await call1.waitForActive();
        await UI.pressKey([Key.ARROW_UP]);
        await call3.waitForActive();
        await UI.pressKey([Key.ENTER]);

        await UI.rightbar.contentHeaderPanel.expectWillHavePresence(
          "In a call - 🧙‍♂️ 🔥 👹 ✔ ਅਨਾਨਾਸ"
        );
        await UI.rightbar.contentHeaderPanel.expectWillHaveName("Gandalf The ⚪");
      });
    });
  },
};
