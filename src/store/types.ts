// Copyright 2021 Metaswitch Networks - Highly Confidential Material
// import { CombinedState, Store } from "redux";
import { WindowTypes, BannerType, ActionTypes } from "shared/types";
import {
  Account,
  ActiveCall,
  HistoricCall,
  Contact,
  User,
  Meeting,
  Chat,
  Drafts,
  Settings,
  VoicemailFaxCount,
  ModalPopupTypes,
} from "src/types";
import store from "./store";

// Reducer states for each of the reducers
export interface ActiveCallsReducerState {
  activeCalls: ActiveCall[];
}

export interface CallHistoryReducerState {
  historicCalls: HistoricCall[];
}

export interface ContactsReducerState {
  selectedContact: Contact;
  contacts: Contact[];
}

export interface CoreReducerState {
  account: Account;
}

export interface MeetingsReducerState {
  meetings: Meeting[];
}

export interface MessagingReducerState {
  chats: Chat[];
  drafts: Drafts;
}

export interface PaneManagementReducerState {
  activeMidPane: string;
  activeRightPane: string;
  forceMessageRemoteParty: string;
  displayFavs: boolean;
  searchTerm: string;
  searchResultsCount: number;
  focusSearch: number;
  focusMessage: number;
  disabledCallButton: string;
  showUnimplementedPopup: boolean;
  showBugReportPopup: boolean;
  showModalPopup: ModalPopupTypes;
  customStatusState: number;
  presenceMenuState: number;
  banners: BannerType[];
  isMainWindowFocused: boolean;
  isMidPaneDialPadVisible: boolean;
}

export interface SettingsReducerState {
  settings: Settings;
}

export interface UserReducerState {
  user: User;
}

export interface VoicemailsReducerState {
  voicemailFaxCount: VoicemailFaxCount;
}

interface IncomingCallWindowIdentifiers {
  /**
   * UID of the ActiveCall
   */
  uid: string;
}
interface InCallWindowIdentifiers {
  /**
   * UID of the ActiveCall
   */
  uid: string;
}

export type Identifiers = IncomingCallWindowIdentifiers | InCallWindowIdentifiers;

interface MainWindow {
  type: WindowTypes.main;
}
interface InCallWindow {
  type: WindowTypes.inCall;
  identifiers: InCallWindowIdentifiers;
  metadata: { remoteParty: string };
}
interface IncomingCallWindow {
  type: WindowTypes.incomingCall;
  identifiers: IncomingCallWindowIdentifiers;
  metadata: { remoteParty: string };
}
export type MaXWindow = MainWindow | InCallWindow | IncomingCallWindow;

export type WindowReducerState = MaXWindow;

// Complete redux state
export type StoreState = ReturnType<typeof store.getState>;

// Payloads for each of the reducers
export interface ActiveCallsPayload {
  activeCall?: ActiveCall;
  activeCalls?: ActiveCall[];
}

export interface CallHistoryPayload {
  historicCall?: HistoricCall;
  historicCalls?: HistoricCall[];
}

export interface ContactsPayload {
  contacts?: Contact[];
  contact?: Contact;
  selectedContact?: Contact;
}

export interface CorePayload {
  account?: Account;
}

export interface MeetingsPayload {
  meeting?: Meeting;
  meetings?: Meeting[];
}

export interface MessagingPayload {
  chat?: Chat;
  chats?: Chat[];
  drafts?: Drafts;
}

export enum DialKeyValue {
  Zero = "0",
  One = "1",
  Two = "2",
  Three = "3",
  Four = "4",
  Five = "5",
  Six = "6",
  Seven = "7",
  Eight = "8",
  Nine = "9",
  Star = "*",
  Hash = "#",
}

export interface PaneManagementPayload {
  activeMidPane?: string;
  activeRightPane?: string;
  /**
   * chat pane calculates and sends messages to message remote party
   * this value overwrites the calculated default value
   * set to "" to go back to default behaviour
   * or "IM" or a phone number value
   */
  forceMessageRemoteParty?: string;
  displayFavs?: boolean;
  searchTerm?: string;
  searchResultsCount?: number;
  ref?: number;
  number?: string;
  visible?: boolean;
  showModalPopup?: ModalPopupTypes;
  customStatusState?: number;
  presenceMenuState?: number;
  bannerType?: BannerType;
  isMainWindowFocused?: boolean;
  isMidPaneDialPadVisible?: boolean;
  dialKeyPressed?: DialKeyValue;
}

export interface SettingsPayload {
  settings?: Settings;
}

export interface UserPayload {
  user: User;
}

export interface VoicemailsPayload {
  voicemailFaxCount?: VoicemailFaxCount;
}

export interface WindowsPayload {
  // For now it so happens that all MaXWindows only contain identifiers and metadata. When they
  // contain more in future this will need to change to just be identifiers and metadata
  identifiersAndMetadata: MaXWindow;
}

// Actions for each of the reducers
export interface ActiveCallsAction {
  type: ActionTypes;
  payload: ActiveCallsPayload;
}

export interface CallHistoryAction {
  type: ActionTypes;
  payload: CallHistoryPayload;
}

export interface ContactsAction {
  type: ActionTypes;
  payload: ContactsPayload;
}

export interface CoreAction {
  type: ActionTypes;
  payload: CorePayload;
}

export interface MeetingsAction {
  type: ActionTypes;
  payload: MeetingsPayload;
}

export interface MessagingAction {
  type: ActionTypes;
  payload: MessagingPayload;
}

export interface PaneManagementAction {
  type: ActionTypes;
  payload: PaneManagementPayload;
}

export interface SettingsAction {
  type: ActionTypes;
  payload: SettingsPayload;
}

export interface VoicemailsAction {
  type: ActionTypes;
  payload: VoicemailsPayload;
}

export interface WindowsAction {
  type: ActionTypes;
  payload: WindowsPayload;
}

export interface EmptyAction {
  type: ActionTypes;
  payload: {};
}
