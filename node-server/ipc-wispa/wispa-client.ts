// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import {
  WispaRequest,
  Account,
  CoreAction,
  CoreMotion,
  SettingsAction,
  ContactsAction,
  MessagingAction,
  ContactsMotion,
  Contact,
  ActiveCall,
  HistoricCall,
  Chat,
  Meeting,
  Settings,
  ChatMessage,
  MeetingAction,
  Analytic,
  WispaSender,
  WispaReceiver,
  DecodeErrors,
  WispaDataType,
  Namespace,
  DeepPartial,
  VoicemailFaxCount,
  VoicemailFaxAction,
  WispaRequestMethod,
  WispaMessageMethod,
  wispaPorts,
  User,
  UpdateableUser,
} from "../types";
import {
  accountConverter,
  coreActionConverter,
  coreMotionConverter,
  meetingActionConverter,
  messagingActionConverter,
  settingsConverter,
  contactConverter,
  activeCallConverter,
  historicCallConverter,
  chatConverter,
  meetingConverter,
  analyticsConverter,
  userConverter,
  updateableUserConverter,
  chatMessageConverter,
  settingsActionConverter,
  contactsActionConverter,
  voicemailFaxCountConverter,
  voicemailFaxActionConverter,
  contactsMotionConverter,
} from "./converters";
import { handleMessage } from "../data-fan/data-fan";
import io from "socket.io-client";
import log from "../main-logging";

import { ActionTypes, BannerType } from "../../src/shared/types";

import { callWinJavaExecutable, startMacJavaApp } from "../guardian/guardian";

import isDev from "electron-is-dev";
import { windows, sendReduxAction } from "../ipc-renderer/window-messaging";

// In this file, we use the namespace as the key for the sockets object.
// This is not a security risk because we define the namespace strings ourselves.
/* eslint-disable security/detect-object-injection */

let wispaPort: string;
if (process.env.FVFramework) {
  wispaPort = wispaPorts.ELECTRON_FV;
} else if (isDev) {
  wispaPort = process.env.WISPA_PORT || wispaPorts.DEVELOPMENT;
} else {
  // Don't want to allow users to feed a port to the app for security reasons, so don't check
  // `process.env`
  wispaPort = wispaPorts.PRODUCTION;
}

const sockets: Record<
  Namespace,
  { socket: SocketIOClient.Socket | null; isRegistered: boolean; requestQueue: WispaRequest[] }
> = {
  settings: { socket: null, isRegistered: false, requestQueue: [] },
  activecalls: { socket: null, isRegistered: false, requestQueue: [] },
  callhistory: { socket: null, isRegistered: false, requestQueue: [] },
  messaging: { socket: null, isRegistered: false, requestQueue: [] },
  contacts: { socket: null, isRegistered: false, requestQueue: [] },
  core: { socket: null, isRegistered: false, requestQueue: [] },
  meetings: { socket: null, isRegistered: false, requestQueue: [] },
  voicemails: { socket: null, isRegistered: false, requestQueue: [] },
  analytics: { socket: null, isRegistered: false, requestQueue: [] },
  user: { socket: null, isRegistered: false, requestQueue: [] },
};

function addRequestToQueue(request: WispaRequest, namespace: Namespace): void {
  if (sockets[namespace].requestQueue.length > 50) {
    log.warn(`"${namespace}" has too many requests queued. Drop the oldest.`);

    while (sockets[namespace].requestQueue.length > 50) {
      const droppedRequest = sockets[namespace].requestQueue.shift();
      log.warn("Dropped request:");
      log.warn(droppedRequest);
    }

    return;
  }
  sockets[namespace].requestQueue.push(request);
}

