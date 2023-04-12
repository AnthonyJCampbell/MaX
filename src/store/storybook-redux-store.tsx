// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import React from "react";
import { createStore, AnyAction, Store } from "redux";
import { Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { Provider } from "react-redux";
import { StoreState } from "src/store/types";

import { mockStoreState } from "shared/mocks/mock-states";
import { mutableCloneDeep } from "shared/mocks/ts-utils";

const initialState = mutableCloneDeep(mockStoreState);

const SETUP_STORYBOOK_ACTION = "SETUP_STORYBOOK_ACTION";

const reducer = (state: StoreState = initialState, reduxAction: AnyAction): StoreState => {
  const { type, ...extraProps } = reduxAction;

  if (type === SETUP_STORYBOOK_ACTION) {
    return extraProps as StoreState;
  }

  if (type) {
    action(`Redux Action Dispatched:\n${JSON.stringify(reduxAction, null, 2)}`);
  }

  return state;
};

const getStore = (): Store => createStore<StoreState, AnyAction, unknown, unknown>(reducer);

type StorybookDecorator = (StoryComponent: Story) => React.ReactElement<unknown>;

export const emptyReduxStoreDecorator: StorybookDecorator = (
  StoryComponent: Story
): React.ReactElement<unknown> => (
  <Provider store={getStore()}>
    <StoryComponent />
  </Provider>
);

export const reduxStoreDecorator = (state: StoreState): StorybookDecorator => {
  const store = getStore();
  store.dispatch({
    type: SETUP_STORYBOOK_ACTION,
    ...state,
  });

  // eslint-disable-next-line react/display-name
  return (StoryComponent: Story): React.ReactElement<unknown> => (
    <Provider store={store}>
      <StoryComponent />
    </Provider>
  );
};
