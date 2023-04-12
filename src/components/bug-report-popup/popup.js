// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/* eslint-disable i18next/no-literal-string */
import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideBugReport } from "action-creators/navigation/actions";

import * as S from "./styles";

const BugReportPopup = () => {
  const dispatch = useDispatch();
  const ref = useRef();

  const { showBugReportPopup } = useSelector((state) => state.paneManagementReducer);

  useEffect(() => {
    document.addEventListener("click", handleClick, true);

    return function () {
      document.removeEventListener("click", handleClick, true);
    };
  });

  const handleClick = (e) => {
    if (ref.current && ref.current.contains(e.target)) {
      return;
    }
    dispatch(hideBugReport());
  };

  const bugReportUrl =
    "https://forms.office.com/Pages/ResponsePage.aspx?id=61aenRP2202ye7_N8Uss22E2XZyotQdIkvl5DhNxdftUREpXRlcyQUFPRlRBNjQ1R1VTUjhRSlBVRC4u";

  if (showBugReportPopup) {
    return (
      <S.PopupContainer ref={ref} role="alert">
        <S.TextContainer>
          {/* The text below is not in the translation resource file (common.yaml) because this popup
         will be removed in GA, and thus doesn't need translation.*/}
          <p>
            Please report a description of your problem with&nbsp;
            <button
              onClick={() => {
                dispatch(hideBugReport());
                // eslint-disable-next-line
                window.open(bugReportUrl);
              }}
            >
              this form.
            </button>
          </p>
          <p>&nbsp;</p>
          <p>Please give as much detail as you can, to help us investigate it.</p>
          <p>&nbsp;</p>
          <p>For example:</p>
          <ul>
            <li>- What went wrong, or was not as you expected?</li>
            <li>- What did you expect to see at this point?</li>
            <li>- What steps you did prior to this to get you to this situation?</li>
            <li>- Was this a one-off, or does this happen every time you try this?</li>
          </ul>
          <p>&nbsp;</p>
          <p>
            It may be useful to attach a screenshot of the problem. If you do, please ensure you
            don&#39;t share any private information in the image.
          </p>

          <S.ButtonsContainer>
            <S.DismissButton>
              <button onClick={() => dispatch(hideBugReport())}>DISMISS</button>
            </S.DismissButton>
          </S.ButtonsContainer>
        </S.TextContainer>
      </S.PopupContainer>
    );
  } else {
    return <></>;
  }
};

export default BugReportPopup;
