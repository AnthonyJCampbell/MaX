# Rampup

This doc covers how to get ramped up on the technology used in the Electron UI. It includes

- [JavaScript](#JavaScript)
- [React](#React)
  - [Core](#Core-React)
  - [Hooks](#Hooks)
  - [Styled Components](#Styled-components)
- [CSS](#CSS)
- [Redux](#Redux)
- [Electron](#Electron)
- [Protocol Buffers](#Protocol-buffers)

Each technology is split into 4 areas:

1. **Beginner Topics** - The minimum you need to know to hack around with the codebase. Suitable for hackathons and interested parties who just want to play about.
2. **Core Topics** - The minimum you need to know to make significant changes. Engineers who intend to frequently work with this codebase should go through all of this beforehand or very early on, as well as the beginner topics.
3. **Advanced Topics** - Further topics that are useful to know for working on this codebase, but that you don't need day-to-day. Engineers working with the codebase frequently should try to go through these materials at some point, possibly as part of their development plan.
4. **Reference** - Good sources for looking up information about the technology. Not necessary to read through - more like a collection of places we've found useful.

## JavaScript

The Electron UI is written almost entirely in JavaScript, so having a good grasp on the language is obviously beneficial.

### Beginner

- A quick [overview](https://www.youtube.com/watch?v=W6NZfCO5SIk) (48 mins)

### Core

- [Optional] a more [in-depth overview](https://www.youtube.com/watch?v=hdI2bqOjy3c) (100 mins) with better examples then the beginner overview, and interaction with HTML.

- [`let` keyword](https://www.w3schools.com/js/js_let.asp)
- [`const` keyword](https://www.w3schools.com/js/js_const.asp)
- [Array methods](https://www.w3schools.com/js/js_array_methods.asp)
- [Arrow Functions](https://www.w3schools.com/js/js_arrow_function.asp)
- [Spread operator](https://javascript.info/rest-parameters-spread)

### Advanced

- [`async`/`await`](https://javascript.info/async-await)
- [Classes](https://javascript.info/classes)
- [Events](https://www.w3schools.com/js/js_events.asp)

### References

- The [Modern JavaScript tutorial](https://javascript.info/) is an excellent resource covering everything JavaScript - almost all of it is worth reading at some point.

## React

React is a JavaScript framework for displaying a UI. It allows writing of modular code representing sections of UI with minimal HTML-related boilerplate.

### Core React

#### Beginner

- [React main concepts](https://reactjs.org/docs/hello-world.html), 12 articles which cover most of the basics

#### Core

- This YouTube [React crash course](https://www.youtube.com/watch?v=sBws8MSXN7A) (98 mins)

#### Advanced

- [Memoization](https://reactjs.org/docs/react-api.html#reactmemo)
- [Advanced React: JSX in Depth](https://reactjs.org/docs/jsx-in-depth.html)

#### References

- The [Complete React Tutorial playlist](https://www.youtube.com/watch?v=OxIDLw0M-m0&list=PL4cUxeGkcC9ij8CfkAY2RAGb-tmkNwQHG). Collection of ~5 min videos, can dip in and out of ones that seem useful

### Hooks

Modern React uses a concept called "Hooks" to manage state and side-effects. We make heavy use of them.

#### Beginner

- [Hooks at a Glance](https://reactjs.org/docs/hooks-overview.html)

#### Core

- [Intro To Hooks](https://reactjs.org/docs/hooks-intro.html)
- [Using The State Hook](https://reactjs.org/docs/hooks-state.html)
- [Using The Effect Hook](https://reactjs.org/docs/hooks-effect.html)
- [Rules of Hooks](https://reactjs.org/docs/hooks-rules.html)

#### Advanced

None

#### References

- [Building Your Own Hooks](https://reactjs.org/docs/hooks-custom.html)
- [Hooks API Reference](https://reactjs.org/docs/hooks-reference.html)

### Styled Components

Styled components provide a way of applying to CSS to specific React Components or Elements. We use them for all our styling

#### Beginner

- [Basic documentation](https://styled-components.com/docs/basics#getting-started)

#### Core

- [Styled-Components tutorial](https://www.robinwieruch.de/react-styled-components)

#### Advanced

- [In-depth tutorial](https://medium.com/styled-components/styled-components-getting-started-c9818acbcbbd)
- [Advanced docs](https://styled-components.com/docs/advanced)

#### References

None

## Redux

Redux is a state store geared towards usage with React. It allows minimal, centralised state that is pushed out to React Components, rather than individual components maintaining their own state.

Note that most tutorials will still be using old class-based React syntax rather than hooks. Therefore, it's recommended you first read up on Hooks and pay close attention to "Redux Hooks"

### Beginner

- [Getting Started With Redux](https://redux.js.org/introduction/getting-started)
- [Redux Terms and Concepts](https://redux.js.org/tutorials/essentials/part-1-overview-concepts#redux-terms-and-concepts)
- [Basic Data flow](https://redux.js.org/tutorials/essentials/part-3-data-flow)

### Core

- The rest of the [Redux essentials tutorial](https://redux.js.org/tutorials/essentials/part-1-overview-concepts). Parts 1 and 3 are covered in the `Beginner` section above
- `useSelector` and `useDispatch` from the [Redux Hooks](https://react-redux.js.org/api/hooks) guide.

### Advanced

- [Advanced Tutorial](https://redux.js.org/advanced/advanced-tutorial)

### References

Extra tutorials:

- [What Does Redux Do?](https://daveceddia.com/what-does-redux-do/)
- [How Does Redux Work?](https://daveceddia.com/how-does-redux-work/)
- [Redux and React: An Introduction](https://jakesidsmith.com/blog/post/2017-11-18-redux-and-react-an-introduction/)

## CSS

CSS (Cascading Style Sheet) is a language for changing how a webpage (HTML) looks. This includes HTML generated by React.

### Beginner

- [Intro](https://www.w3schools.com/Css/css_intro.asp)
- [Syntax](https://www.w3schools.com/Css/css_syntax.asp) - Don't worry too much about the talk of selectors, we rarely need them.

### Core

- [Sizing](https://www.w3schools.com/Css/css_dimension.asp)
- [Box Model](https://www.internetingishard.com/html-and-css/css-box-model/) - The concepts behind how CSS determines content layout
- [Flexbox](https://www.internetingishard.com/html-and-css/flexbox/) - A framework for interacting with the box model, i.e. laying out content
  - [Flexbox froggy minigame](https://flexboxfroggy.com/) - Optional but recommended minigame for learning flexbox
- [Colours](https://www.w3schools.com/Css/css_colors.asp)

### Advanced

- [Animation](https://www.w3schools.com/css/css3_animations.asp)
- [Selectors](https://www.internetingishard.com/html-and-css/css-selectors/)
- [Advanced Positioning](https://www.internetingishard.com/html-and-css/advanced-positioning/)
- [Responsive Design](https://www.internetingishard.com/html-and-css/responsive-design/)
- [Responsive Images](https://www.internetingishard.com/html-and-css/responsive-images/)

### References

- [Flexbox Cheatsheet](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

## Electron

Electron is a framework that allows desktop apps to be written with webpages as their screens. It is used by many well known desktop apps such as VS Code, WhatsApp, Slack, Twitch and Discord.

### Beginner

- [Electron Application Architecture](https://www.electronjs.org/docs/tutorial/application-architecture)

### Core

- Up to and including "Hello World" in [this Electron tutorial](https://www.tutorialspoint.com/electron/index.htm)
- [Inter-process communication (IPC)](https://www.tutorialspoint.com/electron/electron_inter_process_communication.htm)

### Advanced

None - Although skimming the [`BrowserWindow` API reference](https://www.electronjs.org/docs/api/browser-window) listed below is worthwhile

### References

- The [BrowserWindow API reference](https://www.electronjs.org/docs/api/browser-window)
- Adrian Thurrell's [writeup](https://metacom2.metaswitch.com/confluence/x/Wgi0BQ) of a Udemy Electron course

## Protocol Buffers

A tool used for de/serializing messages to be sent between the UCDaemon and Electron-ui. See the [protobuf-wispa readme](https://git.datcon.co.uk/accession/Desktop/protobuf-wispa/-/blob/master/README.md) for more information.
