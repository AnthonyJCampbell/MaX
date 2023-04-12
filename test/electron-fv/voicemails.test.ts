// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Voicemail related Electron FV tests
 */
import { expectWithinTimeout, waitForCondition } from "test/utils/utils";
import { Application } from "spectron";
import { MockWispa } from "../utils/mock-wispa";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UI } from "./utils/interface";

export const voicemailButton = {
  title: "Voicemail button",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();
      await app.client.refresh();

      await waitForCondition(async () => {
        return await UI.sidebar.voicemailButton.isVisible();
      });
    });

    it("hides the new voicemail badge when there are none", async () => {
      mockWispa.data.voicemailFaxCount = { newMessages: 0 };
      mockWispa.sendVoicemailFaxCount();

      // Check the sidebar button badge is hidden
      await expectWithinTimeout(async () => {
        return (await UI.sidebar.voicemailButton.getText()) === "";
      }, "Sidebar new voicemails counter is not zero within timeout");
      expect(await UI.sidebar.voicemailButton.getAriaLabel()).toBe("Voicemail");
    });

    it("Shows the new voicemail badge when there are 1", async () => {
      mockWispa.data.voicemailFaxCount = { newMessages: 1 };
      mockWispa.sendVoicemailFaxCount();

      // Check the sidebar button badge is hidden
      await expectWithinTimeout(async () => {
        return (await UI.sidebar.voicemailButton.getText()) === "1";
      }, "Sidebar new voicemails counter is not 1 within timeout");
      expect(await UI.sidebar.voicemailButton.getAriaLabel()).toBe("Voicemail, 1 new");
    });

    it("Shows the new voicemail badge when there are 10", async () => {
      mockWispa.data.voicemailFaxCount = { newMessages: 10 };
      mockWispa.sendVoicemailFaxCount();

      // Check the sidebar button badge is hidden
      await expectWithinTimeout(async () => {
        return (await UI.sidebar.voicemailButton.getText()) === "9+";
      }, "Sidebar new voicemails counter is not 1 within timeout");
      expect(await UI.sidebar.voicemailButton.getAriaLabel()).toBe("Voicemail, 9+ new");
    });

    it('Sends a "View voicemail" request to WISPA when clicking the voicemail button', async () => {
      await UI.sidebar.voicemailButton.click();

      await expectWithinTimeout(() => {
        return mockWispa.hasReceivedRequest("voicemails", "action", {
          viewMessages: true,
        });
      }, "Mock WISPA did not receive voicemail action 'viewMessages' request");
    });
  },
};
