// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/* eslint-disable jest/valid-describe */
import { Application } from "spectron";
import { app, mockWispa, UI } from "test/electron-fv/common-setup";
import { UI as UIClass } from "./utils/interface";
import chalk from "chalk";

import { MockWispa } from "../utils/mock-wispa";

import * as chatPane from "./idle/chat-pane.test";
import * as contactList from "./idle/contact-list.test";
import * as recentCallsList from "./idle/recent-calls-list.test";
import * as recentChatsList from "./idle/recent-chats-list.test";
import * as sidebar from "./idle/sidebar.test";
import * as rightbar from "./idle/rightbar.test";
import * as inCall from "./calls/in-call.test";
import * as incomingCall from "./calls/incoming-calls.test";
import * as outgoingCall from "./calls/outgoing-calls.test";
import * as avatarMenu from "./avatar-menu.test";
import * as contacts from "./contacts.test";
import * as localisation from "./localisation.test";
import * as login from "./login.test";
import * as meetings from "./meetings.test";
import * as memoization from "./memoization-fv.test";
import * as messages from "./messages.test";
import * as settings from "./settings.test";
import * as user from "./user.test";
import * as voicemails from "./voicemails.test";

// Add suites or components here to run only them. Leave empty to run all tests
// E.g. to run all `settings` tests and just the `favourites` tests from `contacts`:
// const specificTestsToRun: Array<Suite | Component> = [settings, contacts.favourites];
const specificTestsToRun: Array<Suite | Component> = [];

if (specificTestsToRun.length > 0) {
  runSubset(specificTestsToRun);
} else {
  console.log(`${chalk.green("Running all FVs...")}`);
  runSuite(chatPane);
  runSuite(contactList);
  runSuite(recentCallsList);
  runSuite(recentChatsList);
  runSuite(rightbar);
  runSuite(sidebar);
  runSuite(inCall);
  runSuite(incomingCall);
  runSuite(outgoingCall);
  runSuite(avatarMenu);
  runSuite(contacts);
  runSuite(localisation);
  runSuite(login);
  runSuite(meetings);
  runSuite(memoization);
  runSuite(messages);
  runSuite(settings);
  runSuite(user);
  runSuite(voicemails);
}
interface Component {
  title: string;
  tests: (app: Application, mockWispa: MockWispa, UI: UIClass) => () => void;
}
type Suite = Record<string, Component>;

/**
 * Runs the given suites and components, then stops any more from being run
 */
function runSubset(tests: Array<Suite | Component>): void {
  console.log(`${chalk.green("Running subset of FVs:")}`);

  const isComponent = (suiteOrComponent: Suite | Component): suiteOrComponent is Component =>
    (suiteOrComponent as Component).title !== undefined;

  tests.forEach((suiteOrComponent) => {
    if (isComponent(suiteOrComponent)) {
      console.log(`  - Component ${chalk.blue(suiteOrComponent.title)}`);
      runComponent(suiteOrComponent);
    } else {
      console.log(
        `  - Suite with components ${chalk.blue(
          Object.values(suiteOrComponent).map((component) => component.title)
        )}`
      );
      runSuite(suiteOrComponent);
    }
  });
}

function runSuite(suite: Record<string, Component>): void {
  Object.values(suite).forEach(runComponent);
}
function runComponent(component: Component): void {
  describe(component.title, component.tests(app, mockWispa, UI));
}