function genericSender<T extends WispaDataType>(
  toSend: DeepPartial<T>,
  sender: WispaSender<T>,
  method: WispaRequestMethod,
  namespace: Namespace,
  request: WispaRequest
): void {
  const { socket, isRegistered } = sockets[namespace];

  if (!socket) {
    log.error(`Can't send "${method}" on "${namespace}" as socket doesn't exist. Queueing`);
    addRequestToQueue(request, namespace);
  } else if (!isRegistered) {
    log.error(`Can't send "${method}" on "${namespace}" as socket isn't registered. Queueing`);
    addRequestToQueue(request, namespace);
  } else {
    log.wispa(`Sending ${method} on ${namespace} with payload:`);
    log.wispa(toSend);
    const encoded = sender.encode(toSend);
    socket
      .compress(false)
      .emit(method, encoded, () => log.wispa(`Received ACK for ${method} on ${namespace} `));
  }
}

export function send(request: WispaRequest): void {
  const coreActionSender = (toSend: DeepPartial<CoreAction>): void => {
    genericSender<CoreAction>(
      toSend,
      coreActionConverter,
      WispaRequestMethod.action,
      Namespace.core,
      request
    );
  };
  const accountSender = (toSend: DeepPartial<Account>, method: WispaRequestMethod): void => {
    genericSender<Account>(toSend, accountConverter, method, Namespace.core, request);
  };
  const activeCallsSender = (toSend: DeepPartial<ActiveCall>, method: WispaRequestMethod): void => {
    genericSender<ActiveCall>(toSend, activeCallConverter, method, Namespace.activecalls, request);
  };
  const callHistorySender = (
    toSend: DeepPartial<HistoricCall>,
    method: WispaRequestMethod
  ): void => {
    genericSender<HistoricCall>(
      toSend,
      historicCallConverter,
      method,
      Namespace.callhistory,
      request
    );
  };
  const settingsActionSender = (toSend: DeepPartial<SettingsAction>): void => {
    genericSender<SettingsAction>(
      toSend,
      settingsActionConverter,
      WispaRequestMethod.action,
      Namespace.settings,
      request
    );
  };
  const contactsActionSender = (toSend: DeepPartial<ContactsAction>): void => {
    genericSender<ContactsAction>(
      toSend,
      contactsActionConverter,
      WispaRequestMethod.action,
      Namespace.contacts,
      request
    );
  };
  const settingsSender = (toSend: DeepPartial<Settings>, method: WispaRequestMethod): void => {
    genericSender<Settings>(toSend, settingsConverter, method, Namespace.settings, request);
  };
  const contactsSender = (toSend: DeepPartial<Contact>, method: WispaRequestMethod): void => {
    genericSender<Contact>(toSend, contactConverter, method, Namespace.contacts, request);
  };
  const chatsSender = (toSend: DeepPartial<Chat>, method: WispaRequestMethod): void => {
    genericSender<Chat>(toSend, chatConverter, method, Namespace.messaging, request);
  };
  const chatMessageSender = (
    toSend: DeepPartial<ChatMessage>,
    method: WispaRequestMethod
  ): void => {
    genericSender<ChatMessage>(toSend, chatMessageConverter, method, Namespace.messaging, request);
  };
  const messagingActionSender = (toSend: DeepPartial<MessagingAction>): void => {
    genericSender<MessagingAction>(
      toSend,
      messagingActionConverter,
      WispaRequestMethod.action,
      Namespace.messaging,
      request
    );
  };
  const meetingSender = (toSend: DeepPartial<Meeting>, method: WispaRequestMethod): void => {
    genericSender<Meeting>(toSend, meetingConverter, method, Namespace.meetings, request);
  };
  const meetingActionSender = (toSend: DeepPartial<MeetingAction>): void => {
    genericSender<MeetingAction>(
      toSend,
      meetingActionConverter,
      WispaRequestMethod.action,
      Namespace.meetings,
      request
    );
  };
  const voicemailFaxCountSender = (
    toSend: DeepPartial<VoicemailFaxCount>,
    method: WispaRequestMethod
  ): void => {
    genericSender<VoicemailFaxCount>(
      toSend,
      voicemailFaxCountConverter,
      method,
      Namespace.voicemails,
      request
    );
  };
  const voicemailFaxActionSender = (toSend: DeepPartial<VoicemailFaxAction>): void => {
    genericSender<VoicemailFaxAction>(
      toSend,
      voicemailFaxActionConverter,
      WispaRequestMethod.action,
      Namespace.voicemails,
      request
    );
  };
  const analyticsSender = (toSend: DeepPartial<Analytic>): void => {
    genericSender<Analytic>(
      toSend,
      analyticsConverter,
      WispaRequestMethod.action,
      Namespace.analytics,
      request
    );
  };
  const userSender = (toSend: DeepPartial<User>, method: WispaRequestMethod): void => {
    genericSender<User>(toSend, userConverter, method, Namespace.user, request);
  };
  const updateableUserSender = (toSend: DeepPartial<UpdateableUser>): void => {
    genericSender<UpdateableUser>(
      toSend,
      updateableUserConverter,
      WispaRequestMethod.update,
      Namespace.user,
      request
    );
  };

  if (request.payload?.list === "activeCalls") {
    activeCallsSender({}, WispaRequestMethod.list);
  }
  if (request.payload?.list === "historicCalls") {
    callHistorySender({}, WispaRequestMethod.list);
  }
  if (request.payload?.list === "contacts") {
    contactsSender({}, WispaRequestMethod.list);
  }
  if (request.payload?.list === "chats") {
    chatsSender({}, WispaRequestMethod.list);
  }
  if (request.payload?.list === "meetings") {
    meetingSender({}, WispaRequestMethod.list);
  }
  if (request.payload?.get?.account) {
    accountSender(request.payload?.get.account, WispaRequestMethod.get);
  }
  if (request.payload?.get?.contact) {
    contactsSender(request.payload?.get.contact, WispaRequestMethod.get);
  }
  if (request.payload?.get?.chat) {
    chatsSender(request.payload?.get.chat, WispaRequestMethod.get);
  }
  if (request.payload?.get?.user) {
    userSender(request.payload?.get.user, WispaRequestMethod.get);
  }
  if (request.payload?.get?.settings) {
    settingsSender(request.payload?.get.settings, WispaRequestMethod.get);
  }
  if (request.payload?.get?.voicemailFaxCount) {
    voicemailFaxCountSender(request.payload?.get.voicemailFaxCount, WispaRequestMethod.get);
  }
  if (request.payload?.create?.activeCall) {
    activeCallsSender(request.payload?.create.activeCall, WispaRequestMethod.create);
  }
  if (request.payload?.create?.chatMessage) {
    chatMessageSender(request.payload?.create.chatMessage, WispaRequestMethod.create);
  }
  if (request.payload?.create?.meeting) {
    meetingSender(request.payload?.create.meeting, WispaRequestMethod.create);
  }
  if (request.payload?.update?.activeCall) {
    activeCallsSender(request.payload?.update.activeCall, WispaRequestMethod.update);
  }
  if (request.payload?.update?.historicCall) {
    callHistorySender(request.payload?.update.historicCall, WispaRequestMethod.update);
  }
  if (request.payload?.update?.chat) {
    chatsSender(request.payload?.update.chat, WispaRequestMethod.update);
  }
  if (request.payload?.update?.contact) {
    contactsSender(request.payload?.update.contact, WispaRequestMethod.update);
  }
  if (request.payload?.update?.meeting) {
    meetingSender(request.payload?.update.meeting, WispaRequestMethod.update);
  }
  if (request.payload?.update?.updateableUser) {
    updateableUserSender(request.payload?.update.updateableUser);
  }
  if (request.payload?.update?.account) {
    accountSender(request.payload?.update.account, WispaRequestMethod.update);
  }
  if (request.payload?.delete?.contact) {
    contactsSender({ uid: request.payload?.delete.contact }, WispaRequestMethod.delete);
  }
  if (request.payload?.delete?.activeCall) {
    activeCallsSender({ uid: request.payload?.delete.activeCall }, WispaRequestMethod.delete);
  }
  if (request.payload?.action?.contactsAction) {
    contactsActionSender(request.payload?.action.contactsAction);
  }
  if (request.payload?.action?.coreAction) {
    coreActionSender(request.payload?.action.coreAction);
  }
  if (request.payload?.action?.settingsAction) {
    settingsActionSender(request.payload?.action.settingsAction);
  }
  if (request.payload?.action?.meetingAction) {
    meetingActionSender(request.payload?.action.meetingAction);
  }
  if (request.payload?.action?.messagingAction) {
    messagingActionSender(request.payload?.action.messagingAction);
  }
  if (request.payload?.action?.voicemailFaxAction) {
    voicemailFaxActionSender(request.payload?.action.voicemailFaxAction);
  }
  if (request.payload?.action?.analytic) {
    analyticsSender(request.payload?.action.analytic);
  }
}

