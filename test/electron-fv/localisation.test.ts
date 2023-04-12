// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Localization related Electron FV tests
 */

import { Application } from "spectron";
import * as pb from "protobuf-wispa";

import { mutableCloneDeep } from "shared/mocks/ts-utils";
import { MockWispa } from "test/utils/mock-wispa";
import { expectWithinTimeout } from "test/utils/utils";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UI } from "test/electron-fv/utils/interface";

export const localeReload = {
  title: "Locale reload",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    beforeEach(async () => {
      mockWispa.reset();
      await app.client.refresh();

      await UI.midbar.searchBar.isVisible();
    });

    it("Reload translations when java locale received over WISPA", async () => {
      const generalSettings = mockWispa.data.settings.general
        ? mutableCloneDeep(mockWispa.data.settings.general)
        : pb.settings.GeneralSettings.fromPartial({});
      generalSettings.javaLocale = "test";

      mockWispa.data.settings = {
        ...mockWispa.data.settings,
        general: generalSettings,
      };
      mockWispa.sendSettings();

      await expectWithinTimeout(
        // The searchbar placeholder is visible once the app starts -
        // check that it has updated to use the java locale
        async () => (await UI.midbar.searchBar.getHTML()).includes("xxxx"),
        "Searchbar placeholder text was not reloaded with test language"
      );
    });
  },
};
