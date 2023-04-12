// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Pre-defined states to be used in automated testing.
 * In general, set the most complex options for config so we can
 * test as many features as possible using the pre-defined state
 */
import { bilboCall, gandalfCall } from "./mock-active-calls";
import {
  missedHistoricCall,
  inboundHistoricCall,
  outboundHistoricCall,
} from "./mock-historic-calls";
import { upliftGandalfCallToMeeting } from "./mock-meetings";
import { chatWithGandalf, chatWithPeter } from "./mock-chats";
import { gandalf, peter, bilbo } from "./mock-contacts";
import { Contact, WindowTypes, LoginState, ModalPopupTypes } from "src/types";
import { StoreState } from "store/types";
import { mutableCloneDeep } from "./ts-utils";
import { ClickToDialType, CallManagerType, BGLineType } from "protobuf-wispa/dist/settings";

const gandalfClone = mutableCloneDeep(gandalf);
const bilboClone = mutableCloneDeep(bilbo);
const peterClone = mutableCloneDeep(peter);
const upliftGandalfCallToMeetingClone = mutableCloneDeep(upliftGandalfCallToMeeting);
const chatWithGandalfClone = mutableCloneDeep(chatWithGandalf);
const chatWithPeterClone = mutableCloneDeep(chatWithPeter);

export const mockStoreState: StoreState = {
  activeCallsReducer: {
    activeCalls: [],
  },
  callHistoryReducer: {
    historicCalls: [],
  },
  contactReducer: {
    contacts: [],
    selectedContact: new Contact(),
  },
  coreReducer: {
    account: { loginState: LoginState.UNRECOGNIZED, connectivityState: undefined },
  },
  meetingReducer: {
    meetings: [],
  },
  messagingReducer: {
    chats: [],
    drafts: {},
  },
  paneManagementReducer: {
    activeMidPane: "",
    activeRightPane: "",
    forceMessageRemoteParty: "",
    displayFavs: false,
    searchTerm: "",
    searchResultsCount: 0,
    focusSearch: 0,
    focusMessage: 0,
    disabledCallButton: "",
    showUnimplementedPopup: false,
    showBugReportPopup: false,
    showModalPopup: ModalPopupTypes.noModal,
    customStatusState: 0,
    presenceMenuState: 0,
    banners: [],
    isMainWindowFocused: true,
    isMidPaneDialPadVisible: false,
  },
  settingsReducer: {
    settings: {
      meetings: { enabled: true },
      messaging: {
        enabled: true,
        isSignedIn: true,
        groupChatEnabled: true,
        smsEnabled: true,
      },
      call: {
        voipEnabled: true,
        clickToDialType: ClickToDialType.CTD_REMOTE,
        callManagerType: CallManagerType.BCM,
        callJumpEnabled: true,
        voicemailEnabled: true,
        callParkActive: true,
      },
      general: {
        accountNumber: "",
        displayName: "",
        bgLineType: BGLineType.BG_LINE,
        isNseriesConfEnabled: true,
        easRegion: "GB",
        javaLocale: "",
      },
    },
  },
  voicemailsReducer: {
    voicemailFaxCount: { newMessages: 0 },
  },
  userReducer: {
    user: {
      presence: {
        state: 0,
        customStatus: "",
      },
    },
  },
  windowReducer: {
    type: WindowTypes.main,
  },
};

/**
 * Contains examples of all possible state
 */
const maximalStateTemplate = mutableCloneDeep(mockStoreState);
maximalStateTemplate.coreReducer.account.loginState = LoginState.LOGGED_IN;
maximalStateTemplate.paneManagementReducer.activeMidPane = "contacts";
maximalStateTemplate.voicemailsReducer.voicemailFaxCount = { newMessages: 10 };
maximalStateTemplate.activeCallsReducer.activeCalls = [bilboCall, gandalfCall];
maximalStateTemplate.callHistoryReducer.historicCalls = [
  missedHistoricCall,
  inboundHistoricCall,
  outboundHistoricCall,
];
maximalStateTemplate.meetingReducer.meetings = [upliftGandalfCallToMeetingClone];
maximalStateTemplate.messagingReducer.chats = [chatWithGandalfClone, chatWithPeterClone];
maximalStateTemplate.contactReducer.selectedContact = gandalfClone;
maximalStateTemplate.contactReducer.contacts = [bilboClone, gandalfClone, peterClone];

export const maximalState = maximalStateTemplate;
