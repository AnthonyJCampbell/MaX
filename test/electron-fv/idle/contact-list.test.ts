// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Tests to be carried out when the app is idle
 */
import { protoBilbo, protoPeter, protoGandalf, protoNoName } from "shared/mocks/mock-contacts";
import { mutableCloneDeep } from "shared/mocks/ts-utils";

import { Key } from "test/electron-fv/utils/interface";
import { Application } from "spectron";
import { MockWispa } from "../../utils/mock-wispa";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UI } from "../utils/interface";

export const contactList = {
  title: "Contact list",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();
      await app.client.refresh();
    });

    it("has the correct labels", async () => {
      mockWispa.data.contacts = [protoBilbo, protoPeter, protoGandalf, protoNoName];
      mockWispa.sendContactsList();

      await UI.midbar.contactList.waitForSomeContacts(4);
      mockWispa.sendContactsList();
      expect(await UI.midbar.contactList.contacts()).toHaveLength(4);
      const [bilbo, gandalf, noName, peter] = await UI.midbar.contactList.contacts();

      expect(await bilbo.getAriaLabel()).toBe("Bilbo Baggins, Online - I'm Going On An Adventure!");
      expect(await gandalf.getAriaLabel()).toBe(
        "Gandalf The ⚪, In a call - 🧙‍♂️ 🔥 👹 ✔ ਅਨਾਨਾਸ, Watching availability"
      );
      expect(await noName.getAriaLabel()).toBe("No name");
      expect(await peter.getAriaLabel()).toBe("Peter Parker, Offline");
    });

    it("loads an empty contact list", async () => {
      mockWispa.data.contacts = [];
      mockWispa.sendContactsList();

      expect(await UI.midbar.contactList.contacts()).toHaveLength(0);
    });

    it("doesn't show favourites title when having no favourite contact", async () => {
      mockWispa.data.contacts = [protoBilbo, protoPeter, protoGandalf];
      mockWispa.sendContactsList();

      await UI.midbar.contactList.favourites.waitForNotVisible();
    });

    it("show favourites tile when having favourite contact", async () => {
      const bilbo = mutableCloneDeep(protoBilbo);
      bilbo.isFavourite = true;

      mockWispa.data.contacts = [bilbo, protoPeter, protoGandalf];
      mockWispa.sendContactsList();

      await UI.midbar.contactList.favourites.isVisible();
    });

    it("loads a full contact list in one go", async () => {
      mockWispa.data.contacts = [protoBilbo, protoPeter, protoGandalf];
      mockWispa.sendContactsList();
      await UI.midbar.contactList.waitForSomeContacts(3);

      await UI.midbar.contactList.expectToBe(["Bilbo Baggins", "Gandalf The ⚪", "Peter Parker"]);
      await UI.midbar.contactList.expectPresenceToBe([
        "Online - I'm Going On An Adventure!",
        "In a call - 🧙‍♂️ 🔥 👹 ✔ ਅਨਾਨਾਸ",
        "Offline",
      ]);
    });

    it("loads a full contact list one-by-one", async () => {
      mockWispa.data.contacts = [protoBilbo];
      mockWispa.sendContactUid(protoBilbo.uid);
      await UI.midbar.contactList.waitForSomeContacts(1);
      await UI.midbar.contactList.expectToBe(["Bilbo Baggins"]);
      await UI.midbar.contactList.expectPresenceToBe(["Online - I'm Going On An Adventure!"]);

      mockWispa.data.contacts = [protoBilbo, protoPeter];
      mockWispa.sendContactUid(protoPeter.uid);
      await UI.midbar.contactList.waitForSomeContacts(2);
      await UI.midbar.contactList.expectToBe(["Bilbo Baggins", "Peter Parker"]);
      await UI.midbar.contactList.expectPresenceToBe([
        "Online - I'm Going On An Adventure!",
        "Offline",
      ]);

      mockWispa.data.contacts = [protoBilbo, protoPeter, protoGandalf];
      mockWispa.sendContactUid(protoGandalf.uid);
      await UI.midbar.contactList.waitForSomeContacts(3);
      await UI.midbar.contactList.expectToBe(["Bilbo Baggins", "Gandalf The ⚪", "Peter Parker"]);
      await UI.midbar.contactList.expectPresenceToBe([
        "Online - I'm Going On An Adventure!",
        "In a call - 🧙‍♂️ 🔥 👹 ✔ ਅਨਾਨਾਸ",
        "Offline",
      ]);
    });

    /**
     * This component digs into the behaviour of the ArrowControl used for the contacts list.  These are
     * FV tests rather than UT due to the interactions between the control and other elements
     * meaning that we'd need more than a shallow render to test.
     */
    describe("Keyboard navigation", function () {
      beforeEach(async () => {
        mockWispa.reset();
        mockWispa.data.contacts = [protoBilbo, protoPeter, protoGandalf, protoNoName];

        await app.client.refresh();
        await UI.midbar.contactList.waitForSomeContacts(4);
      });

      it("rightbar updates when selecting 1st contact", async () => {
        const [bilbo, gandalf, , peter] = await UI.midbar.contactList.contacts();
        await bilbo.waitForVisible();
        await gandalf.waitForVisible();
        await peter.waitForVisible();

        // Down to the 1st contact (bilbo)
        // Enter to 'click'
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.profileButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.addButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.contactsButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.voicemailButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.bugButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.feedbackButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.midbar.searchBar.input.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.midbar.dialpad.waitForActive();
        await UI.pressKey([Key.TAB]);

        await bilbo.waitForActive();
        await UI.pressKey([Key.ENTER]);

        await UI.rightbar.contentHeaderPanel.expectWillHavePresence(
          "Online - I'm Going On An Adventure!"
        );
        await UI.rightbar.contentHeaderPanel.expectWillHaveName("Bilbo Baggins");
      });

      it("main pane updates when selecting 2nd contact via complete arrow cycle", async () => {
        const [bilbo, gandalf, noname, peter] = await UI.midbar.contactList.contacts();
        await bilbo.waitForVisible();
        await gandalf.waitForVisible();
        await noname.waitForVisible();
        await peter.waitForVisible();

        // Arrow down to the desired contact (cycling around takes 5 to get past favourites)
        // Enter to 'click' on the 2nd contact (gandalf)
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.profileButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.addButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.contactsButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.voicemailButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.bugButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.feedbackButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.midbar.searchBar.input.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.midbar.dialpad.waitForActive();
        await UI.pressKey([Key.TAB]);

        await bilbo.waitForActive();
        await UI.pressKey([Key.ARROW_DOWN]);
        await gandalf.waitForActive();
        await UI.pressKey([Key.ARROW_DOWN]);
        await noname.waitForActive();
        await UI.pressKey([Key.ARROW_DOWN]);
        await peter.waitForActive();
        await UI.pressKey([Key.ARROW_DOWN]);
        await bilbo.waitForActive();
        await UI.pressKey([Key.ARROW_DOWN]);
        await gandalf.waitForActive();
        await UI.pressKey([Key.ENTER]);

        await UI.rightbar.contentHeaderPanel.expectWillHavePresence(
          "In a call - 🧙‍♂️ 🔥 👹 ✔ ਅਨਾਨਾਸ"
        );
        await UI.rightbar.contentHeaderPanel.expectWillHaveName("Gandalf The ⚪");
      });

      it("main pane updates when selecting 3rd contact via UP", async () => {
        const [bilbo, gandalf, noname, peter] = await UI.midbar.contactList.contacts();
        await bilbo.waitForVisible();
        await gandalf.waitForVisible();
        await noname.waitForVisible();
        await peter.waitForVisible();

        // Arrow up to the desired contact
        // Enter to 'click' on the 3rd contact (no name)
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.profileButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.addButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.contactsButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.voicemailButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.bugButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.feedbackButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.midbar.searchBar.input.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.midbar.dialpad.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.pressKey([Key.ARROW_UP]);
        await peter.waitForActive();
        await UI.pressKey([Key.ARROW_UP]);
        await noname.waitForActive();
        await UI.pressKey([Key.ENTER]);

        await UI.rightbar.contentHeaderPanel.expectWillHavePresence("");
        await UI.rightbar.contentHeaderPanel.expectWillHaveName("No name");
      });

      it("updates when selecting the last contact via Key.END", async () => {
        const [bilbo, gandalf, noname, peter] = await UI.midbar.contactList.contacts();
        await bilbo.waitForVisible();
        await gandalf.waitForVisible();
        await noname.waitForVisible();
        await peter.waitForVisible();

        // End to get to the last contact
        // Enter to 'click' on the 1st contact (peter)
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.profileButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.addButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.contactsButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.voicemailButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.bugButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.feedbackButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.midbar.searchBar.input.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.midbar.dialpad.waitForActive();
        await UI.pressKey([Key.TAB]);
        await bilbo.waitForActive();
        await UI.pressKey([Key.END]);
        await peter.waitForActive();
        await UI.pressKey([Key.ENTER]);

        await UI.rightbar.contentHeaderPanel.expectWillHavePresence("Offline");
        await UI.rightbar.contentHeaderPanel.expectWillHaveName("Peter Parker");
      });

      it("updates when selecting the last contact via Key.PAGE_DOWN", async () => {
        const [bilbo, gandalf, noname, peter] = await UI.midbar.contactList.contacts();
        await bilbo.waitForVisible();
        await gandalf.waitForVisible();
        await noname.waitForVisible();
        await peter.waitForVisible();

        // End to get to the last contact
        // Enter to 'click' on the 1st contact (peter)
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.profileButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.addButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.contactsButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.voicemailButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.bugButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.feedbackButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.midbar.searchBar.input.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.midbar.dialpad.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.pressKey([Key.PAGE_DOWN]);
        await peter.waitForActive();
        await UI.pressKey([Key.ENTER]);

        await UI.rightbar.contentHeaderPanel.expectWillHavePresence("Offline");
        await UI.rightbar.contentHeaderPanel.expectWillHaveName("Peter Parker");
      });

      it("updates when selecting the first contact via Key.HOME", async () => {
        const [bilbo, gandalf, noname, peter] = await UI.midbar.contactList.contacts();
        await bilbo.waitForVisible();
        await gandalf.waitForVisible();
        await noname.waitForVisible();
        await peter.waitForVisible();

        // Arrow once to get off the 1st item
        // Home to get back to the 1st item (bilbo)
        // Enter to 'click' on it
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.profileButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.addButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.contactsButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.voicemailButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.bugButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.feedbackButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.midbar.searchBar.input.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.midbar.dialpad.waitForActive();
        await UI.pressKey([Key.TAB]);

        await bilbo.waitForActive();
        await UI.pressKey([Key.ARROW_DOWN]);
        await gandalf.waitForActive();
        await UI.pressKey([Key.HOME]);
        // await UI.midbar.contactList.favourites.waitForActive();
        // await UI.pressKey([Key.ARROW_DOWN]);
        await bilbo.waitForActive();
        await UI.pressKey([Key.ENTER]);

        await UI.rightbar.contentHeaderPanel.expectWillHavePresence(
          "Online - I'm Going On An Adventure!"
        );
        await UI.rightbar.contentHeaderPanel.expectWillHaveName("Bilbo Baggins");
      });

      it("updates when selecting the first contact via Key.PAGE_UP", async () => {
        const [bilbo, gandalf, noname, peter] = await UI.midbar.contactList.contacts();
        await bilbo.waitForVisible();
        await gandalf.waitForVisible();
        await noname.waitForVisible();
        await peter.waitForVisible();

        // Arrow down twice to get off the 1st item
        // Page up to get back to the 1st item (favourites toggle)
        // Arrow down to the 1st contact (bilbo)
        // Enter to 'click' on it
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.profileButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.addButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.contactsButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.voicemailButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.bugButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.feedbackButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.midbar.searchBar.input.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.midbar.dialpad.waitForActive();
        await UI.pressKey([Key.TAB]);

        await bilbo.waitForActive();
        await UI.pressKey([Key.ARROW_DOWN]);
        await gandalf.waitForActive();
        await UI.pressKey([Key.PAGE_UP]);
        await UI.pressKey([Key.ARROW_DOWN]);
        await bilbo.waitForActive();
        await UI.pressKey([Key.ENTER]);

        await UI.rightbar.contentHeaderPanel.expectWillHavePresence(
          "Online - I'm Going On An Adventure!"
        );
        await UI.rightbar.contentHeaderPanel.expectWillHaveName("Bilbo Baggins");
      });
    });
  },
};