function logErrors(errors: DecodeErrors): void {
  log.error(
    `Received ${errors.identifier} from WISPA but it failed to decode. It will be dropped. Errors are:`
  );
  errors.errorTexts.forEach((errorText) => log.error(errorText));
}

// Exported handlers for testing purposes
export function handleData<T extends WispaDataType>(
  pbData: Uint8Array,
  handler: WispaReceiver<T>
): void {
  handler.decode(pbData).match(
    (validData) => {
      const message = handler.buildMessage({ data: validData });
      log.wispa(`Built WISPA data message:`);
      log.wispa(message);
      handleMessage(message);
    },
    (errors) => {
      logErrors(errors);
    }
  );
}

export function handleDataList<T extends WispaDataType>(
  pbDataList: Uint8Array,
  handler: WispaReceiver<T>
): void {
  const dataList = handler.decodeList(pbDataList);

  const validDataList: T[] = [];
  const validationErrors: DecodeErrors[] = [];

  dataList.forEach((data) => {
    data.match(
      (validData) => {
        validDataList.push(validData);
      },
      (errors) => {
        validationErrors.push(errors);
      }
    );
  });

  if (validationErrors.length) {
    log.error(
      "Received dataList from WISPA containing some entries which failed validation. Remaining entries will be sent onwards. Errors are:"
    );
    validationErrors.forEach((decodeErrors) => {
      log.error(`${decodeErrors.identifier} failed to decode because:`);
      decodeErrors.errorTexts.forEach((errorText) => log.error(errorText));
    });
  }
  const message = handler.buildMessage({ dataList: validDataList });
  log.wispa(`Built WISPA datalist message:`);
  log.wispa(message);
  handleMessage(message);
}

