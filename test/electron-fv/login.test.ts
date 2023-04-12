// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Login related Electron FV tests
 */
import { LoginState } from "shared/types";
import { Application } from "spectron";
import { MockWispa } from "../utils/mock-wispa";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UI } from "./utils/interface";
import { expectWithinTimeout } from "../utils/utils";

export const startupScreen = {
  title: "Startup screen",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();
      await app.client.refresh();
    });

    it("Displays when user is logged out", async () => {
      mockWispa.data.account.loginState = LoginState.LOGGED_OUT;
      mockWispa.sendAccount();

      await expectWithinTimeout(
        async () => await UI.startupScreen.isVisible(),
        "Startup screen did not become visible"
      );

      expect(await UI.sidebar.isVisible()).toBe(false);
      expect(await UI.midbar.isVisible()).toBe(false);
      expect(await UI.rightbar.isVisible()).toBe(false);
    });

    it("Doesn't display when user is logged in", async () => {
      mockWispa.data.account.loginState = LoginState.LOGGED_IN;
      mockWispa.sendAccount();

      await expectWithinTimeout(async () => {
        return (
          (await UI.sidebar.isVisible()) &&
          (await UI.midbar.isVisible()) &&
          (await UI.rightbar.isVisible())
        );
      }, "Main UI did not become visible");

      expect(await UI.startupScreen.isVisible()).toBe(false);
    });

    it("Displays accordingly when user logs in and out of the application", async () => {
      // App is logged out at the start, so startup screen should be shown
      mockWispa.data.account.loginState = LoginState.LOGGED_OUT;
      mockWispa.sendAccount();

      await expectWithinTimeout(
        async () => await UI.startupScreen.isVisible(),
        "Startup screen did not become visible"
      );

      // Then the user logs in, so the startup screen should be hidden and main UI shown
      mockWispa.data.account.loginState = LoginState.LOGGED_IN;
      mockWispa.sendAccount();

      await expectWithinTimeout(async () => {
        return (
          (await UI.sidebar.isVisible()) &&
          (await UI.midbar.isVisible()) &&
          (await UI.rightbar.isVisible())
        );
      }, "Main UI did not become visible");

      // Then the user logs out, which should make the startup screen show up again
      mockWispa.data.account.loginState = LoginState.LOGGED_OUT;
      mockWispa.sendAccount();

      await expectWithinTimeout(
        async () => await UI.startupScreen.isVisible(),
        "Startup screen did not become visible"
      );
    });
  },
};
