// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Provides an interface that uses Spectron to control the UI
 */

// TODO - How to make sure the await rule is applying to this file? It needs a tsconfig file to point at

import { Application } from "spectron";
import { parse } from "node-html-parser";
import xpath from "xpath";
import { DOMParser } from "xmldom";

/**
 * Disable Object injection sink check
 * Object injection sink can be a security risk if data being passed to the sink is publicly
 * accessible. Given this code is for internal use only, we can safely disable it.
 */
/* eslint-disable security/detect-object-injection */
// Don't think we need this anymore
// require("regenerator-runtime/runtime");

import { zip } from "lodash";

import { waitForCondition, expectWithinTimeout } from "test/utils/utils";

// logging code has not been converted to Typescript yet.
// eslint-disable-next-line
// @ts-ignore
import log from "node-server/main-logging";

/**
 * Options for the accessibility audit.
 * AX_TOOLTIP_01 is ignored as it generates false positives with Tippy, while
 * each tooltip is not shown.
 * AX_FOCUS_01 is ignored because creates false positives for list of contacts
 */
const auditOptions = { ignoreRules: ["AX_TOOLTIP_01", "AX_FOCUS_01"] };

/**
 * Function to get the value of an attribute of an HTMLElement
 *
 * Webdriver's `element.getAttribute()` can sometimes be very slow (several seconds). However,
 * `getHTML()` always seems to be fast, so use that and parse the HTML ourselves instead.
 *
 * Returns the value of the attribute, or `undefined` if it doesn't exist
 */
async function getAttribute(
  element: WebdriverIO.Element,
  attribute: string
): Promise<string | undefined> {
  const html = await element.getHTML();

  // Node-html-parser's typing seems to be wrong, cast to HTMLElement
  const domElement = parse(html).firstChild as unknown as HTMLElement;

  return domElement.attributes[attribute];
}

// Unicode points for testing keyboard navigation, from:
// https://www.selenium.dev/selenium/docs/api/rb/Selenium/WebDriver/Keys.html
export enum Key {
  TAB = "\uE004",
  ENTER = "\uE007",
  SHIFT = "\uE008",
  CTRL = "\uE009",
  SPACE = "\uE00d",
  PAGE_UP = "\uE00e",
  PAGE_DOWN = "\uE00f",
  END = "\uE010",
  HOME = "\uE011",
  ARROW_LEFT = "\uE012",
  ARROW_UP = "\uE013",
  ARROW_RIGHT = "\uE014",
  ARROW_DOWN = "\uE015",
}

export enum WindowType {
  MAIN,
  INCOMING_CALL,
  IN_CALL,
}

let app: Application;
export function init(application: Application): UI {
  app = application;
  return new UI();
}

/**
 * Represents a section of the UI
 *
 * Houses the `xpath` to the relevant section. Provides a tidy way of referencing UI sections
 * by drilling down (e.g. `UI.sidebar.callsButton`). Also allows custom methods to be defined on
 * individual UI sections
 */
export class Section {
  xpath = "No XPath Provided";

  /**
   * Converts this Section into a WebdriverIO Element
   * @param suffix Additional xpath to be added to the end of the Section's xpath. Used for
   * getting children
   */
  async asElement(suffix = ""): Promise<WebdriverIO.Element> {
    return await app.client.$(`${this.xpath}${suffix}`);
  }

  /**
   * Wrapper to log the action.
   */
  async click(): Promise<void> {
    await (await this.asElement()).click();
  }

  /**
   * Get the value of an attribute of this Section
   *
   * Returns the value of the attribute, or `undefined` if it doesn't exist
   */
  async getAttribute(attribute: string): Promise<string | undefined> {
    return await getAttribute(await this.asElement(), attribute);
  }

  /**
   * Use to determine whether a Section is visible
   *
   * We use this instead of Webdriver's `isExisting()` because when the element does not exist it
   * takes _10 seconds_ to return false. This method takes ~30 milliseconds by comparison
   */
  async isVisible(): Promise<boolean> {
    const html = await (await app.client.$("/*")).getHTML();

    // Don't want DOMParser to spam console with unnecessary warnings
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const doc = new DOMParser({ errorHandler: (): void => {} }).parseFromString(html);
    const matchingElements = xpath.select(this.xpath, doc);

    return matchingElements.length !== 0;
  }

  /**
   * Returns the element attribute "disabled"
   */
  async isDisabled(): Promise<boolean> {
    return (await this.getAttribute("disabled")) !== undefined;
  }

  /**
   * Whether or not this section is active (aka focused)
   */
  async isActive(): Promise<boolean> {
    // getActiveElement() actually returns an object rather than a string, so need to cast it
    // to an appropriate type here. The object only has one property, whose value is the element id.
    const activeElement = (await app.client.getActiveElement()) as unknown as Record<
      string,
      string
    >;
    const activeElementId = activeElement[Object.getOwnPropertyNames(activeElement)[0]];

    const thisElementId = (await this.asElement()).elementId;

    return activeElementId === thisElementId;
  }

