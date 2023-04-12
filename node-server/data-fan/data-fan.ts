// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Data Fan
 *
 * This component was originally designed to be responsible for sending wispa messages to the
 * relevant BrowserWindows. However, the current design is that all messages are sent to all windows
 * and the windows themselves drop any they're not interested in.
 *
 * This means that currently this component just passes WispaMessages through. It's kept so that
 * we can add more functionality in future if needs be. If we ever decide that the filtering should
 * happen in the windows then this file can probably be deleted.
 */
import { WispaMessage } from "../../src/shared/types";
import { windows, sendWispaMessage } from "../ipc-renderer/window-messaging";
import log from "../main-logging";
import { quitApp } from "../guardian/guardian";
import { changeLanguage } from "../localisation/i18n";

export function handleMessage(message: WispaMessage): void {
  if (message.motion.core?.shutdown) {
    log.debug("Shutting down as requested by Java.");
    // Ask the guardian to quit this app but not also send a quit request to Java, as the request to
    // quit came from Java.  If Java asks us to quit, this is normally because it's running an upgrade and
    // there's a small chance that Java may already be restarting after upgrade so we don't want to kill it.
    quitApp(false);
    return;
  }

  if (message.data.settings?.general?.javaLocale) {
    changeLanguage(message.data.settings.general.javaLocale);
  }

  sendWispaMessage(windows.all, message);
}
