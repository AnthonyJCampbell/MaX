// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Tests to be carried out when the app is idle
 */
import { expectWithinTimeout } from "test/utils/utils";
import { Key } from "test/electron-fv/utils/interface";
import { Application } from "spectron";
import { MockWispa } from "../../utils/mock-wispa";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UI } from "../utils/interface";

export const sidebar = {
  title: "Sidebar",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();
      await app.client.refresh();
      await expectWithinTimeout(
        async () => await UI.sidebar.isVisible(),
        "App is not rendered under expected timeout"
      );
    });

    it("has the correct labels", async () => {
      expect(await UI.sidebar.contactsButton.getAriaLabel()).toBe("Contacts");
      expect(await UI.sidebar.callsButton.getAriaLabel()).toBe("Calls");
      expect(await UI.sidebar.chatsButton.getAriaLabel()).toBe("Chats");
      expect(await UI.sidebar.meetingsButton.getAriaLabel()).toBe("Meetings");
      expect(await UI.sidebar.voicemailButton.getAriaLabel()).toBe("Voicemail");
      expect(await UI.sidebar.bugButton.getAriaLabel()).toBe("Report a bug");
      expect(await UI.sidebar.feedbackButton.getAriaLabel()).toBe("Send feedback");
    });

    it("should not present meeting button", async () => {
      mockWispa.data.settings = {
        ...mockWispa.data.settings,
        meetings: {
          enabled: false,
        },
      };
      mockWispa.sendSettings();

      await expectWithinTimeout(
        async () => (await UI.sidebar.meetingsButton.isVisible()) === false,
        "Meeting Button was not hide"
      );
    });

    it("displays contacts when selecting contacts tab", async () => {
      await UI.sidebar.callsButton.click();
      await expectWithinTimeout(
        async () => await UI.midbar.callList.isVisible(),
        "Call list did not become visible"
      );

      await UI.sidebar.contactsButton.click();
      await expectWithinTimeout(
        async () => await UI.midbar.contactList.isVisible(),
        "Contact list did not become visible"
      );
    });

    it("displays calls when selecting calls tab", async () => {
      expect(await UI.midbar.callList.isVisible()).toBe(false);

      await UI.sidebar.callsButton.click();
      await UI.midbar.callList.waitForVisible();

      expect(await UI.midbar.callList.isVisible()).toBe(true);
    });

    it("displays chats when selecting chats tab", async () => {
      expect(await UI.midbar.chatList.isVisible()).toBe(false);

      await UI.sidebar.chatsButton.click();
      await UI.midbar.chatList.waitForVisible();

      expect(await UI.midbar.chatList.isVisible()).toBe(true);
    });

    it("displays meetings buttons when selecting meetings tab", async () => {
      for (const button of UI.midbar.meetingManagement.buttons()) {
        expect(await button.isVisible()).toBe(false);
      }

      await UI.sidebar.meetingsButton.click();
      await UI.midbar.meetingManagement.waitForVisible();

      for (const button of UI.midbar.meetingManagement.buttons()) {
        expect(await button.isVisible()).toBe(true);
      }
    });

    it("focuses the search box when selecting contacts tab", async () => {
      const input = UI.midbar.searchBar.input;

      await UI.sidebar.callsButton.click();
      await expectWithinTimeout(
        async () => await UI.midbar.callList.isVisible(),
        "Call list did not become visible"
      );

      // Remove focus from search box by bringing up the avatar menu
      await UI.sidebar.profileButton.click();
      await expectWithinTimeout(
        async () => await UI.sidebar.avatarMenu.isVisible(),
        "Avatar menu did not appear"
      );
      await UI.sidebar.profileButton.click();
      await expectWithinTimeout(
        async () => (await UI.sidebar.avatarMenu.isVisible()) === false,
        "Avatar menu did not disappear"
      );
      await expectWithinTimeout(
        async () => (await input.isActive()) === false,
        "Search box did not lose focus"
      );

      await UI.sidebar.contactsButton.click();
      await expectWithinTimeout(
        async () => await UI.midbar.contactList.isVisible(),
        "Contact list did not become visible"
      );

      await expectWithinTimeout(
        async () => await input.isActive(),
        "Search box did not gain focus"
      );
    });

    /**
     * This component digs into the behaviour of the ArrowControl used for the sidebar.  These are
     * FV tests rather than UT due to the interactions between the control and other elements
     * meaning that we'd need more than a shallow render to test.
     */
    describe("Keyboard navigation", function () {
      it("displays contacts as the active mid pane via the keyboard", async () => {
        // The following key presses are equivalent to:
        // UI.sidebar.contactsButton.click();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.profileButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.addButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.contactsButton.waitForActive();
        await UI.pressKey([Key.ENTER]);
        await UI.midbar.searchBar.input.waitForActive();

        await UI.midbar.contactList.waitForVisible();
        expect(await UI.midbar.contactList.isVisible()).toBe(true);
      });

      it("displays calls as the active mid pane via the keyboard", async () => {
        // The following key presses are equivalent to:
        // UI.sidebar.callsButton.click();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.profileButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.addButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.contactsButton.waitForActive();
        await UI.pressKey([Key.ARROW_DOWN]);
        await UI.sidebar.callsButton.waitForActive();
        await UI.pressKey([Key.ENTER]);
        await UI.midbar.searchBar.input.waitForActive();

        await UI.midbar.callList.waitForVisible();
        expect(await UI.midbar.callList.isVisible()).toBe(true);
      });

      it("displays chats as the active mid pane via the keyboard", async () => {
        // The following key presses are equivalent to:
        // UI.sidebar.chatsButton.click();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.profileButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.addButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.contactsButton.waitForActive();
        await UI.pressKey([Key.ARROW_DOWN]);
        await UI.sidebar.callsButton.waitForActive();
        await UI.pressKey([Key.ARROW_DOWN]);
        await UI.sidebar.chatsButton.waitForActive();
        await UI.pressKey([Key.ENTER]);
        await UI.midbar.searchBar.input.waitForActive();

        await UI.midbar.chatList.waitForVisible();

        expect(await UI.midbar.chatList.isVisible()).toBe(true);
      });

      it("displays meetings as the active mid pane via the keyboard", async () => {
        for (const button of UI.midbar.meetingManagement.buttons()) {
          expect(await button.isVisible()).toBe(false);
        }

        // The following key presses are equivalent to:
        // UI.sidebar.meetingsButton.click();
        // Down and right should be interchangeable
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.profileButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.addButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.contactsButton.waitForActive();
        await UI.pressKey([Key.ARROW_DOWN]);
        await UI.sidebar.callsButton.waitForActive();
        await UI.pressKey([Key.ARROW_DOWN]);
        await UI.sidebar.chatsButton.waitForActive();
        await UI.pressKey([Key.ARROW_RIGHT]);
        await UI.sidebar.meetingsButton.waitForActive();
        await UI.pressKey([Key.ENTER]);

        await UI.midbar.meetingManagement.waitForVisible();

        for (const button of UI.midbar.meetingManagement.buttons()) {
          expect(await button.isVisible()).toBe(true);
        }
      });

      it("displays contacts instead of meetings as the active mid pane, when meetings button is hidden", async () => {
        mockWispa.data.settings = {
          ...mockWispa.data.settings,
          meetings: {
            enabled: false,
          },
        };
        mockWispa.sendSettings();

        await expectWithinTimeout(
          async () => (await UI.sidebar.meetingsButton.isVisible()) === false,
          "Meeting Button was not hide"
        );

        // The following key presses are equivalent to:
        // UI.sidebar.meetingsButton.click();
        // Down and right should be interchangeable
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.profileButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.addButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.contactsButton.waitForActive();
        await UI.pressKey([Key.ARROW_DOWN]);
        await UI.sidebar.callsButton.waitForActive();
        await UI.pressKey([Key.ARROW_DOWN]);
        await UI.sidebar.chatsButton.waitForActive();
        await UI.pressKey([Key.ARROW_DOWN]);
        await UI.sidebar.contactsButton.waitForActive();
      });

      it("displays contacts as the active mid pane, cycling around with ARROW_DOWN/RIGHT", async () => {
        // The following key presses are equivalent to:
        // UI.sidebar.contactsButton.click();
        // Down and right should be interchangeable
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.profileButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.addButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.contactsButton.waitForActive();
        await UI.pressKey([Key.ARROW_DOWN]);
        await UI.sidebar.callsButton.waitForActive();
        await UI.pressKey([Key.ARROW_DOWN]);
        await UI.sidebar.chatsButton.waitForActive();
        await UI.pressKey([Key.ARROW_RIGHT]);
        await UI.sidebar.meetingsButton.waitForActive();
        await UI.pressKey([Key.ARROW_RIGHT]);
        await UI.sidebar.contactsButton.waitForActive();
        await UI.pressKey([Key.SPACE]);
        await UI.midbar.searchBar.input.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.midbar.dialpad.waitForActive();
        await UI.midbar.contactList.waitForVisible();
        expect(await UI.midbar.contactList.isVisible()).toBe(true);
      });

      it("displays contacts as the active mid pane, cycling around with ARROW_UP/LEFT", async () => {
        // The following key presses are equivalent to:
        // UI.sidebar.contactsButton.click();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.profileButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.addButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.contactsButton.waitForActive();
        await UI.pressKey([Key.ARROW_LEFT]);
        await UI.sidebar.meetingsButton.waitForActive();
        await UI.pressKey([Key.ARROW_UP]);
        await UI.sidebar.chatsButton.waitForActive();
        await UI.pressKey([Key.ARROW_LEFT]);
        await UI.sidebar.callsButton.waitForActive();
        await UI.pressKey([Key.ARROW_UP]);
        await UI.sidebar.contactsButton.waitForActive();
        await UI.pressKey([Key.SPACE]);
        await UI.midbar.searchBar.input.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.midbar.dialpad.waitForActive();
        await UI.midbar.contactList.waitForVisible();
        expect(await UI.midbar.contactList.isVisible()).toBe(true);
      });

      it("displays contacts as the active mid pane, using PAGE_UP", async () => {
        // The following key presses are equivalent to:
        // UI.sidebar.contactsButton.click();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.profileButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.addButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.contactsButton.waitForActive();
        await UI.pressKey([Key.ARROW_UP]);
        await UI.sidebar.meetingsButton.waitForActive();
        await UI.pressKey([Key.PAGE_UP]);
        await UI.sidebar.contactsButton.waitForActive();
        await UI.pressKey([Key.ENTER]);
        await UI.midbar.searchBar.input.waitForActive();

        await UI.midbar.contactList.waitForVisible();
        expect(await UI.midbar.contactList.isVisible()).toBe(true);
      });

      it("displays meetings as the active mid pane, using PAGE_DOWN", async () => {
        for (const button of UI.midbar.meetingManagement.buttons()) {
          expect(await button.isVisible()).toBe(false);
        }

        // The following key presses are equivalent to:
        // UI.sidebar.meetingsButton.click();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.profileButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.addButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.contactsButton.waitForActive();
        await UI.pressKey([Key.PAGE_DOWN]);
        await UI.sidebar.meetingsButton.waitForActive();
        await UI.pressKey([Key.SPACE]);

        await UI.midbar.meetingManagement.waitForVisible();

        for (const button of UI.midbar.meetingManagement.buttons()) {
          expect(await button.isVisible()).toBe(true);
        }
      });

      it("displays contacts as the active mid pane, using HOME", async () => {
        // The following key presses are equivalent to:
        // UI.sidebar.contactsButton.click();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.profileButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.addButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.contactsButton.waitForActive();
        await UI.pressKey([Key.ARROW_UP]);
        await UI.sidebar.meetingsButton.waitForActive();
        await UI.pressKey([Key.HOME]);
        await UI.sidebar.contactsButton.waitForActive();
        await UI.pressKey([Key.ENTER]);
        await UI.midbar.searchBar.input.waitForActive();

        await UI.midbar.contactList.waitForVisible();
        expect(await UI.midbar.contactList.isVisible()).toBe(true);
      });

      it("displays meetings as the active mid pane, using END", async () => {
        for (const button of UI.midbar.meetingManagement.buttons()) {
          expect(await button.isVisible()).toBe(false);
        }

        // The following key presses are equivalent to:
        // UI.sidebar.meetingsButton.click();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.profileButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.addButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.contactsButton.waitForActive();
        await UI.pressKey([Key.END]);
        await UI.sidebar.meetingsButton.waitForActive();
        await UI.pressKey([Key.ENTER]);
        await UI.midbar.meetingManagement.waitForVisible();

        for (const button of UI.midbar.meetingManagement.buttons()) {
          expect(await button.isVisible()).toBe(true);
        }
      });

      it("displays calls as the active mid pane via TAB overshoot", async () => {
        // The following key presses are equivalent to:
        // UI.sidebar.callsButton.click();
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
        await UI.pressKey([Key.SHIFT, Key.TAB]);
        await UI.sidebar.feedbackButton.waitForActive();
        await UI.pressKey([Key.SHIFT, Key.TAB]);
        await UI.sidebar.bugButton.waitForActive();
        await UI.pressKey([Key.SHIFT, Key.TAB]);
        await UI.sidebar.voicemailButton.waitForActive();
        await UI.pressKey([Key.SHIFT, Key.TAB]);
        await UI.sidebar.contactsButton.waitForActive();
        await UI.pressKey([Key.ARROW_DOWN]);
        await UI.sidebar.callsButton.waitForActive();
        await UI.pressKey([Key.ENTER]);
        await UI.midbar.searchBar.input.waitForActive();

        await UI.midbar.callList.waitForVisible();
        expect(await UI.midbar.callList.isVisible()).toBe(true);
      });

      it("remembers the tab position after losing and regaining the focus", async () => {
        // The following key presses are equivalent to:
        // UI.sidebar.callsButton.click();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.profileButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.addButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.contactsButton.waitForActive();
        await UI.pressKey([Key.ARROW_DOWN]);
        await UI.sidebar.callsButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.voicemailButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.bugButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.sidebar.feedbackButton.waitForActive();
        await UI.pressKey([Key.TAB]);
        await UI.midbar.searchBar.input.waitForActive();
        await UI.pressKey([Key.SHIFT, Key.TAB]);
        await UI.sidebar.feedbackButton.waitForActive();
        await UI.pressKey([Key.SHIFT, Key.TAB]);
        await UI.sidebar.bugButton.waitForActive();
        await UI.pressKey([Key.SHIFT, Key.TAB]);
        await UI.sidebar.voicemailButton.waitForActive();
        await UI.pressKey([Key.SHIFT, Key.TAB]);
        await UI.sidebar.callsButton.waitForActive();
        await UI.pressKey([Key.ENTER]);
        await UI.midbar.searchBar.input.waitForActive();

        await UI.midbar.callList.waitForVisible();
        expect(await UI.midbar.callList.isVisible()).toBe(true);
      });

      /**
       * It would be nice to have a programmatic version of this test too,
       * calling focus() instead of.click(), but that method is not available in webdriver.
       */
      it("uses the mouse selection to update the tab position", async () => {
        // Note this will automatically move focus to the mid pane search box
        await UI.sidebar.callsButton.click();
        await UI.midbar.searchBar.input.waitForActive();
        await UI.midbar.callList.waitForVisible();

        await UI.pressKey([Key.SHIFT, Key.TAB]);
        await UI.sidebar.feedbackButton.waitForActive();
        await UI.pressKey([Key.SHIFT, Key.TAB]);
        await UI.sidebar.bugButton.waitForActive();
        await UI.pressKey([Key.SHIFT, Key.TAB]);
        await UI.sidebar.voicemailButton.waitForActive();
        await UI.pressKey([Key.SHIFT, Key.TAB]);
        await UI.sidebar.callsButton.waitForActive();
        await UI.pressKey([Key.ARROW_DOWN]);
        await UI.sidebar.chatsButton.waitForActive();
        await UI.pressKey([Key.ENTER]);
        await UI.midbar.searchBar.input.waitForActive();

        await UI.midbar.chatList.waitForVisible();
        expect(await UI.midbar.chatList.isVisible()).toBe(true);
      });
    });
  },
};