  /**
   * Wait until this section is active (aka focused)
   */
  async waitForActive(timeout = 10000): Promise<void> {
    await waitForCondition(
      async () => await this.isActive(),
      timeout,
      `${this.xpath} has not become active.`
    );
  }

  // TODO comments on public methods
  async hover(): Promise<void> {
    await (await this.asElement()).moveTo();
  }

  async waitForVisible(timeout = 10000): Promise<void> {
    await (
      await this.asElement()
    ).waitForExist({
      timeout,
      timeoutMsg: `${this.xpath} did not become visible`,
    });
  }

  async waitForNotVisible(timeout = 10000): Promise<void> {
    await (
      await this.asElement()
    ).waitForExist({
      timeout,
      timeoutMsg: `${this.xpath} did not become visible`,
      reverse: true,
    });
  }

  async getAriaLabel(): Promise<string | undefined> {
    return await this.getAttribute("aria-label");
  }

  async getText(): Promise<string> {
    return (await this.asElement()).getText();
  }

  async getHTML(): Promise<string> {
    return (await this.asElement()).getHTML();
  }
}

/**
 * Convenience function to construct a Section containing just an Xpath and nothing else. Should
 * be used when a full blown class is not necessary, i.e.:
 *   - The Section has no children
 *   - The Section has no custom methods
 */
const sectionWithPath = (xpath: string): Section => {
  const section = new Section();
  section.xpath = xpath;

  return section;
};

/**
 * Convenience function to construct a Section containing just an Xpath and nothing else, based on
 * the id of the element. Should be used when a full blown class is not necessary, i.e.:
 *   - The Section has no children
 *   - The Section has no custom methods
 */
const sectionWithId = (id: string): Section => sectionWithPath(`//*[@id="${id}"]`);

/**
 * The entire UI
 */
export class UI extends Section {
  startupScreen: Section;
  sidebar: Sidebar;
  midbar: Midbar;
  rightbar: Rightbar;
  confirmDeletePopup: Popup;
  confirmLogOut: Popup;
  incomingCallFrame: IncomingCallFrame;
  inCallFrame: ContentHeaderPanel;
  tooltip: Section;

  constructor() {
    super();
    this.xpath = '//*[@id="root"]';

    this.startupScreen = sectionWithId("startupScreen");
    this.sidebar = new Sidebar();
    this.midbar = new Midbar();
    this.rightbar = new Rightbar();
    this.confirmDeletePopup = new Popup("confirmDeletePopup");
    this.confirmLogOut = new Popup("confirmLogOutPopup");
    this.incomingCallFrame = new IncomingCallFrame();
    this.inCallFrame = new ContentHeaderPanel();
    this.tooltip = sectionWithPath('//*[@data-tippy-root=""]');
  }

  /**
   * Convenience wrapper around app.client.performActions
   *
   * @param {*} values - list of keys to press at the same time
   * @param {*} times - number of times to press the specified key(s)
   */
  async pressKey(values: Key[]): Promise<void> {
    interface KeyboardAction {
      type: "keyDown" | "keyUp";
      value: Key;
    }
    const down: KeyboardAction[] = [];
    const up: KeyboardAction[] = [];
    let readable = "";

    values.forEach((value) => {
      readable += value + ", ";
      down.push({ type: "keyDown", value });
      up.push({ type: "keyUp", value });
    });

    // TODO - Check I log sensibly
    log.fv("Pressing " + readable);
    await app.client.performActions([
      {
        type: "key",
        id: "keyboard",
        actions: [...down, ...up],
      },
    ]);
  }

  /**
   * Whenever this is called, an audit of the _current_ state of the UI is performed.
   * It should be called after each test, but also during tests where a part
   * of the UI is only shown temporarily.
   */
  async auditAccessibility(): Promise<void> {
    const auditResults = await app.client.auditAccessibility(auditOptions);
    if (auditResults.failed) {
      log.fv(auditResults.message);
    }
    expect(auditResults.failed).toBeFalsy();
  }

  async windowType(): Promise<WindowType | null> {
    // Need an `await` here - getTitle() actually returns a Promise despite TypeScript claiming
    // it's not async.
    const windowTitle = await app.browserWindow.getTitle();

    // TODO: BRANDING https://jira.metaswitch.com/browse/ACM-4439
    // The name of the app used below will need to come from the branding.
    switch (windowTitle) {
      case "MaX UC Refresh":
        return WindowType.MAIN;
      case "MaX UC Refresh - Call":
        return WindowType.IN_CALL;
      case "MaX UC Refresh - Incoming Call":
        return WindowType.INCOMING_CALL;
      default:
        log.fv(`Error - Could not determine window type. Window title was ${windowTitle}`);
        return null;
    }
  }
}

