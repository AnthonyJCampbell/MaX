// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the reducer that controls all user-related store data mutations
 */
import { WindowReducerState } from "store/types";
import { ipcChannels } from "shared/constants";

const { ipcRenderer } = window.require("electron");

const identifiersAndMetadata = ipcRenderer.sendSync(ipcChannels.identifiersAndMetadataRequest);

// The `type` is pulled up to be a top-level field, due to TS limitations.
// For more info, see `nested_property_guarding.md` in the current directory
identifiersAndMetadata["type"] = identifiersAndMetadata.identifiers.type;

// Don't leave the type in the identifiers as it might cause confusion
delete identifiersAndMetadata.identifiers.type;

const initialState: WindowReducerState = identifiersAndMetadata;

export const windowReducer = (state = initialState): WindowReducerState => state;
