// Copyright 2021 Metaswitch Networks - Highly Confidential Material

/**
 * English strings for translations.
 */

/* eslint-disable @typescript-eslint/camelcase */

export default {
  // "common" is the namespace - we currently only use one namespace.
  common: {
    // TODO: BRANDING https://jira.metaswitch.com/browse/ACM-4439
    // The name of the app used below will need to come from the branding.
    // DO NOT TRANSLATE
    productName: "MaX UC Refresh",

    // DO NOT TRANSLATE: Determined entirely by productName, which is untranslated
    mainWindowTitle: "$t(productName)",

    // Scenario: User has a popped out window showing an ongoing call. This text is the title of
    // that window. The title is not displayed in the window itself, but is visible when the window
    // is listed by the OS e.g. in Task Manager or alt+tab view.
    // Use: As a Window title
    // Purpose: Informs user that this window contains an ongoing call
    // Max length: N/A
    // Read out: false
    inCallWindowTitle: "$t(productName) - Call",

    // Scenario: User has a popped out window showing an incoming call. This is not visible when
    // viewing the window directly, but is visible when the window is listed by the OS e.g. in Task
    // Manager or alt+tab view.
    // Use: As a Window title
    // Purpose: Informs user that this window contains an incoming call
    // Max length: N/A
    // Read out: false
    incomingCallWindowTitle: "$t(productName) - Incoming Call",

    // Scenario: The user is launching the app
    // Use: Underneath the MaX UC logo in the splash screen
    // Purpose: Lets the user know that the app is in the process of launching
    // Max length: N/A
    // Read out: true
    startupScreenText: "Starting up...",

    // Scenario: The user is attempting to quit the app
    // Use: As a Window title
    // Purpose: Informs user that this window contains controls to allow them to quit the app
    // Max length: N/A
    // Read out: false
    quitDialogTitle: "Quit application?",

    // Scenario: The user is attempting to quit the app
    // Use: Plain text in a popup text box followed by two buttons indicating "yes" and "no"
    // Purpose: Lets the user know they're in the process of quitting the app and gives them the
    // option to do so or abort.
    // Max length: N/A
    // Read out: true
    quitDialogMessage: "Are you sure you want to quit?",

    // Scenario: The user is attempting to quit the app
    // Use: In a button at the bottom of a popup text box
    // Purpose: Label for the button that will quit the app
    // Max length: N/A
    // Read out: true
    yes: "Yes",

    // Scenario: The user is attempting to quit the app
    // Use: In a button at the bottom of a popup text box
    // Purpose: Label for the button that will cancel the quitting
    // Max length: N/A
    // Read out: true
    no: "No",

    // Scenario: The user is viewing presence information for themselves or a contact
    // Use: Text associated with their avatar or a contact's name
    // Purpose: Lets the user know that the person's presence is "online"
    // Max length: N/A
    // Read out: true
    online: "Online",

    // Scenario: The user is viewing presence information for themselves or a contact
    // Use: Text associated with their avatar or a contact's name
    // Purpose: Lets the user know that the person's presence is "away"
    // Max length: N/A
    // Read out: true
    away: "Away",

    // Scenario: The user is viewing presence information for themselves or a contact
    // Use: Text associated with their avatar or a contact's name
    // Purpose: Lets the user know that the contact's presence is "Do not disturb"
    // Max length: N/A
    // Read out: true
    doNotDisturb: "Do not disturb",

    // Scenario: The user is viewing presence information for themselves or a contact
    // Use: Text associated with their avatar or a contact's name
    // Purpose: Lets the user know that the person's presence is "busy"
    // Max length: N/A
    // Read out: true
    busy: "Busy",

    // Scenario: The user is viewing presence information for themselves or a contact
    // Use: Text associated with their avatar or a contact's name
    // Purpose: Lets the user know that the person's presence is "in a meeting"
    // Max length: N/A
    // Read out: true
    inAMeeting: "In a meeting",

    // Scenario: The user is viewing presence information for themselves or a contact
    // Use: Text associated with their avatar or a contact's name
    // Purpose: Lets the user know that the person's presence is "in a call"
    // Max length: N/A
    // Read out: true
    inACall: "In a call",

    // Scenario: The user is viewing presence information for themselves or a contact
    // Use: Text associated with their avatar or a contact's name
    // Purpose: Lets the user know that the contact's presence is "offline"
    // Max length: N/A
    // Read out: true
    offline: "Offline",

    // Scenario: The user is viewing the presence of a contact
    // Use: Text underneath the contact's name
    // Purpose: Lets the user know that the contact has not yet accepted their request for presence
    // information and chat
    // Max length: 35
    // Read out: true
    waitingForAuthorisation: "Waiting for authorisation",

    // Scenario: The user is viewing the presence of a contact
    // Use: Text underneath the contact's name
    // Purpose: Lets the user know that the presence of the contact is unknown
    // Max length: N/A
    // Read out: true
    unknown: "Unknown",

    // Scenario: The user is viewing a contact who they haven't requested chat permission with
    // Use: Text underneath the contact's name
    // Purpose: Lets the user know that they can't chat with this contact
    // Max length: N/A
    // Read out: true
    notAuthorised: "Not authorised",

    // Scenario: The user is using a screen-reader to readout on/off buttons (e.g. for muting or
    // putting a call on hold).
    // Use: Screen-reader label indicating that an on/off button is currently "on"
    // Purpose: Lets the user know that the on/off button is currently "on"
    // Max length: N/A
    // Read out: true
    on: "On",

    // Scenario: The user is using a screen-reader to readout buttons controlling a call
    // Use: Screen-reader label indicating that an on/off button is currently "off"
    // Purpose: Lets the user know that the on/off button is currently "off"
    // Max length: N/A
    // Read out: true
    off: "Off",

    // Scenario 1: The user is viewing a contact's phone number in one of several places
    // Use 1: Text next to the phone number
    // Purpose 1: Lets the user know that this phone number is a work number
    // Read out 1: true
    // Scenario 2: The user is viewing a contact's postal address in one of several places
    // Use 2: Text next to the postal address
    // Purpose 2: Lets the user know that this postal address is a work address
    // Read out 2: true
    // Max length: N/A
    work: "Work",

    // Scenario 1: The user is viewing a contact's phone number in one of several places
    // Use 1: Text next to the phone number
    // Purpose 1: Lets the user know that this phone number is a home number
    // Read out 1: true
    // Scenario 2: The user is viewing a contact's postal address in one of several places
    // Use 2: Text next to the postal address
    // Purpose 2: Lets the user know that this postal address is a home address
    // Read out 2: true
    // Max length: N/A
    home: "Home",

    // Scenario: The user is viewing a contact's phone number in one of several places
    // Use: Text next to the phone number
    // Purpose: Lets the user know that this phone number is of type "other", i.e. does not fit one
    // of home, work, mobile or fax.
    // Read out: true
    // Max length: N/A
    other: "Other",

    // Scenario: The user is viewing a contact's phone number in one of several places
    // Use: Text next to the phone number
    // Purpose: Lets the user know that this phone number is a mobile number
    // Read out: true
    // Max length: N/A
    mobile: "Mobile",

    // Scenario: The user is viewing a contact's phone number in one of several places
    // Use: Text next to the phone number
    // Purpose: Lets the user know that this phone number is for a fax machine
    // Read out: true
    // Max length: N/A
    fax: "Fax",

    // Scenario: The user is part way through performing a cancellable action, e.g. deleting a
    // contact or changing their custom status
    // Use: Button text
    // Purpose: Allows the user the option of cancelling (aborting) the action they're partway
    // through doing
    // Read out: true
    // Max Length: N/A
    cancel: "Cancel",

    // Scenario: The user is updating some information such as their custom status or a contact's
    // details
    // Use: Button text
    // Purpose: Save whatever changes the user has made
    // Read out: true
    // Max Length: 10
    save: "Save",

    // Scenario: The user has navigated to the avatar menu showing their current custom status
    // Use: A button underneath the custom status
    // Purpose: Lets the user edit their custom status
    // Read out: true
    // Max Length: 12
    edit: "Edit",

    // Scenario: The user has navigated to the avatar menu showing their current custom status
    // Use: A button underneath the custom status
    // Purpose: Lets the user clear their current custom status
    // Read out: true
    // Max Length: 12
    clear: "Clear",

    // Scenario: The user has selected Do Not Disturb and a banner has appeared signifying that
    // Use: Text for the banner
    // Purpose: Informs the user that Calls are rejected when they have Do Not Disturb selected as
    // their presence. It also states that Chat messages and meeting invites have not yet been added
    // to this functionality and will be added in a future update.
    // Max Length: About 120 characters
    // Read out: true
    dNDBanner:
      "Calls will be rejected while in Do Not Disturb. Chat messages & meeting invites will be added in a future update.",

    // Scenario: Part of the app is not responding and a banner has appeared signifying that
    // Use: Text for the banner
    // Purpose: Informs the user that the client will probably not function as usual because there
    // has been an error, and if the error doesn't go away, they should contact their IT admin.
    // Max Length: About 120 characters
    // Read out: true
    javaDownBanner:
      "Your client has hit an error and may be unresponsive while we fix the issue. If the problem persists, contact your IT admin.",

    // Scenario: The user has no call or chat functionality available (possibly because they have
    // no internet connection) and a banner has appeared signifying that
    // Use: Text for the banner
    // Purpose: Informs the user that chat messages and calls won't be able to be received, and that
    // they should check if they are connected to internet.
    // Max Length: About 120 characters
    // Read out: true
    noChatOrCallsBanner:
      "Your client is offline and will not receive calls or messages. Check your internet connection.",

    // Scenario: The user has no chat functionality available and a banner has appeared signifying that
    // Use: Text for the banner
    // Purpose: Informs the user that chat messages won't be able to be received or sent, but calls will
    // still work normally
    // Max Length: About 120 characters
    // Read out: true
    noChatBanner:
      "Your chat service is offline and you cannot send or receive messages. Calls will still ring your device.",

    // Scenario: The user has no call functionality available and a banner has appeared signifying that
    // Use: Text for the banner
    // Purpose: Informs the user that calls won't be able to be received or made, but chat will
    // still work normally
    // Max Length: About 120 characters
    // Read out: true
    noCallsBanner:
      "Your call service is offline and you cannot make or receive calls. You can still send and receive chat messages.",

    // Scenario: A banner has appeared indicating something important to the user
    // Use: Text for the dismiss button of the banner. The button will dismiss the banner
    // Purpose: Dismiss alert screen reader text.
    // Max Length: N/A
    // Read out: true
    dismissBanner: "Dismiss alert",

    // Scenario: A banner has appeared indicating something important to the user
    // Use: Button tooltip text.
    // Purpose: The button will dismiss the banner
    // Max Length: N/A
    // Read out: false
    dismiss: "Dismiss",

    // Scenario: The user focuses their mouse or keyboard on their profile picture in the main app
    // window, which when clicked will open a menu with buttons to update their profile settings
    // Use: Tooltip text for the button
    // Purpose: Informs the user that clicking the button will open a menu with options to update
    // their profile settings
    // Max Length: N/A
    // Read out: false
    profile: "Profile",

    // Scenario: The user focuses their mouse or keyboard on their profile picture in the main app
    // window, which when clicked will open a menu with buttons to update their profile settings
    // Use: Screen reader text for the button
    // Purpose: Informs the user that clicking the button will open a menu with options to update
    // their profile settings. Also informs the user about their currently set presence status
    // (Online, Busy, etc.) and custom presence status.
    // Max Length: N/A
    // Read out: true
    // {{status}} is the user's status, e.g. Online, Busy, Offline, etc
    // {{customStatus}} is the custom status message that the user sets for themselves
    profileButtonStatus: "Profile menu, status {{status}} {{customStatus}}",

    // Scenario: The user is interacting with the add button by hovering or screen-reader
    // Use: Tooltip or screen-reader text
    // Purpose: Informs the user this will open the "add" menu with multiple options e.g. Add
    // contact, Add call, etc.
    // Max length: N/A
    // Read out: true
    add: "Add",

    // Scenario: The user is interacting with the "contacts" tab button by hovering or screen-reader
    // Use: Tooltip or screen-reader text
    // Purpose: Informs the user that this is the "contacts" button which changes the panel view to
    // show the Contact list this user has.
    // Max length: N/A
    // Read out: true
    contacts: "Contacts",

    // Scenario: The user is interacting with the "calls" tab button by hovering or screen-reader
    // Use: Tooltip or screen-reader text
    // Purpose: Informs the user that this is the "calls" button which changes the panel view to
    // show the call list this user has.
    // Max length: N/A
    // Read out: true
    calls: "Calls",

    // Scenario: The user is using a screen-reader to read the contents of the sidebar
    // Use: The screen-reader text (aria-label) of the calls tab button in the sidebar
    // Purpose: Tells the screen-reader to read out the number of new missed calls the user has
    // with 9 or more treated as "9 plus".
    // Note that the only text to translate here is "new" and "9+ new".
    // Max length: N/A
    // Read out: true
    callsLabel_interval: `
       (0) [$t(calls)];
       (1-9) [$t(calls), {{count}} new];
       (10-inf) [$t(calls), 9+ new];`,

    // Scenario: The user has hovered over the Chats button
    // Use: Tooltip text on Chats button
    // Purpose: The user is viewing the tooltip of the Chats button which changes the panel view to
    // show the Chat history list this user has.
    // Scenario 2: The user is using a screen-reader to read the contents of the sidebar
    // Use 2: The screen-reader text (aria-label) of the Chats button in the sidebar
    // Purpose 2: Tells the screen-reader to read out "Chats" meaning the functionality of opening
    // the Chats panel
    // Max length: N/A
    // Read out: true
    chats: "Chats",

    // Scenario: The user is using a screen-reader to read the contents of the sidebar
    // Use: The screen-reader text (aria-label) of the chat tab button in the sidebar
    // Purpose: Tells the screen-reader to read out the number of unread chats the user has, with 10
    // or more treated as "9 plus".
    // Note that the only text to translate here is "unread" and "9+ unread".
    // Max length: N/A
    // Read out: true
    chatsLabel_interval: `
       (0) [$t(chats)];
       (1-9) [$t(chats), {{count}} unread];
       (10-inf) [$t(chats), 9+ unread];`,

    // Scenario: The user is interacting with the "meetings" tab button by hovering or screen-reader
    // Use: Tooltip or screen-reader text
    // Purpose: Informs the user that this is the "meetings" button which changes the panel view to
    // show the chats list this user has.
    // Max length: N/A
    // Read out: true
    meetings: "Meetings",

    // Scenario: The user is interacting with the "voicemail" button by hovering or screen-reader
    // Use: Tooltip or screen-reader text
    // Purpose: Informs the user that this is the "voicemail" button which opens a page in the
    // browser where the user can view their voicemails
    // Max length: N/A
    // Read out: true
    voicemail: "Voicemail",

    // Scenario: The user is using a screen-reader to read the contents of the sidebar
    // Use: The screen-reader text (aria-label) of the chat tab button in the sidebar
    // Purpose: Tells the screen-reader to read out the number of unread chats the user has, with 9
    // or more treated as "9 plus".
    // Note that the only text to translate here is "new" and "9+ new".
    // Max length: N/A
    // Read out: true
    voicemailLabel_interval: `
       (0) [$t(voicemail)];
       (1-9) [$t(voicemail), {{count}} new];
       (10-inf) [$t(voicemail), 9+ new];`,

    // Scenario: The user is interacting with the "report a bug" button by hovering or screen-reader
    // Use: Tooltip or screen-reader text
    // Purpose: Informs the user that this is the "report a bug" button which opens a pop-up giving
    // the user information on how to report a bug.
    // Max length: N/A
    // Read out: true
    reportBug: "Report a bug",

    // Scenario: The user is interacting with the "send feedback" button by hovering or
    // screen-reader
    // Use: Tooltip or screen-reader text
    // Purpose: Informs the user that this is the "send feedback" button which opens a page in the
    // browser where the user can send feedback.
    // Max length: N/A
    // Read out: true
    sendFeedback: "Send feedback",

    // Scenario: The user has opened a menu with actions related to their account or the application
    // Use: Text that appears on a button for setting a custom status message
    // Purpose: Tells the user the purpose of the button
    // Max length: N/A
    // Read out: true
    setCustomStatus: "Set custom status",

    // Scenario: The user's keyboard or mouse focus is on a menu button to set their presence
    // status, the button shows the current status of the user.
    // Use: Screen reader text that gets read when the keyboard or mouse is focused on the button.
    // Purpose: Tells the user that the button is used to set their presence status, and also inform
    // them of their currently set status.
    // Max length: N/A
    // Read out: true
    // {{currentStatus}} is the user's current status, e.g. Online, Busy, Offline, etc
    setStatusCurrentStatus: "Set status, current status {{currentStatus}}",

    // Scenario: The user has opened a submenu with actions to change their presence
    // Use: Text that appears on a button for opening the call manager functionality
    // Purpose: Tells the user the purpose of the button
    // Max length: N/A
    // Read out: true
    openCallManager: "Open call manager",

    // Scenario: The user has opened a menu with actions related to their account or the application
    // Use: Text that appears on a button
    // Purpose: Tells the user the purpose that the button will let them change their avatar
    // Max length: N/A
    // Read out: true
    changeAvatar: "Change avatar",

    // Scenario: The user has opened a menu with actions related to their account or the application
    // Use: Text that appears on a button
    // Purpose: Tells the user that the button will let them change their password
    // Max length: N/A
    // Read out: true
    changePassword: "Change password",

    // Scenario: The user has opened a menu with actions related to their account or the application
    // Use: Text that appears on a button
    // Purpose: Tells the user that the button will open the Settings window
    // Max length: N/A
    // Read out: true
    settings: "Settings",

    // Scenario: The user has opened a menu with actions related to their account or the application
    // Use: Text that appears on a button
    // Purpose: Tells the user the button will let them open the Settings window
    // Max length: N/A
    // Read out: true
    checkForUpdates: "Check for updates",

    // Scenario: The user has opened a menu with actions related to their account or the application
    // Use: Text that appears on a button for opening the Help window
    // Purpose: Tells the user the purpose of the button
    // Max length: N/A
    // Read out: true
    help: "Help",

    // Scenario: The user has opened a menu with actions related to their account or the application
    // Use: Text that appears on a button for logging out of the application
    // Purpose: Tells the user the purpose of the button
    // Max length: N/A
    // Read out: true
    logOut: "Log out",

    // Scenario: The user has opened a menu with actions related to their account or the application
    // Use: Text that appears on a button for quitting the application
    // Purpose: Tells the user the purpose of the button
    // Max length: N/A
    // Read out: true
    quit: "Quit",

    // Scenario: The user has opened a menu with actions related to their account or the application
    // Use: Text that appears on a button for opening an About window that shows information about
    // the application
    // Purpose: Tells the user the purpose of the button
    // Max length: N/A
    // Read out: true
    about: "About",

    // Scenario: The application is running on a Mac and the user has opened a menu with actions
    // related to their account or the application
    // Use: Text that appears on a button to open an About window that shows information about the
    // application. Mac convention is that About item says the name of the app.
    // Purpose: Tells the user the purpose of the button
    // Max length: N/A
    // Read out: true
    aboutWithAppName: "About $t(productName)",

    // Scenario: The user has opened a text box for setting a custom status for their presence and
    // has not typed anything in the text box.
    // Use: Screen reader text that is read out when the user focuses on the text box.
    // Purpose: Tells the user the purpose of the text box and the character limit for the custom
    // status.
    // Max length: N/A
    // Read out: true
    customStatusTextDefault: "Set custom status, up to 100 characters",

    // Scenario: The user has typed something in a text box for setting a custom status for their
    // presence.
    // Use: Screen reader text that is read out after the user types something in the text box.
    // Purpose: Tells the user what they have typed so far and the amount of characters they can
    // still type for the custom status
    // Max length: N/A
    // Read out: true
    // {{customStatusText}} is what the user has typed so far for their custom status
    // {{remainingCharacters}} is the number of characters the user still have left for their status
    customStatusText: "{{customStatusText}}, remaining characters {{remainingCharacters}}",

    // Scenario: A button to start a new call
    // Use: Button inside a menu that allows the user to start or create new things (e.g. calls,
    // contacts, meetings,...)
    // Purpose: Switch the focus to the "search or dial number" input, so the user can make a call
    // Max length: N/A
    // Read out: true
    newCall: "New call",

    // Scenario: A button to create a new group chat
    // Use: Button inside a menu that allows the user to create a new group chat
    // Purpose: Open a window for creating a new group chat
    // Max length: N/A
    // Read out: true
    newGroupChat: "New group chat...",

    // Scenario: A button to add a new contact
    // Use: Button inside a menu to add stuff to users (call, contacts, schedule meeting, ...)
    // Purpose: Open a new window, where the user may add a new contact to their contact list
    // Max length: N/A
    // Read out: true
    addContact: "Add contact",

    // Scenario: User is calling one of their contacts
    // Use: Call status text below contact's name
    // Purpose: Provide a feedback to the user that the call is starting, and
    // they are being connected to the target contact
    // Max length: 22
    // Read out: true
    connecting: "Connecting...",

    // Scenario: User is receiving a call from one of their contacts
    // Use: Call status text below contact's name
    // Purpose: Provide a feedback to the user that a given contact is calling them
    // Max length: 22
    // Read out: true
    ringing: "Ringing...",

    // Scenario: User is looking at their list of chats or past calls
    // Use: Text associated with the chat/call
    // Purpose: To let the user know the call happened or chat was updated less than 1 minute ago
    // Read out: true
    // Max length: 9
    justNow: "Just now",

    // Scenario: User wants to look for a giving contact or dial a given number to call it
    // Use: Placeholder hint text in an input field
    // Purpose: Lets the user know the purpose of the given input text is to search for contacts
    // or to dial a number to be called
    // Max length: 31
    // Read out: true
    searchOrDialNumber: "Search or dial number",

    // Scenario: The user has typed a search term in the search bar and there is one result
    // Use: Screen reader text that gets read out after the user has typed in the search bar
    // Purpose: Lets the user know the number of results for their search
    // Max length: N/A
    // Read out: true
    // {{count}} is the number of results for the search
    resultCount_interval: `
    (0) [No results];
    (1) [1 result];
    (2-inf) [{{count}} results]`,

    // Scenario: The user has typed some digits into the search bar. This has lead to one
    // contact being matched by the search and a small popdown appearing below the bar
    // indicating that they can hit enter to dial the typed number.
    // Use: Screen reader text
    // Purpose: Lets the user know that they can press enter to call the phone number they've typed
    // in the search bar and that one contact has been matched by their search
    // Max length: N/A
    // Read out: true
    // {{count}} is the number of results for the search
    resultCountOrEnterToCall_interval: `
    (0) [No results or press enter to call];
    (1) [1 result or press enter to call];
    (2-inf) [{{count}} results or press enter to call]`,

    // Scenario: The user has typed a search term in the search bar and there are no results
    // Use: Title text of a message shown in the search results pane
    // Purpose: Lets the user know that there are no results for their search term
    // Max length: N/A
    // Read out: true
    noResults: "No results",

    // Scenario: The user has typed a search term in the search bar and there are no results
    // Use: Description text of a message shown in the search results pane, with a title "No
    // results"
    // Purpose: Lets the user know that search is only currently supported for contact details
    // Max length: N/A
    // Read out: true
    noResultsMessage: "Search is currently supported on the contacts tab for contact details only",

    // Scenario: The user is signed into the app, but they can't access chats
    // Use: When the user is not signed into chat
    // Purpose: To advise the user that they can't use chat functionality
    // Max Length: N/A
    // Read out: true
    chatDisabled: "Chat not available",

    // Scenario: The user is signed into the app, but they can't access chats
    // Use: When the user is not signed into chat
    // Purpose: To advise the user that they must sign into chat before being able
    // to view or use chat functionality
    // Max Length: N/A
    // Read out: true
    chatDisabledMessage:
      "Your chat conversations are only available when you are signed into chat.",

    // Scenario: The user is signed into the app, but they can't access chats
    // Use: When the user is not signed into chat
    // Purpose: Text on a button which signs the user into chat
    // Max Length: N/A
    // Read out: true
    signIntoChat: "Sign into chat",

    // Scenario: The user navigates to the calls list and there are no calls
    // Use: Description text of a message shown in the calls list, with a title
    // "You haven't made or received any calls yet!"
    // Purpose: Lets the user know they haven't made any calls yet.
    // Max length: N/A
    // Read out: true
    noCallsMessage: "You haven't made or received any calls yet!",

    // Scenario: The user navigates to the chats list and there are no messages
    // Use: Description text of a message shown in the chats list, with a title
    // "You haven't made or received any chats yet!"
    // Purpose: Let's the user know they haven't sent or received any messages yet.
    // Max length: N/A
    // Read out: true
    noChatsMessage: "You haven't sent or received any messages yet!",

    // Scenario: User is viewing their list of contacts
    // Use: Title of the favourites section, above a bunch of contacts
    // Purpose: Tells the user that the below contacts are their favourites
    // Max length: N/A
    // Read out: true
    favourites: "Favourites",

    // Scenario: User is viewing a list of chats, contacts or calls
    // Use: Part of the screen reader text to be read out for the contact/chat/call
    // Purpose: Tells the user that they are "favourite contact"
    // Max length: N/A
    // Read out: true
    favouritesContact: "Favourite contact",

    // Scenario: User is viewing a list of chats, contacts or calls
    // Use: Part of the screen reader text to be read out for the contact/chat/call
    // Purpose: Tells the user that they have "notify when available" turned on for that contact, or
    // the contact with whom the chat/call is with. "Notify when available" is functionality that
    // a user can turn on for a contact that is currently non-contactable (e.g. in a call, offline
    // etc...). It will send them a notification when the contact is contactable again.
    // Max length: N/A
    // Read out: true
    watchingAvailability: "Watching availability",

    // Scenario: User is viewing their list of all past calls
    // Use: Beginning of the screen-reader text to be read out describing a past call
    // Purpose: Tells the user that this call was missed and they haven't seen it yet
    // Max length: N/A
    // Read out: true
    newComma: "New, ",

    // Scenario: User is viewing their list of all past calls
    // Use: The screen-reader text to be read out describing a past call
    // Purpose: Tells the user about the call. It will say the type of the call, who its from, what
    // their name and presence is, and when the call was made. For example:
    // "Incoming call from Alice Appleson (online) at 16:14pm".
    // Max length: N/A
    // Read out: true
    // {{type}} is the call type, e.g. "Incoming call", "Missed call", etc
    // {{nameAndPresence}} is the name and presence of the caller, e.g. "John Smith, Online"
    // {{- time}} is time of the call
    xCallFromNamePresenceAtTime: "{{type}} from {{nameAndPresence}} at {{- time}}",

    // Scenario 1: User is viewing past calls, either with a specific user or globally
    // Use 1: Text on page next to the call or to be read by a screen-reader
    // Purpose 1: Lets the user know that this was an incoming call that they answered (i.e. didn't
    // miss)
    // Scenario 2: User is receiving an incoming call.
    // Use 2: Text below the contact name or phone number in the window that pops up with the option
    // to accept or reject the call.
    // Purpose 2: Informs the user that they are receiving an incoming call.
    // Max length: N/A
    // Read out: true
    incomingCall: "Incoming call",

    // Scenario: User is viewing past calls, either with a specific user or globally
    // Use: Text on page next to the call or to be read by a screen-reader
    // Purpose: Lets the user know that this was an outgoing call (i.e. one they placed)
    // Max length: N/A
    // Read out: true
    outgoingCall: "Outgoing call",

    // Scenario: User is viewing past calls, either with a specific user or globally
    // Use: Text on page next to the call or to be read by a screen-reader
    // Purpose: Lets the user know that they missed this call
    // Max length: N/A
    // Read out: true
    missedCall: "Missed call",

    // Scenario: User is viewing the list of chats
    // Use: Part of screen-reader text describing a particular chat
    // Purpose: Lets the user know that the chat contains unread messages
    // Max length: N/A
    // Read out: true
    unreadMessages: "unread messages",

    // Scenario: User has navigated to the meetings tab
    // Use: Displayed on a large button
    // Purpose: Lets the user know that the button that will open a dialog to create a meeting
    // Max length: 14
    // Read out: true
    create: "Create",

    // Scenario: User has navigated to the meetings tab
    // Use: Screen-reader text for a button
    // Purpose: Lets the user know that the button will open a dialog to create a meeting
    // Max length: N/A
    // Read out: true
    createAMeeting: "Create a meeting",

    // Scenario: User has navigated to the meetings tab
    // Use: Displayed on a large button
    // Purpose: Description of button that will open a dialog to invite a contact to an ongoing
    // meeting
    // Max length: 14
    // Read out: true
    invite: "Invite",

    // Scenario: The user is in a meeting and is using a screen-reader to read a button which will
    // invite some new to the meeting
    // Use: The screen-reader text of the  button
    // Purpose: Tells the screen-reader to tell the user that this button will open a dialog to
    // invite other people to the current meeting
    // Max length: N/A
    // Read out: true
    inviteOthers: "Invite others to meeting",

    // Scenario: The User is viewing a section with buttons that perform actions on meetings
    // Use: Text on a button used to schedule a new meeting
    // Purpose: Tell user that the button is used to schedule a new meeting, they're already aware
    // that the button is for meetings, hence the word "schedule" is sufficient.
    // Max length: 15
    // Read out: true
    schedule: "Schedule",

    // Scenario: The user is interacting with one of two buttons that can schedule a new meeting
    // Use: Screen reader text and button text
    // Purpose: Tell user that the button is used to schedule a new meeting
    // Max length: N/A
    // Read out: true
    scheduleAMeeting: "Schedule a meeting",

    // Scenario: The User is viewing a section with buttons about meetings
    // Use: Text on a button used to join an existing meeting in progress
    // Purpose: Tell user that the button is used to join an existing meeting in progress
    // Max length: 30
    // Read out: true
    joinAMeeting: "Join a meeting",

    // Scenario: The User is viewing a section with buttons about meetings
    // Use: Text on a button used to view scheduled meetings
    // Purpose: Tell user that the button is used to view scheduled meetings
    // Max length: 30
    // Read out: true
    viewUpcomingMeetings: "View upcoming meetings",

    // Scenario: The User is viewing a section with buttons about meetings
    // Use: Text on a button used to view meeting recordings
    // Purpose: Tell user that the button is used to view meeting recordings
    // Max length: 30
    // Read out: true
    viewRecordedMeetings: "View recorded meetings",

    // Scenario: The User is viewing a section with buttons about meetings
    // Use: Text to inform the user how to use meeting links when viewing possible meeting actions
    // Purpose: Tell user to use a meeting link directly if they have one
    // Max length: N/A
    // Read out: true
    ifYouReceivedAnInvitationLinkClickOnTheLink:
      "If you received an invitation link, click on the link to join the meeting",

    // Scenario: The User is viewing a section with buttons that act upon a contact
    // Use: Hint text that appears when the user hovers their mouse pointer over a button used to
    // start a meeting with a contact
    // Purpose: Tell user that the button is used to start a meeting with a contact
    // Max length: N/A
    // Read out: true
    startMeeting: "Start meeting",

    // Scenario: The User is viewing a section with buttons that act upon a contact
    // Use: Hint text that appears when the user hovers their mouse pointer over a button used to
    // invite a contact to an ongoing meeting
    // Purpose: Tell user that the button is used to invite a contact to an ongoing meeting
    // Max length: N/A
    // Read out: true
    inviteToMeeting: "Invite to meeting",

    // Scenario: The User is viewing a section with buttons that act upon a contact
    // Use: Hint text that appears when the user hovers their mouse pointer over a button used to
    // make a call to a contact
    // Purpose: Tell user that the button is used to make a call to a contact
    // Max length: N/A
    // Read out: true
    call: "Call",

    // Scenario: The User is viewing a section with buttons that act upon a contact. The contact
    // has multiple phone numbers associated to them.
    // Use: Screen reader that appears on focus of a button used to open a menu to pick the
    // number to call.
    // Purpose: Tell user that the button is used to make a call to a contact, and the number
    // of available phone numbers they can select from.
    // Max length: N/A
    // Read out: true
    // {{count}} is the number of phone numbers associated with the contact, always more than one
    callMultiLabel: "Call, {{count}} numbers available",

    // Scenario: The User is viewing a section with buttons that act upon a contact
    // Use: Hint text that appears when the user hovers their mouse pointer over a button used to
    // display additional actions for the contact
    // Purpose: Tell user that the button is used to display additional actions for the contact
    // Max length: N/A
    // Read out: true
    more: "More",

    // Scenario: The user is interacting with the add/transfer menu during a call
    // Use: Tooltip for the add/transfer button and header for the menu that the add/transfer button
    // opens
    // Purpose: Informs that this section of the app gives them options to add someone to this call
    // or transfer the call to someone else
    // contact, Add call, etc.
    // Max length: N/A
    // Read out: true
    addOrTransfer: "Add or transfer",

    // Scenario: The User is viewing a section with buttons that act upon a contact while in a call
    // with them
    // Use: Tooltip of a button
    // Purpose: Tell user that the button is used to start recording the in-progress call
    // Max length: N/A
    // Read out: true
    record: "Record",

    // Scenario: The User is navigating through buttons to control an ongoing call
    // Use: Read out as screen reader text
    // Purpose: Tell user that this button is the hold toggle button - the button which switches
    // hold from off to on or on to off
    // Max length: N/A
    // Read out: true
    holdToggle: "Hold toggle",

    // Scenario: The User is navigating through buttons to control an ongoing call
    // Use: Read out as screen reader text
    // Purpose: Tell user that this button is the mute toggle button - the button which switches
    // mute from off to on or on to off
    // Max length: N/A
    // Read out: true
    muteToggle: "Mute toggle",

    // Scenario: The User is viewing a section with buttons that act upon an in-progress call
    // Use: Hint text that appears when the user hovers their mouse pointer over a button to mute
    // the microphone for the in-progress call
    // Purpose: Tell user that the button is used to mute the microphone for the in-progress call
    // Max length: N/A
    // Read out: true
    mute: "Mute",

    // Scenario: The User is viewing a section with buttons that act upon an in-progress call
    // Use: Hint text that appears when the user hovers their mouse pointer over a button to unmute
    // the microphone for the in-progress call
    // Purpose: Tell user that the button is used to unmute the microphone for the in-progress call
    // Max length: N/A
    // Read out: true
    unmute: "Unmute",

    // Scenario: The User is viewing a section with buttons that act upon an in-progress call
    // Use: Hint text that appears when the user hovers their mouse pointer over a buttonto put the
    // in-progress call on hold
    // Purpose: Tell user that the button is used to put the in-progress call on hold
    // Max length: N/A
    // Read out: true
    putOnHold: "Put on hold",

    // Scenario: The User is viewing a section with buttons that act upon an in-progress call
    // Use: Hint text that appears when the user hovers their mouse pointer over a button to take
    // the in-progress call off hold
    // Purpose: Tell user that the button is used to take the in-progress call off hold
    // Max length: N/A
    // Read out: true
    takeOffHold: "Take off hold",

    // Scenario: The User is viewing a section with buttons that act upon an in-progress call
    // Use: Hint text that appears when the user hovers their mouse pointer over a button to end the
    // call
    // Purpose: Tell user that the button is used to end the call
    // Max length: N/A
    // Read out: true
    hangUp: "Hang up",

    // Scenario: The user is in a call and has moved their computer's focus away from the main
    // client window, so the in-call UI has popped out into a small, separate dialog.
    // Use: Hint text that appears when the user hovers their mouse pointer over a button on the
    // separate in-call dialog.
    // Purpose: Tell the user that pressing that button will move the separate dialog back into the
    // main application window, which will also display the contact that the user is in a call with
    // and bring the main window into focus.
    // Max length: N/A
    // Read out: true
    dockWindow: "Dock window",

    // Scenario: The User is viewing a section with buttons that act upon an in-progress call
    // Use: Hint text that appears when the user hovers their mouse pointer over a button to show
    // additional actions for the call
    // Purpose: Tell user that the button is used to show additional actions for the call
    // Max length: N/A
    // Read out: true
    moreCallActions: "More call actions",

    // Scenario: The User is in a call and viewing a submenu with actions to tranfer the call or add
    // a new party to the call
    // Use: Text that appears on a button to add an additional party to the in-progress call
    // Purpose: Tell user that the button is used to add an additional party to the in-progress call
    // Max length: N/A
    // Read out: true
    addSomeoneToThisCall: "Add someone to this call",

    // Scenario: The User is in a call and viewing a submenu with actions to tranfer the call or add
    // a new party to the call
    // Use: Text that appears on a button to perform an attended transfer of the in-progress call
    // Purpose: Tell user that the button is used to perform an attended transfer of the in-progress
    // call
    // Max length: N/A
    // Read out: true
    attendedTransfer: "Attended transfer",

    // Scenario: The User is in a call and viewing a submenu with actions to transfer the call or
    // add a new party to the call
    // Use: Additional text that appears on a button to perform an attended transfer of the
    // in-progress call
    // Purpose: Remind the user that attended transfer forms a three-way call where they will speak
    // with all parties
    // Max length: N/A
    // Read out: true
    brSpeakFirst: "(Speak first)",

    // Scenario: The User is in a call and viewing a submenu with actions to tranfer the call or add
    // a new party to the call
    // Use: Text that appears on a button to perform a blind transfer of the in-progress call
    // Purpose: Tell user that the button is used to perform a blind transfer of the in-progress
    // call. A "blind-transfer" is when caller 1 is transferred by caller 2 to caller 3 immediately
    // without caller 2 speaking to caller 3 first.
    // Max length: N/A
    // Read out: true
    blindTransfer: "Blind transfer",

    // Scenario: The User is in a call and viewing a submenu with actions to tranfer the call or add
    // a new party to the call
    // Use: Additional text that appears on a button to perform a blind transfer of the in-progress
    // call
    // Purpose: Remind the user that blind transfer performs an immediate transfer of their current
    // remote party
    // Max length: N/A
    // Read out: true
    brImmediate: "(Immediate)",

    // Scenario: The user clicks the "more" button (3 dots) on a selected contact
    // Use: Title of a menu
    // Purpose: Labels the menu of operations the user can do on a selected contact
    // Read out: true
    // Max Length: N/A
    menuMoreOptions: "More options",

    // Scenario: The user clicks the "more" button while in a call
    // Use: Title of a menu
    // Purpose: Labels the menu of operations the user can do while in a call
    // Read out: true
    // Max Length: N/A
    menuMoreCallActions: "More call actions",

    // Scenario: The user clicks the "more" button or add to favourites button on a selected contact
    // Use: Clickable menu item/ clickable button
    // Purpose: The user clicks on this to add a selected contact to "favourites",
    // Read out: true
    // Max Length: N/A
    addToFavourites: "Add to favourites",

    // Scenario: The user clicks the "more" button or remove to favourites button on a selected
    // contact
    // Use: Clickable menu item/ clickable button
    // Purpose: The user clicks on this to remove a selected contact from "favourites",
    // Read out: true
    // Max Length: N/A
    removeFromFavourites: "Remove from favourites",

    // Scenario: The user clicks the "more" button while in a call
    // Use: Clickable menu item
    // Purpose: The user clicks on this to ring another device that they are also logged in on and
    // continue the call there
    // Read out: true
    // Max Length: N/A
    moveCallToAnotherDevice: "Move call to another device",

    // Scenario: The user clicks the "more" button while in a call
    // Use: Clickable menu item
    // Purpose: The user clicks on this to open a dialpad to enter DTMF while in a call
    // Read out: true
    // Max Length: N/A
    showKeypad: "Show keypad",

    // Scenario: The user clicks the "hide dialpad" button
    // Use: Clickable menu item
    // Purpose: The user clicks on this to hide the dialpad
    // Read out: true
    // Max Length: N/A
    hideKeypad: "Hide keypad",

    // Scenario: The user is interacting with a button or menu item that toggles "notify when
    // available" (receive a notification when the contact's presence changes to "online")
    // Use: Tooltip, screen-reader text, menu item text
    // Purpose: Informs the user that this button/menu item will toggle "notify when available".
    // "Notify when available" is functionality that a user can turn on for a contact that is
    // currently non-contactable (e.g. in a call, offline etc...). It will send them a notification
    // when the contact is contactable again.
    // Read out: true
    // Max Length: N/A
    notifyWhenAvailable: "Notify when available",

    // Scenario: The user is interacting with a button or menu item that toggles "notify when
    // available"(receive a notification when the contact's presence changes to "online") when it is
    // currently on
    // Use: Tooltip, menu item text
    // Purpose: Informs the user that this button/menu item will turn off "notify when available"
    // "Notify when available" is functionality that a user can turn on for a contact that is
    // currently non-contactable (e.g. in a call, offline etc...). It will send them a notification
    // when the contact is contactable again.
    // Read out: true
    // Max Length: N/A
    stopWatchingAvailability: "Stop watching availability",

    // Scenario 1: The user is trying to delete a contact, which would clear the chat history
    // Use 1: Button on a pop-up
    // Purpose 1: The user clicks on this to view chat history with a contact
    // Scenario 2: The user clicks the "more" button on a selected contact
    // Use 2: Clickable menu item
    // Purpose 2: The user clicks on this to view chat history with a contact
    // Read out: true
    // Max Length: N/A
    viewChatHistory: "View chat history",

    // Scenario: The user clicks the "more" button on a selected contact
    // Use: Clickable menu item
    // Purpose: The user clicks on this to edit the contact
    // Read out: true
    // Max Length: N/A
    editContact: "Edit contact",

    // Scenario: The user clicks the "more" button on a selected contact
    // Use: Clickable menu item
    // Purpose: The user clicks on this to delete the contact
    // Read out: true
    // Max Length: N/A
    deleteContact: "Delete contact",

    // Scenario: The screen-reader user is focused on the bell-icon button next to the name of a
    // contact and "notify when available" is enabled
    // Use: part of a screen-reader label of a bell-icon button that turns blue if NWA is enabled
    // The full label is "Notify when available: checked" or "Notify when available: unchecked"
    // Purpose: Tells the user that "notify when available" is enabled
    // "Notify when available" is functionality that a user can turn on for a contact that is
    // currently non-contactable (e.g. in a call, offline etc...). It will send them a notification
    // when the contact is contactable again.
    // Read out: true
    // Max Length: N/A
    // Scenario: The screen-reader user has focused a check-box, or something like a check-box, that
    // is checked.
    // Use: Screen-reader text
    // Purpose: Indicates the box is checked
    // Read out: true
    // Max length: N/A
    checked: "Checked",

    // Scenario: The screen-reader user is focused on the bell-icon button next to the name of a
    // contact and "notify when available" is disabled
    // Use: part of a screen-reader label of a bell-icon button that turns white if NWA is disabled
    // The full label is "Notify when available: checked" or "Notify when available: unchecked"
    // Purpose: Tells the user that "notify when available" is disabled
    // "Notify when available" is functionality that a user can turn on for a contact that is
    // currently non-contactable (e.g. in a call, offline etc...). It will send them a notification
    // when the contact is contactable again.
    // Read out: true
    // Max Length: N/A
    // Scenario: The screen-reader user has focused a check-box, or something like a check-box, that
    // is not checked.
    // Use: Screen-reader text
    // Purpose: Indicates the box is not checked
    // Read out: true
    // Max length: N/A
    unchecked: "Unchecked",

    // Scenario: The user clicks the handset-icon "Call" button on a contact with multiple phone
    // numbers
    // Use: Title of a menu
    // Purpose: Labels a menu of numbers the user can choose to call
    // Read out: true
    // Max Length: N/A
    selectNumber: "Select number",

    // Scenario: The user has selected a contact and they can either read/send messages or view
    // contact details
    // Use: Title of a tab
    // Purpose: The user clicks on this to switch to the conversation tab
    // Read out: true
    // Max Length: N/A
    conversation: "Conversation",

    // Scenario: The user has selected a contact and they can either read/send messages or view
    // contact details
    // Use: Title of a tab
    // Purpose: The user clicks on this to switch to the contact details tab
    // Read out: true
    // Max Length: N/A
    contactDetails: "Contact details",

    // Scenario: The user has sent/received some messages today
    // Use: Timestamp in a chat conversation
    // Purpose: Tells the user the messages were sent/received today
    // Read out: true
    // Max Length: N/A
    today: "Today",

    // Scenario: The user has unread chat messages
    // Use: Marker in a chat conversation
    // Purpose: Tells the user messages below the marker are unread
    // Read out: true
    // Max Length: N/A
    new: "New",

    // Scenario: The user has sent/received both IM and SMS in one chat
    // Use: Marker in a chat conversation
    // Purpose: Lets the user know whether the messages after this marker are IMs
    // Max length: N/A
    // Read out: true
    switchedToIM: "Switched to IM",

    // Scenario: The user has sent/received both IM and SMS in one chat
    // Use: Marker in a chat conversation
    // Purpose: Lets the user know whether the messages after this marker are SMSs
    // Max length: N/A
    // Read out: true
    switchedToSMS: "Switched to SMS",

    // Scenario 1: The user has sent/received an SMS
    // Use 1: Indicator on a chat message
    // Purpose 1: Differentiates an SMS from instant message (IM)
    // Max length: N/A
    // Read out: true
    //
    // Scenario 2: The user has typed a phone number in the search bar
    // Use 2: Button label
    // Purpose 2: Lets the user send SMS to the phone number they've typed
    // Max length: N/A
    // Read out: true
    sms: "SMS",

    // Scenario: The user is in a chat with a contact
    // Use: Text indicator in a chat conversation
    // Purpose: Tells the user that the contact they are chatting with is typing a message (the name
    // of the contact
    // comes before this string)
    // Read out: true
    // Max Length: N/A
    isTyping: "is typing ...",

    // Scenario: The user is viewing the chat history panel
    // Use: Text indicator for a chat
    // Purpose: Tells the user that the contact associated with that chat is typing a message
    // Read out: true
    // Max Length: N/A
    typing: "Typing...",

    // Scenario: The user is sending a message to a contact that can receive IM or SMS
    // Use: Screenreader label for button to expand menu to choose between IM or SMS
    // Purpose: Tells the user they can click here to choose between sending IM or SMS
    // Read out: true
    // Max Length: N/A
    expandMessagingOptions: "Expand messaging options",

    // Scenario: The user has opened a menu to choose between ways to message a contact
    // Use: Title of menu
    // Purpose: Tells the user to choose between sending IM or SMS
    // Read out: true
    // Max Length: N/A
    messagingOptions: "Messaging options",

    // Scenario: The user has opened a menu to choose between ways to message a contact
    // Use: Clickable menu item
    // Purpose: Lets the user choose to send IM instead of SMS
    // Read out: true
    // Max Length: N/A
    sendIMMessage: "Send IM message",

    // Scenario 1: The user has opened a menu to choose between ways to message a contact
    // Use 1: Clickable menu item
    // Purpose 1: Lets the user choose to send SMS to a specific phone number
    // Read out: true
    // Max Length: N/A
    //
    // Scenario 2: Screenreader user is presented with their contact's phone numbers
    // Use 2: screenreader button label
    // Purpose 2: Tells the user they can click this button to send an SMS to that number
    // Read out: true
    // Max Length: N/A
    sendSMStoPhoneNumberWithType: "SMS {{phoneNumber}} ({{numberType}})",

    // Scenario: Screenreader user is presented with a phone numbers
    // Use: screenreader button label
    // Purpose: Tells the user they can click this button to send an SMS to that number
    // Read out: true
    // Max Length: N/A
    sendSMStoPhoneNumber: "SMS {{phoneNumber}}",

    // Scenario: The user has a chat conversation open and can send an IM
    // Use: Placeholder prompt text in the chat message box
    // Purpose: Tells the user to type the message they'd like to send into that box
    // Read out: true
    // Max Length: N/A
    sendAMessage: "Send a message",

    // Scenario: The user has a chat conversation open and can send an SMS
    // Use: Placeholder prompt text in the chat message box
    // Purpose: Tells the user to type the message they'd like to send into that box
    // Read out: true
    // Max Length: N/A
    sendAnSMS: "Send an SMS to {{phoneNumber}}",

    // Scenario: The screen-reader user is focused on the emoji button in the chat message box
    // Use: Screen-reader label or tooltip for a smiley-icon button
    // Purpose: Tells the user to click the button to add emoji to a message they are sending
    // Read out: true
    // Max Length: N/A
    addEmoji: "Add emoji",

    // Scenario: The screen-reader user is focused on the add attachments button in the chat message
    // box
    // Use: Screen-reader label or tooltip for a paperclip-icon button
    // Purpose: Tells the user to click the button to send an attachment in a chat conversation
    // Read out: true
    // Max Length: N/A
    attach: "Attach",

    // Scenario: The user has started writing a message in the chat message box
    // Use: Hint text in the chat message box
    // Purpose: Tells the user how to send/add a line break to their message
    // Read out: true
    // {{platformMainModifierKey}} ctrl for Windows, cmd for Mac
    // Max Length: 90
    pressEnterToSendMessage:
      "Press Enter to send message. {{platformMainModifierKey}}-Enter for a new line.",

    // Scenario: The user is viewing the details of a phone number that does not belong to a contact
    // Use: Text on the button for adding the number as a contact.
    // Purpose: Informs the user the function of the button.
    // Max length: N/A
    // Read out: true
    addAsAContact: "Add as a contact",

    // Scenario: The user is viewing the details of a contact.
    // Use: Contact detail header.
    // Purpose: To indicate that the contact detail next to this header should be the contact's
    // nickname.
    // Max length: 15
    // Read out: true
    nickname: "Nickname",

    // Scenario: The user is viewing the details of a contact.
    // Use: Contact detail header.
    // Purpose: To indicate that the contact detail next to this header should be the contact's job
    // title.
    // Max length: 15
    // Read out: true
    jobTitle: "Job title",

    // Scenario: The user is viewing the details of a contact.
    // Use: Contact detail header.
    // Purpose: To indicate that the contact detail next to this header should be the contact's
    // company.
    // Max length: 15
    // Read out: true
    company: "Company",

    // Scenario: The user is viewing the details of a contact.
    // Use: Contact detail header.
    // Purpose: To indicate that the contact details next to this header should be the contact's
    // phone numbers.
    // Max length: 15
    // Read out: true
    phone: "Phone",

    // Scenario: The user is viewing the details of a contact.
    // Use: Contact detail header.
    // Purpose: To indicate that the contact details next to this header should be the contact's
    // emails.
    // Max length: 15
    // Read out: true
    email: "Email",

    // Scenario: The user is viewing the details of a contact.
    // Use: Screen-reader text (aria-label) of a clickable email address
    // Purpose: Tell the screenreader user that clicking the email address initiates sending an email
    // Max length: N/A
    // Read out: true
    sendEmailTo: "Send email to {{emailAddress}}",

    // Scenario: The user is viewing the details of a contact.
    // Use: Contact detail header.
    // Purpose: To indicate that the contact details next to this header should be the contact's
    // postal addresses.
    // Max length: 15
    // Read out: true
    address: "Address",

    // Scenario: The user is viewing the details of a contact.
    // Use: Contact detail header.
    // Purpose: To indicate that the contact details next to this header should be the user's
    // history of interaction with this contact.
    // Max length: 15
    // Read out: true
    history: "History",

    // Scenario: The user is viewing a contact that does not have a name.
    // Use: Displayed in place of the name of the contact.
    // Purpose: Informs the user that the contact has no name.
    // Max length: N/A
    // Read out: true
    noName: "No name",

    // Scenario: The user has unread chat messages, voicemails, or missed calls.
    // Use: Screen reader text for the overlay in Windows Task Bar.
    // Purpose: Informs screen reader user the number of unread notifications they have in the
    // application, with more than 9 notifications treated as a "9 plus".
    // Max length: N/A
    // Read out: true
    // {{count}} is the number of unread notifications
    notification_interval: `
       (0) [No notifications];
       (1) [1 notification];
       (2-9) [{{count}} notifications];
       (10-inf) [9+ notifications];`,

    // Scenario: The user has just received a new voicemail message.
    // Use: Description in the notification popup.
    // Purpose: Informs the user of the number of new voicemail messages, with more than 9
    // notifications treated as a "9 plus".
    // Max length: 25
    // Read out: true
    // {{count}} is the number of new voicemails
    newMessages_interval: `
       (0) [No new messages];
       (1) [1 new message];
       (2-9) [{{count}} new messages];
       (10-inf) [9+ new messages];`,

    // Scenario: The app has just finished loading and the user has not yet selected a contact.
    // Use: Prompt at the top of the screen where contact name is displayed if a contact had been
    // selected.
    // Purpose: Guides the user to select a contact.
    // Max length: N/A
    // Read out: true
    selectAContact: "Select a contact",

    // Scenario: User opens the Mac App Menu.
    // Use: Label for menu item that opens the Preferences window.
    // Purpose: Informs the user the purpose of the menu item.
    // Max length: N/A
    // Read out: true
    preferences: "Preferences...",

    // Scenario: User is attempting to delete a contact.
    // Use: Button text in a confirmation dialog.
    // Purpose: Informs the user the purpose of the button.
    // Max length: N/A
    // Read out: true
    delete: "Delete",

    // Scenario: User is attempting to reset a Business Group contact to its default details from
    // the network.
    // Use: Button text in a confirmation dialog.
    // Purpose: Informs the user the purpose of the button.
    // Max length: N/A
    // Read out: true
    resetNetwork: "Reset to network details",

    // Scenario: User is attempting to reset a Business Group contact to its default details from
    // the network.
    // Use: Title of a confirmation dialog.
    // Purpose: Explains to the user that is contact is a network contact.
    // Max length: N/A
    // Read out: true
    warnNetworkContact: "This is a network contact",

    // Scenario: User is attempting to reset a Business Group contact to its default details from
    // the network.
    // Use: Description text in a confirmation dialog.
    // Purpose: Explains to the user why the contact cannot be fully deleted.
    // Max length: N/A
    // Read out: true
    textNetworkContact:
      "Some details are taken from the shared Business Group Directory and are not editable in MaX UC.",

    // Scenario: User is attempting to delete a contact.
    // Use: Title of a confirmation dialog.
    // Purpose: Confirms the action with the user.
    // Max length: N/A
    // Read out: true
    warnDeleteContact: "Delete contact",

    // Scenario: User is attempting to delete a contact.
    // Use: Description text in a confirmation dialog.
    // Purpose: Confirms the action with the user.
    // Max length: N/A
    // Read out: true
    // {{name}} is the contact name
    textDeleteContact: "Are you sure you want to delete contact details for {{name}}? ",

    // Scenario: User is attempting to delete a contact with whom they have had an IM conversation.
    // Use: Description text in a confirmation dialog.
    // Purpose: Informs the user of a way to save their conversation before the contact is deleted.
    // Max length: N/A
    // Read out: true
    exportChatHistory:
      "You can export chat history before deleting if you want to save your conversation.",

    // Scenario: User is attempting to reset a contact to its default details from the network.
    // Use: Description text in a confirmation dialog.
    // Purpose: Confirmation
    // Max length: N/A
    // Read out: true
    // {{name}} is the contact name
    textResetContact: "Are you sure you want to reset contact details for {{name}}?",

    // Scenario: User is attempting to reset a contact to its default details from the network.
    // Use: Description text in a confirmation dialog.
    // Purpose: Warning
    // Max length: N/A
    // Read out: true
    mayLoseChat: "You may lose your chat history if you reset this contact.",

    // Scenario: User is receiving an incoming call.
    // Use: Tooltip and screen reader text for the button to accept the call.
    // Purpose: Button description
    // Max length: N/A
    // Read out: true
    acceptCall: "Accept call",

    // Scenario: User is receiving an incoming call.
    // Use: Tooltip and screen reader text for the button to reject the call.
    // Purpose: Informs the user of the purpose of the button.
    // Max length: N/A
    // Read out: true
    rejectCall: "Reject call",

    // Scenario: When a user is signed into the app, and they want to sign out
    // Use: On a button which a user can press to sign out of the app
    // Purpose: To tell the user that the button will sign them out
    // Max Length: N/A
    // Read out: true
    logOutButton: "Log out",

    // Scenario: When a user is signed into the app, and they want to sign out
    // Use: A heading of a panel which checks if a user wants to sign out of the app
    // Purpose: To check if a user wants to sign out
    // Max Length: N/A
    // Read out: true
    warnLogOut: "Are you sure you want to log out?",

    // Scenario: When a user is signed into the app, and they want to sign out
    // Use: The text on a panel which checks if a user wants to sign out of the app
    // Purpose: To advise a user that signing out will sign out of the app on this device
    // but not affect other devices that they're logged into.
    // Max Length: N/A
    // Read out: true
    logOutText:
      "Calls and messages will no longer notify this device but will still be available on other devices you're logged in to.",

    // Scenario: User is viewing their call history with a contact
    // Use: This is the skeleton that builds the screen reader text that is read out when the user
    // focuses on the duration of the call. This is formed of two parts:
    // When the call is less than one hour long: "y minutes, z seconds" (denoted by (0))
    // When the call is more than one hour long: "x hours, y minutes, z seconds" (denoted by (1-inf))
    // Ordering of hours/minutes/seconds and use of "," may differ in other languages.
    // Purpose: Screen reader text to tell the user how long the given call was
    // Read out: true
    // Max length: N/A
    callDuration: `
       (0) [$t(minuteCount, { "count" : {{minutes}} }), $t(secondCount, { "count" : {{seconds}} })];
       (1-inf) [$t(hourCount, { "count" : {{hours}} }), $t(minuteCount, { "count" : {{minutes}} }), $t(secondCount, { "count": {{seconds}} })]`,

    // Scenario: User is viewing their call history with a contact.
    // Use: Part of screen reader text that gets read out when user focuses on the duration of the
    // call.
    // Purpose: Informs the user of the hours part of the call duration (singular).
    // Max length: N/A
    // Read out: true
    // {{count}} is the number of hours, always 1
    hourCount: "{{count}} hour",

    // Scenario: User is viewing their call history with a contact.
    // Use: Part of screen reader text that gets read out when user focuses on the duration of the
    // call.
    // Purpose: Informs the user of the hours part of the call duration (plural).
    // Max length: N/A
    // Read out: true
    // {{count}} is the number of hours, always more than 1
    hourCount_plural: "{{count}} hours",

    // Scenario: User is viewing their call history with a contact.
    // Use: Part of screen reader text that gets read out when user focuses on the duration of the
    // call.
    // Purpose: Informs the user of the minutes part of the call duration (singular).
    // Max length: N/A
    // Read out: true
    // {{count}} is the number of minutes, always 1
    minuteCount: "{{count}} minute",

    // Scenario: User is viewing their call history with a contact.
    // Use: Part of screen reader text that gets read out when user focuses on the duration of the
    // call.
    // Purpose: Informs the user of the minutes part of the call duration (plural).
    // Max length: N/A
    // Read out: true
    // {{count}} is the number of minutes, always more than 1
    minuteCount_plural: "{{count}} minutes",

    // Scenario: User is viewing their call history with a contact.
    // Use: Part of screen reader text that gets read out when user focuses on the duration of the
    // call.
    // Purpose: Informs the user of the seconds part of the call duration (singular).
    // Max length: N/A
    // Read out: true
    // {{count}} is the number of seconds, always 1
    secondCount: "{{count}} second",

    // Scenario: User is viewing their call history with a contact.
    // Use: Part of screen reader text that gets read out when user focuses on the duration of the
    // call.
    // Purpose: Informs the user of the seconds part of the call duration (plural).
    // Max length: N/A
    // Read out: true
    // {{count}} is the number of seconds, always more than 1
    secondCount_plural: "{{count}} seconds",

    // Scenario: User is viewing their call history with a contact.
    // Use: Text showing the duration of the call
    // Purpose: Informs the user of the duration of the call, with the "s" (seconds) disambiguating
    // it from time of day.
    // Max length: N/A
    // {{duration}} is the call duration, in  hh:mm:ss format (e.g. 01:23:41)
    // Read out: false
    durationSeconds: "{{duration}}s",

    // Scenario: The user has opened a menu with actions related to their account or the application
    // Use: Text that appears on a button
    // Purpose: Tells the user that the button will let them view their call park orbits
    // Max length: N/A
    // Read out: true
    callParkOrbits: "Call park orbits",

    // Scenario: The user has opened a menu with actions related to their account or the application
    // Use: Text that appears on a button
    // Purpose: Tells the user that the button will let them view their subscriber account
    // Max length: N/A
    // Read out: true
    commportalAccount: "View account…",

    // Scenario: The user has opened a menu with actions related to their account or the application
    // Use: Text that appears on a button
    // Purpose: Tells the user that the button will let them view apps to access their account
    // Max length: N/A
    // Read out: true
    commportalApps: "Apps…",

    // Scenario: The user has opened a menu with actions related to their account or the application
    // Use: Text that appears on a button
    // Purpose: Tells the user that the button will let them view their Commportal groups
    // Max length: N/A
    // Read out: true
    commportalGroup: "Groups…",

    // Scenario: The user has opened a menu with actions related to their account or the application
    // Use: Text that appears on a button
    // Purpose: Tells the user that the button will let them view the conference manager
    // Max length: N/A
    // Read out: true
    conferenceManager: "Conference manager…",

    // Scenario: The user received a call from a withheld number
    // Use: Text that appears in the call block
    // Purpose: Show the user the anonymous call
    // Max length: N/A
    // Read out: true
    anonymous: "Anonymous",

    // Scenario: The user has opened the context menu on a link (e.g. in a chat message)
    // Use: An option in the context menu
    // Purpose: Tells the user the option will copy the link to the clipboard
    // Max length: N/A
    // Read out: true
    copy: "Copy",

    // Scenario: The user is composing a chat message and has opened the context menu
    // on a word which the spell checker has flagged as misspelled.
    // Use: An option in the context menu
    // Purpose: Tells the user that the option will add the word to the spellchecker dictionary
    // Max length: N/A
    // Read out: true
    addToDictionary: "Add to dictionary",
  },
};