/**
 * The incoming call frame
 *
 * Path: `UI.incomingCallFrame`
 */
class IncomingCallFrame extends Section {
  acceptButton: Section;
  rejectButton: Section;

  constructor() {
    super();
    this.xpath = '//*[@id="incomingCallFrame"]';

    this.acceptButton = sectionWithId("acceptButton");
    this.rejectButton = sectionWithId("rejectButton");
  }
}

/**
 * The sidebar or Pane A
 *
 * Path: `UI.sidebar`
 */
class Sidebar extends Section {
  profileButton: Section;
  addButton: Section;
  contactsButton: Section;
  callsButton: Section;
  chatsButton: Section;
  meetingsButton: Section;
  voicemailButton: Section;
  bugButton: Section;
  feedbackButton: Section;
  avatarMenu: Menu;
  addMenu: Menu;
  presenceMenu: Menu;
  customStatus: CustomStatusSection;

  constructor() {
    super();
    this.xpath = '//*[@id="sidebar"]';

    this.profileButton = sectionWithId("profileButton");
    this.addButton = sectionWithId("addButton");
    this.contactsButton = sectionWithId("contactsTabButton");
    this.callsButton = sectionWithId("callsTabButton");
    this.chatsButton = sectionWithId("chatsTabButton");
    this.meetingsButton = sectionWithId("meetingsTabButton");
    this.voicemailButton = sectionWithId("voicemailButton");
    this.bugButton = sectionWithId("bugButton");
    this.feedbackButton = sectionWithId("feedbackButton");
    this.avatarMenu = new Menu("avatarMenu");
    this.addMenu = new Menu("addMenu");
    this.presenceMenu = new Menu("presenceMenu");
    this.customStatus = new CustomStatusSection();
  }
}

class CustomStatusSection extends Section {
  textArea: Section;
  editButton: Section;
  clearButton: Section;
  saveButton: Section;
  cancelButton: Section;

  constructor() {
    super();
    this.xpath = '//*[@id="avatarMenuRow-SetCustomStatus"]';

    this.textArea = sectionWithPath(`${this.xpath}//textarea`);
    this.editButton = sectionWithId("customStatusButtonEdit");
    this.clearButton = sectionWithId("customStatusButtonClear");
    this.saveButton = sectionWithId("customStatusButtonSave");
    this.cancelButton = sectionWithId("customStatusButtonEdit");
  }

  /**
   * Types a message into the text area
   */
  async typeMessage(message: string): Promise<void> {
    await this.textArea.click();

    await expectWithinTimeout(
      () => this.textArea.isActive(),
      "Custom status text area did not become focused "
    );

    await (await this.textArea.asElement()).setValue(message);

    await expectWithinTimeout(
      async () => (await this.textArea.getText()) === message,
      "Custom status text area did not display message after it was typed in"
    );
  }
}

/**
 * The midbar or Pane B
 *
 * Path: `UI.midbar`
 */
class Midbar extends Section {
  searchBar: SearchBar;
  dialpad: Dialpad;
  contactList: ContactList;
  callList: CallList;
  chatList: ChatList;
  meetingManagement: MeetingManagement;

  constructor() {
    super();
    this.xpath = '//*[@id="midbar"]';

    this.searchBar = new SearchBar();
    this.dialpad = new Dialpad();
    this.contactList = new ContactList();
    this.callList = new CallList();
    this.chatList = new ChatList();
    this.meetingManagement = new MeetingManagement();
  }
}

/**
 * The search bar part of the midbar. Contains an `input` which is the actual text input box.
 *
 * Path: `UI.midbar.searchBar`
 */
class SearchBar extends Section {
  input: Input;
  callButton: Section;
  smsButton: Section;

  constructor() {
    super();
    this.xpath = '//*[@id="searchBar"]';
    this.input = new Input("searchBarInput");
    this.callButton = sectionWithPath('//*[@id="searchBarButtons"]/button[1]');
    this.smsButton = sectionWithPath('//*[@id="searchBarButtons"]/button[2]');
  }
}

class Dialpad extends Section {
  dialpadContainer: Section;
  dialpadCallButton: Section;

  constructor() {
    super();
    this.xpath = '//*[@id="showKeypadButton"]';
    this.dialpadContainer = sectionWithPath('//*[@id="midbarDialpad"]');
    this.dialpadCallButton = sectionWithPath('//button[contains(@class, "dialpadCallButton")]');
  }
}

class Input extends Section {
  constructor(id: string) {
    super();
    this.xpath = `//*[@id="${id}"]`;
  }

  async setValue(value: string): Promise<void> {
    await (await this.asElement()).setValue(value);
  }
}

/**
 * The list of contacts in the midbar
 *
 * Path: `UI.midbar.contactList`
 */
class ContactList extends Section {
  favourites: Section;