export function handleDeleted<T extends WispaDataType>(
  pbDeleted: Uint8Array,
  handler: WispaReceiver<T>
): void {
  handler.decode(pbDeleted, true).match(
    (validData) => {
      const message = handler.buildMessage({ deleted: validData });
      log.wispa(`Built WISPA deletion message:`);
      log.wispa(message);
      handleMessage(message);
    },
    (errors) => {
      logErrors(errors);
    }
  );
}

export function handleMotion<T extends WispaDataType>(
  pbMotion: Uint8Array,
  handler: WispaReceiver<T>
): void {
  handler.decode(pbMotion, true).match(
    (validData) => {
      const message = handler.buildMessage({ motion: validData });
      log.wispa(`Built WISPA motion message:`);
      log.wispa(message);
      handleMessage(message);
    },
    (errors) => {
      logErrors(errors);
    }
  );
}

let javaDownTimeoutAlreadyRunning = false;
let restartJavaInterval: ReturnType<typeof setTimeout>;
let javaDownTimeout: ReturnType<typeof setTimeout>;

function establishSocket(namespace: Namespace): SocketIOClient.Socket {
  const socket = io("http://localhost:" + wispaPort + "/" + namespace, {
    transports: ["websocket"],
  });
  sockets[namespace].socket = socket;
  socket.on("connect", () => {
    log.wispa(`Connected ${namespace}. Registering socket`);

    // No need to do this for every namespace, since they'll all connect at once. Just do
    // it for an arbitrary namespace
    if (namespace === Namespace.core) {
      if (typeof restartJavaInterval !== undefined) {
        clearInterval(restartJavaInterval);
      }

      if (typeof javaDownTimeout !== undefined) {
        clearTimeout(javaDownTimeout);
      }

      javaDownTimeoutAlreadyRunning = false;
      sendReduxAction([windows.mainWindow], {
        type: ActionTypes.REMOVE_BANNER,
        payload: { bannerType: BannerType.JAVA_DOWN },
      });
    }

    socket.compress(false).emit("register", "", (data: string) => {
      log.wispa(`Received ACK for registration from ${namespace} socket`);
      if (data === `REGISTERED ${namespace.toUpperCase()}`) {
        sockets[namespace].isRegistered = true;
        sockets[namespace].requestQueue.forEach((request) => send(request));
      }
    });
  });

  socket.on("disconnect", () => {
    log.wispa(`Disconnected ${namespace}`);
    sockets[namespace].isRegistered = false;

    // No need to do this for every namespace, since they'll all disconnect at once. Just do
    // it for an arbitrary namespace
    if (!isDev && namespace === Namespace.core) {
      javaDownTimeout = setTimeout(function () {
        if (!javaDownTimeoutAlreadyRunning) {
          javaDownTimeoutAlreadyRunning = true;

          sendReduxAction([windows.mainWindow], {
            type: ActionTypes.ADD_BANNER,
            payload: { bannerType: BannerType.JAVA_DOWN },
          });

          restartJavaInterval = setInterval(() => {
            if (process.platform === "darwin") {
              startMacJavaApp().catch((reason) =>
                log.error(`Failed to start Mac Java app, reason: ${reason}`)
              );
            } else {
              callWinJavaExecutable().catch((reason) =>
                log.error(`Failed to start Windows Java app, reason: ${reason}`)
              );
            }
          }, 60000);
        }
      }, 30000);
    }
  });
  return socket;
}

