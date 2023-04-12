# UI Design Limitations

Throughout development there are some patterns which we have found our UI does not play nicely with. These are common gotchas, where a UX wireframe looks simple enough but in practice is actually really tricky!

If you are assessing a wireframe then it is worth taking these into consideration.

## Elements that flow outside of a window

As we use an Electron/React stack, the application runs within a browser with UI drawn within the browser window. This means that almost all UI elements must be drawn within the window and it is not possible for a menu, for example, to flow outside of the window.

This is particularly obvious problem with smaller windows, where long menus typically want to flow outside the application.

### Alternatives

Where possible we re-plan our UX such that elements are within the bounds of the window. For example, keeping menu sizes within the minimum size for the given window.

### Workarounds

The in-call UI design has a drop-down within in which is much larger than the height of the window, and to achieve this we have to sneakily resize the window when the menu appears/disappears.

## Inline text inputs

Some more complex menu designs include more complex elements than buttons and submenus, such as inline textual inputs. While these can be easy to mock up, they tend to result in many late-development issues around accessibility and keyboard navigation.

### Alternatives

If a menu design includes a non-trivial element it is recommended to consider turning it into a modal dialogue instead (i.e. on selection of the menu element it triggers an overlay element prompting for inputs). This UX is significantly easier to produce effective and cost-efficient accessibility and keyboard-naviagation solutions.

> There are some known outstanding accessibility issues with modal dialogues, particularly on Mac (either keyboard or screen navigation works, but not both). However, fixing modal dialogues generally is the preferred long-term solution over introducing more custom menu elements which would require fixes per-element!