  constructor() {
    super();
    this.xpath = '//*[@id="contactList"]';
    this.favourites = sectionWithId("favouritesSectionTitle");
  }

  async contacts(): Promise<ContactBlock[]> {
    const elements = await app.client.$$("[id^=contactBlock]");

    const contacts: ContactBlock[] = [];
    for (const element of elements) {
      const id = await getAttribute(element, "id");
      if (id) contacts.push(new ContactBlock(id));
    }

    return contacts;
  }

  /**
   * Waits until at least `numContacts` exist in the contact list
   */
  async waitForSomeContacts(numContacts = 1): Promise<void> {
    await expectWithinTimeout(async () => {
      const contacts = await this.contacts();
      return contacts.length >= numContacts;
    }, `Timed out waiting for at least ${numContacts} contact(s) to be in the contact list`);
  }

  /**
   * Waits until exactly `numContacts` exist in the contact list
   */
  async waitForNContacts(numContacts: number): Promise<void> {
    await expectWithinTimeout(async () => {
      const contacts = await this.contacts();
      return contacts.length == numContacts;
    }, `Timed out waiting for exactly ${numContacts} contact(s) to be in the contact list`);
  }

  /**
   * Return an array containing the full names of all displayed contacts in order
   */
  async contactNames(): Promise<string[]> {
    const contacts = await this.contacts();
    return Promise.all(contacts.map(async (contact) => await contact.name()));
  }

  /**
   * Check whether a given contact is in the contact list
   */
  async contains(contactName: string): Promise<boolean> {
    const contactNames = await this.contactNames();
    return contactNames.includes(contactName);
  }

  /**
   * Expects the names in the contact list to match the provided list in order
   */
  async expectToBe(expectedContacts: string[]): Promise<void> {
    expect(await this.contactNames()).toStrictEqual(expectedContacts);
  }

  /**
   * Return an array containing the presence of all displayed contacts in order
   */
  async contactPresences(): Promise<string[]> {
    const contacts = await this.contacts();
    return Promise.all(contacts.map(async (contact) => await contact.presence()));
  }

  /**
   * Expects the presences in the contact list to match the provided list in order
   */
  async expectPresenceToBe(expectedPresences: string[]): Promise<void> {
    expect(await this.contactPresences()).toStrictEqual(expectedPresences);
  }
}

/**
 * An individual contact block within the midbar
 *
 * Dynamically generated so must be accessed via `await UI.midbar.contacts()`
 */
class ContactBlock extends Section {
  /**
   * @param {string} id - The unique ID for this ContactBlock as found in its HTML tag
   */
  constructor(id: string) {
    super();
    this.xpath = `//*[@id="${id}"]`;
  }
  async name(): Promise<string> {
    return (await this.asElement("/div[2]/div/p")).getText();
  }
  async presence(): Promise<string> {
    return (await this.asElement("/div[2]/small")).getText();
  }
}

/**
 * The list of chats in the midbar
 *
 * Path: `UI.midbar.chatList`
 */
class ChatList extends Section {
  constructor() {
    super();
    this.xpath = '//*[@id="chatList"]';
  }
  async chats(): Promise<ChatBlock[]> {
    const elements = await app.client.$$("[id^=chatBlock]");

    const chats: ChatBlock[] = [];
    for (const element of elements) {
      const id = await getAttribute(element, "id");
      if (id) chats.push(new ChatBlock(id));
    }

    return chats;
  }

  /**
   * Wait until at least `minimumAmount` messages exist
   */
  async waitForSomeChats(minimumAmount = 1, timeout?: number): Promise<void> {
    await expectWithinTimeout(
      async () => {
        return (await this.chats()).length >= minimumAmount;
      },
      `Timed out waiting for ${minimumAmount} chat(s) in the chat list`,
      timeout
    );
  }
}

/**
 * An individual chat block within the midbar
 *
 * Dynamically generated so must be accessed via `await UI.midbar.chats()`
 */
class ChatBlock extends Section {
  constructor(id: string) {
    super();
    this.xpath = `//*[@id="${id}"]`;
  }

  async name(): Promise<string> {
    return (await this.asElement("/div[2]/div[1]/div[1]/p")).getText();
  }

  async messagePreview(): Promise<string> {
    return (await this.asElement("/div[2]/small")).getText();
  }

  async time(): Promise<string> {
    return (await this.asElement("/div[2]/div[1]/time")).getText();
  }

  async attendState(): Promise<boolean> {
    return (await this.asElement("/div[2]/div[1]/div[1]/span")).isExisting();
  }
}

/**
 * The list of calls in the midbar
 *
 * Path: `UI.midbar.callList`
 */
class CallList extends Section {
  constructor() {
    super();
    this.xpath = '//*[@id="callList"]';
  }
  async calls(): Promise<CallBlock[]> {
    const elements = await app.client.$$("[id^=callBlock]");

    const calls: CallBlock[] = [];
    for (const element of elements) {
      const id = await getAttribute(element, "id");
      if (id) calls.push(new CallBlock(id));
    }

    return calls;
  }

