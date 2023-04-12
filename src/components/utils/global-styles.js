// Copyright 2021 Metaswitch Networks - Highly Confidential Material
/**
 * Ensure there's a clean slate for the CSS of the entire app.
 * Most browsers (Electron included - which runs on Chromium) has preset defaults for things like default line heights, margins, font sizes of headings, and so on.
 * This can result in errant behaviour when styling. To ensure a clean slate and easier styling, this file resets all values.
 */
import LatoRegularWoff2 from "assets/fonts/Lato-Regular.woff2";
import { css, createGlobalStyle } from "styled-components";

export const globalFonts = css`
  @font-face {
    font-family: "lato";
    src: url(${LatoRegularWoff2}) format("woff2");
    font-weight: 300;
    font-style: normal;
  }
`;

// prettier-ignore
export const reset = css`
  html, body, div, span, applet, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  a, abbr, acronym, address, big, cite, code,
  del, dfn, em, img, ins, kbd, q, s, samp,
  small, strike, strong, sub, sup, tt, var,
  b, u, i, center,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, embed,
  figure, figcaption, footer, header, hgroup,
  main, menu, nav, output, ruby, section, summary,
  time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
    font-family: "lato" ,"Lucida Sans Unicode", "Lucida Grande";
    -webkit-font-smoothing: antialiased;
    user-drag: none;
    user-select: none;
  }
  input, textarea, select, button { font-family:inherit; }
  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, main, menu, nav, section {
    display: block;
  }
  /* HTML5 hidden-attribute fix for newer browsers */
  *[hidden] {
      display: none;
  }
  body {
    line-height: 1;
    overflow: hidden;
  }
  ol, ul {
    list-style: none;
  }
  blockquote, q {
    quotes: none;
  }
  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }
  table {
    border-collapse: collapse;
    border-spacing: 0;
  }
  button {
    background-color: inherit;
  }
  * {
    outline:none;

    ::-webkit-scrollbar-thumb {
      background-color: #babac0;
      border-radius: 8px;
      border: 3px solid #fff;
    }
    ::-webkit-scrollbar-track {
      background-color: #ffffff00;
    }
    ::-webkit-scrollbar {
      background-color: #ffffff00;
      width: 12px;
    }
    ::-webkit-scrollbar-button {
      display: none;
    }
  }
`

const GlobalCSS = createGlobalStyle`${reset}${globalFonts}`;

export default GlobalCSS;
