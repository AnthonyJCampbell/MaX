// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Types used just within Pane Control
 *
 * This is to allow some bang-for-buck TypeScript to be written, but should be reconsidered when
 * node-server is fully rewritten in TypeScript.
 */
import { WindowTypes } from "src/shared/types";
export interface CallWindowMetadata {
  remoteParty: string;
}
export interface CallWindowIdentifiers {
  type: WindowTypes;
  uid: string;
}

export interface CallWindow extends Electron.BrowserWindow {
  identifiers: CallWindowIdentifiers;
  metadata: CallWindowMetadata;
}