  /**
   * Waits until exactly `numContacts` exist in the contact list
   */
  async waitForNCalls(numCalls: number): Promise<void> {
    await expectWithinTimeout(async () => {
      const contacts = await this.calls();
      return contacts.length == numCalls;
    }, `Timed out waiting for exactly ${numCalls} call(s) to be in the call list`);
  }

  /**
   * Return an array containing the names for all displayed calls in order
   */
  async callNames(): Promise<string[]> {
    const calls = await this.calls();
    return Promise.all(calls.map(async (call) => await call.name()));
  }

  /**
   * Expects the names in the call list to match the provided list in order
   */
  async expectToBe(expectedContacts: string[]): Promise<void> {
    expect(await this.callNames()).toStrictEqual(expectedContacts);
  }
}

/**
 * An individual historic call block within the midbar
 *
 * Dynamically generated so must be accessed via `await UI.midbar.calls()`
 */
class CallBlock extends Section {
  constructor(id: string) {
    super();
    this.xpath = `//*[@id="${id}"]`;
  }

  async name(): Promise<string> {
    return (await this.asElement("/div[2]/div[1]/div[1]/p")).getText();
  }

  async remoteDN(): Promise<string> {
    return (await this.asElement("/div[2]/div[2]/small")).getText();
  }

  async time(): Promise<string> {
    return (await this.asElement("/div[2]/div[1]/time")).getText();
  }

  async attendState(): Promise<boolean> {
    return (await this.asElement("/div[2]/div[1]/div[1]/span")).isExisting();
  }
}

/**
 * The collection of meeting related buttons in midbar on the meetings tab
 *
 * Path: `UI.midbar.meetingManagement`
 */
class MeetingManagement extends Section {
  createButton: Section;
  scheduleButton: Section;
  joinButton: Section;
  viewUpcomingButton: Section;
  viewRecordedButton: Section;

  constructor() {
    super();
    this.xpath = '//*[@id="meetingManagement"]';

    this.createButton = sectionWithPath(`${this.xpath}/div[1]/button[1]`);
    this.scheduleButton = sectionWithPath(`${this.xpath}/div[1]/button[2]`);
    this.joinButton = sectionWithPath(`${this.xpath}/div[2]/button[1]`);
    this.viewUpcomingButton = sectionWithPath(`${this.xpath}/div[2]/button[2]`);
    this.viewRecordedButton = sectionWithPath(`${this.xpath}/div[2]/button[3]`);
  }

  buttons(): Section[] {
    return [
      this.createButton,
      this.scheduleButton,
      this.joinButton,
      this.viewUpcomingButton,
      this.viewRecordedButton,
    ];
  }
}

/**
 * The rightbar or Pane C
 *
 * Path: `UI.rightbar`
 */
class Rightbar extends Section {
  contentHeaderPanel: ContentHeaderPanel;
  contactPane: ContactPane;
  chatPane: ChatPane;
  conversationTabButton: Section;
  contactDetailsTabButton: Section;

  constructor() {
    super();
    this.xpath = '//*[@id="rightbar"]';

    this.contentHeaderPanel = new ContentHeaderPanel();

    this.conversationTabButton = sectionWithPath(`${this.xpath}/nav[@id="rightbarTabs"]/button[1]`);
    this.contactDetailsTabButton = sectionWithPath(
      `${this.xpath}/nav[@id="rightbarTabs"]/button[2]`
    );
    this.contactPane = new ContactPane();
    this.chatPane = new ChatPane();
  }
}

/**
 * The content pane displaying the contact details in rightbar
 *
 * Path: `UI.rightbar.contactPane`
 */

class ContactPane extends Section {
  addAsAContactButton: Section;
  nickname: Section;
  jobTitle: Section;
  company: Section;
  phone: PhoneDetailSection;
  email: EmailDetailSection;
  address: AddressDetailSection;
  history: HistoryDetailSection;

  constructor() {
    super();

    const id = "contactPane";
    this.xpath = `//*[@id="${id}"]`;

    this.addAsAContactButton = sectionWithId(`${id}-addContact`);
    this.nickname = sectionWithId("detailSection-nickname");
    this.jobTitle = sectionWithId("detailSection-jobTitle");
    this.company = sectionWithId("detailSection-company");
    this.phone = new PhoneDetailSection();
    this.email = new EmailDetailSection();
    this.address = new AddressDetailSection();
    this.history = new HistoryDetailSection();
  }
}

class PhoneDetailSection extends Section {
  constructor() {
    super();
    this.xpath = `//*[@id="detailSection-phone"]`;
  }

