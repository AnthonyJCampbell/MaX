// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Returns the voicemail button and a list of call history item blocks.
 */

import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import CallBlock from "./call-history-block/call-block";
import ArrowKeyControl from "components/arrow-key-control/control";

import * as Shared from "components/midbar/shared-styles";
import * as S from "./styles";

import { callSorter } from "components/utils/common";

import log from "src/renderer-logging";

/**
 * Render the voicemail button and call history list.
 */
const CallList = () => {
  const { historicCalls } = useSelector((state) => state.callHistoryReducer);
  const { t } = useTranslation();

  // Slice to only show the first 50 calls, Sort as we don't assume Java sends the calls
  // in order
  const sortedSlicedHistoricCalls = historicCalls.sort(callSorter).slice(0, 50);

  const callsIdList = sortedSlicedHistoricCalls.map((call) => {
    return `callBlock-${call.uid}`;
  });

  /**
   * Render each item in the call history list
   * @param {HistoricCall[]} calls - Historic calls
   */
  const renderCallsList = (calls) => {
    return calls.map((call) => <CallBlock key={call.uid} call={call} />);
  };

  log.debug("Rendering call history list");
  return (
    <>
      <S.CallListContainer id="callList">
        {historicCalls.length === 0 ? (
          <Shared.NoItems>
            <h1>{t("noCallsMessage")}</h1>
          </Shared.NoItems>
        ) : (
          <ArrowKeyControl idList={[...callsIdList]}>
            {renderCallsList(sortedSlicedHistoricCalls)}
          </ArrowKeyControl>
        )}
      </S.CallListContainer>
    </>
  );
};

export default CallList;
