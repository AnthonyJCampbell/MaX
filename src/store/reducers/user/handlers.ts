// Copyright 2021 Metaswitch Networks - Highly Confidential Material
import { User } from "src/types";
import { UserReducerState } from "store/types";

/**
 * Handler for user data.
 * @param state - The Redux state
 * @param user - The action payload user
 */
export const dataUser = (state: UserReducerState, user: User): UserReducerState => ({
  ...state,
  user,
});