  async getPhoneNumbers(): Promise<{ value?: string; type?: string }[]> {
    const contents = await this.getText();
    const contentList = contents.split("\n");
    const contentHalf = contentList.filter((_, i) => i % 2 === 0);
    const typeHalf = contentList.filter((_, i) => i % 2 === 1);

    return zip(contentHalf, typeHalf).map((contentTypeArray) => ({
      value: contentTypeArray[0],
      type: contentTypeArray[1],
    }));
  }

  /**
   * Starts from 1
   */
  getNthPhoneButton(n: number): Section {
    return sectionWithPath(`${this.xpath}/div[${n}]/div/a`);
  }

  /**
   * Starts from 1
   */
  getNthSMSButton(n: number): Section {
    return sectionWithPath(`${this.xpath}/div[${n}]/button`);
  }
}

class EmailDetailSection extends Section {
  constructor() {
    super();
    this.xpath = `//*[@id="detailSection-email"]`;
  }

  async getEmails(): Promise<string[]> {
    const contents = await this.getText();
    const contentList = contents.split("\n");
    return contentList;
  }

  async getEmailHref(): Promise<string | undefined> {
    return getAttribute(await this.asElement("/div[1]/a"), "href");
  }

  /**
   * Starts from 1
   */
  getNthEmailLink(n: number): Section {
    return sectionWithPath(`${this.xpath}/div[${n}]/a`);
  }
}

class AddressDetailSection extends Section {
  constructor() {
    super();
    this.xpath = `//*[@id="detailSection-address"]`;
  }

  async getAddresses(): Promise<{ value?: string; type?: string }[]> {
    const contents = await this.getText();
    const contentList = contents.split("\n");

    const half = Math.floor(contentList.length / 2);
    const contentHalf = contentList.splice(0, half);
    const typeHalf = contentList.splice(-half);

    return zip(contentHalf, typeHalf).map((contentTypeArray) => ({
      value: contentTypeArray[0],
      type: contentTypeArray[1],
    }));
  }
}

class HistoryDetailSection extends Section {
  constructor() {
    super();
    this.xpath = `//*[@id="detailSection-history"]`;
  }

  async getHistory(): Promise<{ type?: string; date?: string; time?: string }[]> {
    const contents = await this.getText();
    const contentList = contents.split("\n");

    const third = Math.floor(contentList.length / 3);
    const typeThird = contentList.splice(0, third);
    const dateThird = contentList.splice(third, 2 * third);
    const timeThird = contentList.splice(-third);

    return zip(typeThird, dateThird, timeThird).map((contentTypeArray) => ({
      type: contentTypeArray[0],
      date: contentTypeArray[1],
      time: contentTypeArray[2],
    }));
  }
}

/**
 * The content pane displaying chat history in rightbar
 *
 * Path: `UI.rightbar.chatPane`
 */
class ChatPane extends Section {
  messageBox: MessageBox;

  constructor() {
    super();
    this.xpath = '//*[@id="chatPane"]';
    this.messageBox = new MessageBox();
  }

  /**
   * Return ChatMessages in the chat box
   * @param newMessages Whether to just get new messages
   */
  async messages(): Promise<ChatMessage[]> {
    const elements = await app.client.$$("[id^=chatMessage]");

    log.fv("messages found " + elements.length);

    const messagesWithCoordinates: { message: ChatMessage; yCoordinate: number }[] = [];
    for (const element of elements) {
      const id = await getAttribute(element, "id");
      if (id === undefined) {
        throw new Error(`
        Could not find ID of chatMessage Element:
        element - ${JSON.stringify(element)}
        `);
      }

      const message = new ChatMessage(id);
      const yCoordinate = (await app.client.getElementRect(element.elementId)).y;
      messagesWithCoordinates.push({ message, yCoordinate });
    }
    return messagesWithCoordinates
      .sort((a, b) => b.yCoordinate - a.yCoordinate)
      .map(({ message }) => message);
  }

  async chatHeaderVisible(chatHeaderId: string): Promise<boolean> {
    const elements = await app.client.$$("[id^=chatHeader]");

    const chatHeaders: string[] = [];
    for (const element of elements) {
      const id = await getAttribute(element, "id");
      if (id === undefined) {
        throw new Error(`
        Could not find ID of chatHeader Element:
        element - ${JSON.stringify(element)}
        `);
      }
      chatHeaders.push(id);
    }
    return chatHeaders.includes(chatHeaderId);
  }

  /**
   * Wait until `minimumAmount` messages exist
   */
  async waitForSomeMessages(minimumAmount = 1, timeout?: number): Promise<void> {
    await expectWithinTimeout(
      async () => {
        const messages = await this.messages();
        return messages.length >= minimumAmount;
      },
      `Timed out waiting for ${minimumAmount} messages`,
      timeout
    );
  }
}

/**
 * An individual chat message as displayed in rightbar
 *
 * Dynamically generated so must be accessed via
 * `await UI.rightbar.chatPane.messages()`
 */