function listenOnSocket<T extends WispaDataType, U = void>(
  namespace: Namespace,
  regularHandler: WispaReceiver<T>,
  motionHandler?: WispaReceiver<U extends WispaDataType ? U : never>
): void {
  const socket = establishSocket(namespace);

  socket.on(WispaMessageMethod.data, (pbData: Uint8Array) => {
    log.wispa(`Received data on ${namespace}`);
    handleData(pbData, regularHandler);
  });

  socket.on(WispaMessageMethod.datalist, (pbDataList: Uint8Array) => {
    log.wispa(`Received datalist on ${namespace}`);
    handleDataList(pbDataList, regularHandler);
  });

  socket.on(WispaMessageMethod.deleted, (pbDeleted: Uint8Array) => {
    log.wispa(`Received deletion on ${namespace}`);
    handleDeleted(pbDeleted, regularHandler);
  });

  socket.on(WispaMessageMethod.motion, (pbMotion: Uint8Array) => {
    log.wispa(`Received motion on ${namespace}`);
    if (motionHandler) {
      handleMotion(pbMotion, motionHandler);
    } else {
      log.error("No handler for motion defined");
    }
  });
}

export function start(): void {
  log.info("Starting wispa client");

  listenOnSocket<Account, CoreMotion>(Namespace.core, accountConverter, coreMotionConverter);
  listenOnSocket<Settings>(Namespace.settings, settingsConverter);
  listenOnSocket<ActiveCall>(Namespace.activecalls, activeCallConverter);
  listenOnSocket<HistoricCall>(Namespace.callhistory, historicCallConverter);
  listenOnSocket<Contact, ContactsMotion>(
    Namespace.contacts,
    contactConverter,
    contactsMotionConverter
  );
  listenOnSocket<Chat>(Namespace.messaging, chatConverter);
  listenOnSocket<Meeting>(Namespace.meetings, meetingConverter);
  listenOnSocket<User>(Namespace.user, userConverter);
  listenOnSocket<VoicemailFaxCount>(Namespace.voicemails, voicemailFaxCountConverter);

  // Don't listen on these namespaces, but we do need to be able to send on them.
  establishSocket(Namespace.analytics);
}
