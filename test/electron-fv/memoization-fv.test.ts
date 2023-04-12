// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Test memoization of components.
 *
 * These are kept in their own suite as they use unconventional test methods and are testing
 * internal behaviour
 */
import { mutableCloneDeep } from "shared/mocks/ts-utils";
import { protoBilbo, protoPeter, protoGandalf } from "shared/mocks/mock-contacts";

import { waitForCondition } from "test/utils/utils";
import { Application } from "spectron";
import { MockWispa } from "../utils/mock-wispa";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UI } from "./utils/interface";

// **DO NOT COPY THIS TEST**
//
// Testing that when a contact is updated only it re-renders rather than all contacts re-rendering
// is not possible via the usual FV approach of analysing the UI. This is because it is impossible
// to tell which chunks of HTML have or have not been regenerated. It also turns out this is hard to
// verify in UT too since memoized components cause issues.
//
// So, we test it here by inspecting logs to see how many times given components re-rendered. This
// is not testing the app as a black box since we're relying on knowledge of internal workings.
// Therefore this method of testing should not be used in general and is only used here as it is an
// exceptional case
export const memoization = {
  title: "Memoization",
  tests: (app: Application, mockWispa: MockWispa, UI: UI) => (): void => {
    it("Updating a contact causes only that one to re-render", async () => {
      // Clear any existing logs
      await app.client.getRenderProcessLogs();

      const gandalf = mutableCloneDeep(protoGandalf);
      mockWispa.data.contacts = [protoBilbo, gandalf, protoPeter];
      mockWispa.sendContactsList();

      gandalf.identity.lastName = "The White";
      mockWispa.sendContactUid(gandalf.uid);
      await waitForCondition(async () => {
        return await UI.midbar.contactList.contains("Gandalf The White");
      });

      // Contact Block writes a console log during FV specifically for this test.
      const rendererLogs = await app.client.getRenderProcessLogs();

      const timesRendered = (contactUid: string): number => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return rendererLogs.filter((log: any) => {
          return log.message.includes(`Rendering contact ${contactUid}`);
        }).length;
      };
      expect(timesRendered(gandalf.uid)).toBe(2);
      expect(timesRendered(protoBilbo.uid)).toBe(1);
      expect(timesRendered(protoPeter.uid)).toBe(1);
    });
  },
};