class ChatMessage extends Section {
  constructor(id: string) {
    super();
    this.xpath = `//*[@id="${id}"]`;
  }
  async body(): Promise<string> {
    const { body } = await this._parseText();
    if (body.endsWith("\n")) {
      return body.slice(0, -1);
    } else {
      return body;
    }
  }
  async time(): Promise<string> {
    const { time } = await this._parseText();
    return time;
  }

  async _parseText(): Promise<{ body: string; time: string }> {
    let messageText = await (await this.asElement()).getText();

    // If there is an avatar then `messageText` will be an array with the text as the second entry,
    // if not it will just be a string
    if (Array.isArray(messageText)) {
      messageText = messageText[1];
    }

    const splitOutLastLine = /((?:.*\n)*)(.*$)/g;
    const split = splitOutLastLine.exec(messageText);

    if (split === null) {
      expect(split).not.toBeNull();
      // Don't need this really, but it convinces the compiler that split is now non-null
      throw new Error();
    }
    const [, body, time] = split;
    return { body, time };
  }
}

/**
 * The box users can use to compose and send messages
 *
 * Path: `UI.rightbar.chatPane.messageBox`
 */
class MessageBox extends Section {
  inputField: Section;
  messageMenuButton: ButtonWithMenu;

  constructor() {
    super();
    this.xpath = '//*[@id="messageBox"]';
    this.inputField = sectionWithPath(`${this.xpath}//textarea`);
    this.messageMenuButton = new ButtonWithMenu("messageMenuButton", "messageMenu");
  }

  /**
   * Sends a message by typing it into the message box and hitting "Enter"
   *
   * Any newlines in given message are replaced with "ctrl+enter"
   */
  async sendMessage(message: string): Promise<void> {
    await this.typeMessage(message);
    await app.client.keys(Key.ENTER);

    await expectWithinTimeout(
      async () => (await this.contents()) === "",
      `Message box did not clear itself after sending message - ${message}`
    );
  }

  /**
   * Types a message into the message box
   *
   * Any newlines in given message are replaced with "ctrl+enter"
   */
  async typeMessage(message: string): Promise<void> {
    await expectWithinTimeout(
      async () => await this.inputField.isVisible(),
      "Message box input field did not become visible"
    );
    await this.inputField.click();
    await expectWithinTimeout(
      () => this.inputField.isActive(),
      "Message box did not become active after clicking"
    );

    // Key.CTRL toggles the ctrl modifier on/off. so we need to have it between enter to simulate
    // pressing Ctrl+Enter at the same time.
    const keysToType = message.split("\n").join(Key.CTRL + Key.ENTER + Key.CTRL);

    await (await this.inputField.asElement()).setValue(keysToType);

    await expectWithinTimeout(
      async () => (await this.contents()) === message,
      `Message box did not display ${message}`
    );
  }

  /**
   * Returns the text typed into the textarea.
   */
  async contents(): Promise<string> {
    return await this.inputField.getText();
  }
}

/**
 * The panel at the top of Rightbar
 *
 * Path: `UI.rightbar.contentHeaderPanel`
 */
class ContentHeaderPanel extends Section {
  contact: ContentHeaderPanelContact;
  favouritesButton: Section;
  notifyButton: Section;
  defaultMeetingButton: Section;
  callButton: ButtonWithMenu;
  defaultMoreButton: ButtonWithMenu;
  addTransferButton: ButtonWithMenu;
  muteButton: Section;
  inCallMeetingButton: Section;
  recordButton: Section;
  holdButton: Section;
  hangUpButton: Section;
  inCallMoreButton: ButtonWithMenu;
  dockButton: Section;

  constructor() {
    super();
    this.xpath = '//*[@id="contentHeaderPanel"]';

    this.contact = new ContentHeaderPanelContact();
    this.favouritesButton = sectionWithId("addToFavouritesButton");
    this.notifyButton = sectionWithId("notifyWhenAvailableButton");
    this.defaultMeetingButton = sectionWithId("defaultMeetingButton");
    this.callButton = new ButtonWithMenu("callButton", "callMenu");
    this.defaultMoreButton = new ButtonWithMenu("defaultMoreButton", "moreMenu");
    this.addTransferButton = new ButtonWithMenu("addTransferButton", "addTransferMenu");
    this.muteButton = sectionWithId("muteButton");
    this.inCallMeetingButton = sectionWithId("inCallMeetingButton");
    this.recordButton = sectionWithId("recordButton");
    this.holdButton = sectionWithId("holdButton");
    this.hangUpButton = sectionWithId("hangUpButton");
    this.inCallMoreButton = new ButtonWithMenu("inCallMoreButton", "moreMenu");
    this.dockButton = sectionWithId("dockWindowButton");
  }

  inCallButtons(hasMeetingEnabled: boolean): Section[] {
    return [
      this.addTransferButton,
      this.muteButton,
      ...(hasMeetingEnabled ? [this.inCallMeetingButton] : []),
      this.recordButton,
      this.holdButton,
      this.hangUpButton,
      this.inCallMoreButton,
    ];
  }

