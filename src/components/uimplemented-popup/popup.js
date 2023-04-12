// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/* eslint-disable i18next/no-literal-string */
import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideUnimplemented } from "action-creators/navigation/actions";

import betaApp from "assets/shared/beta-app.png";

import * as S from "./styles";

const UnimplementedPopup = () => {
  const dispatch = useDispatch();
  const ref = useRef();

  const { showUnimplementedPopup } = useSelector((state) => state.paneManagementReducer);

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
    dispatch(hideUnimplemented());
  };

  if (showUnimplementedPopup) {
    return (
      <S.PopupContainer ref={ref} role="alert">
        <S.ImageContainer>
          <S.Image src={betaApp} alt=""></S.Image>
        </S.ImageContainer>
        {/* The text below is not in the translation resource file (common.yaml) because this popup
         will be removed in GA, and thus doesn't need translation.*/}
        <S.TextContainer>
          <S.BoldText>{"Not supported in the EA client"}</S.BoldText>
          <S.NormalText>
            {"This feature is targeted to be available in the Beta release."}
          </S.NormalText>
          <S.ButtonsContainer>
            <S.DismissButton>
              <button onClick={() => dispatch(hideUnimplemented())}>{"DISMISS"}</button>
            </S.DismissButton>
            {/* TODO Hide this until we've got the blog up and running, */}
            {/* <S.DetailsButton>
              <button
                onClick={() => {
                  dispatch(hideUnimplemented());
                  window.open("http://url/for/maxuc/blog");
                }}
              >
                {"MORE DETAILS..."}
              </button>
            </S.DetailsButton> */}
          </S.ButtonsContainer>
        </S.TextContainer>
      </S.PopupContainer>
    );
  } else {
    return <></>;
  }
};

export default UnimplementedPopup;
