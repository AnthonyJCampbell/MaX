// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/* eslint-disable i18next/no-literal-string */
import { DialKeyValue } from "store/types";

export const KeypadButtons = [
  {
    alternativeText: "",
    ariaLabel: "1",
    text: DialKeyValue.One,
  },
  {
    alternativeText: "abc",
    ariaLabel: "2, abc",
    text: DialKeyValue.Two,
  },
  {
    alternativeText: "def",
    ariaLabel: "3, def",
    text: DialKeyValue.Three,
  },
  {
    alternativeText: "ghi",
    ariaLabel: "4, ghi",
    text: DialKeyValue.Four,
  },
  {
    alternativeText: "jkl",
    ariaLabel: "5, jkl",
    text: DialKeyValue.Five,
  },
  {
    alternativeText: "mno",
    ariaLabel: "6, mno",
    text: DialKeyValue.Six,
  },
  {
    alternativeText: "pqrs",
    ariaLabel: "7, pqrs",
    text: DialKeyValue.Seven,
  },
  {
    alternativeText: "tuv",
    ariaLabel: "8, tuv",
    text: DialKeyValue.Eight,
  },
  {
    alternativeText: "wxyz",
    ariaLabel: "9, wxyz",
    text: DialKeyValue.Nine,
  },
  {
    alternativeText: "",
    ariaLabel: "*",
    text: DialKeyValue.Star,
  },
  {
    alternativeText: "+",
    ariaLabel: "0, +",
    text: DialKeyValue.Zero,
  },
  {
    alternativeText: "",
    ariaLabel: "#",
    text: DialKeyValue.Hash,
  },
];