  outOfCallButtons(hasMeetingEnabled: boolean): Section[] {
    return [
      this.callButton,
      ...(hasMeetingEnabled ? [this.defaultMeetingButton] : []),
      this.defaultMoreButton,
    ];
  }

  /** Wait until the contact changes to match, throw error if timesout. */
  async expectWillHaveName(expectedName: string): Promise<void> {
    await expectWithinTimeout(async () => {
      return (await this.contact.name()) === expectedName;
    }, `Displayed contact name has not updated to '${expectedName}'`);
  }

  /** Wait until the contact changes to match, throw error if timesout. */
  async expectWillHavePresence(expectedPresence: string): Promise<void> {
    await expectWithinTimeout(async () => {
      return (await this.contact.detail()) === expectedPresence;
    }, `Displayed contact presence has not updated to '${expectedPresence}'`);
  }

  /** Returns true if in-call header panel is shown. */
  async isInCall(hasMeetingEnabled = true): Promise<boolean> {
    const inCallButtonsVisibility = await Promise.all(
      this.inCallButtons(hasMeetingEnabled).map(async (button) => await button.isVisible())
    );
    return inCallButtonsVisibility.every((visibility) => visibility);
  }

  /** Returns true if default header panel is shown. */
  async isOutOfCall(hasMeetingEnabled = true): Promise<boolean> {
    const outOfCallButtonsVisibility = await Promise.all(
      this.outOfCallButtons(hasMeetingEnabled).map(async (button) => await button.isVisible())
    );
    return outOfCallButtonsVisibility.every((visibility) => visibility);
  }

  async expectToBeInCall(hasMeetingEnabled = true): Promise<void> {
    await expectWithinTimeout(async () => {
      return (await this.isInCall(hasMeetingEnabled)) === true;
    }, "In-call header panel not shown");
  }

  async expectToBeOutOfCall(hasMeetingEnabled = true): Promise<void> {
    await expectWithinTimeout(async () => {
      return (await this.isOutOfCall(hasMeetingEnabled)) === true;
    }, "Out-of-call header panel not shown");
  }
}

/**
 * A button that has a dropdown menu associated with it.
 *
 * Each button has its own name and can be accessed on `UI.rightbar.contentHeaderPanel`
 */
class ButtonWithMenu extends Section {
  menu: Menu;

  constructor(id: string, menuId: string) {
    super();
    this.xpath = `//*[@id="${id}"]`;
    this.menu = new Menu(menuId);
  }
}

/**
 * The menu to be shown for a given action. Note the id to be passed as an
 * argument should match the one being used as the prefix for the created
 * Menu component rows (i.e.: avatarMenuRow-<item>, addMenuRow-<item>, etc)
 *
 * @param {string} id - The id for the created menu.
 */
class Menu extends Section {
  id: string;

  constructor(id: string) {
    super();
    this.id = id;
    this.xpath = `//*[@id="${id}"]`;
  }

  async rows(): Promise<MenuRow[]> {
    // The row IDs are in the format "<menu_id>Row"
    const elements = await app.client.$$(`[id^=${this.id}Row]`);

    const rows: MenuRow[] = [];
    for (const element of elements) {
      const id = await getAttribute(element, "id");
      if (id) rows.push(new MenuRow(id));
    }

    return rows;
  }

  async rowTexts(): Promise<string[]> {
    const rows = await this.rows();
    return Promise.all(rows.map(async (row) => await row.text()));
  }
}

class MenuRow extends Section {
  constructor(id: string) {
    super();
    this.xpath = `//*[@id="${id}"]`;
  }

  async text(): Promise<string> {
    return await (await this.asElement("/div/p[1]")).getText();
  }
}

/**
 * The contact details displayed at the top left of Rightbar
 *
 * Path: `UI.rightbar.contentHeaderPanel.contact`
 */
class ContentHeaderPanelContact extends Section {
  constructor() {
    super();
    this.xpath = '//*[@id="contentHeaderPanelContact"]';
  }

  async name(): Promise<string> {
    return await (await this.asElement("/div[2]/div/h1")).getText();
  }
  async detail(): Promise<string> {
    return await (await this.asElement("/div[2]/p")).getText();
  }
}

class Popup extends Section {
  id: string;

  constructor(id: string) {
    super();
    this.id = id;
    this.xpath = `//*[@id="${id}"]`;
  }

  async buttons(): Promise<Section[]> {
    // The row IDs are in the format "<popup_id>-<option_text>"
    const elements = await app.client.$$(`[id^=${this.id}-]`);

    const buttons = [];
    for (const element of elements) {
      const id = await getAttribute(element, "id");
      if (id) buttons.push(sectionWithId(id));
    }

    return buttons;
  }
}
