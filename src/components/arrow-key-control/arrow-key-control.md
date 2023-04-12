# Arrow Key Control

For efficient keyboard navigation around the UI, we have broken the app down into sections that you tab between, with 'arrow-key-control' sections that use up and down/left and right arrow keys to navigate between buttons.

## Design

The key idea is that we add a wrapper component (`ArrowKeyControl`) into the JSX for a section we want to add arrow key navigation to, surrounding at least every 'focusable' element we want to navigate through. We have defined a 'focusable' as an element that we want to be able to navigate to using arrow keys.

Every focusable has an id and passes that id to the `ArrowKeyControl` component. We also remove each focusable from the tab order (so that we can't tab to them). The tab order is the list of HTML elements we can tab to, normally consisting of buttons and other interactive elements.

`ArrowKeyControl` then handles arrow key presses and any focus changes to any of its 'focusable' children, bringing the relevant focusable to focus and adding it to the tab order (so that if we tab away and come back the UI remembers which focusable  we were on last).

It is the section's responsibility (i.e. the component that has `ArrowKeyControl` in its JSX) to create the relevant id list, pass them to `ArrowKeyControl` in the correct form and order, and remove the focusables from the tab order. It is `ArrowKeyControl`'s responsibility to ensure that one (and only one) focusable is in the tab order at any given time, and that all focusables are accessible through any form of navigation at all times.

## How it works

`ArrowKeyControl` handles key down events and focus events for all its children (whether focusable or not).

- On a key down event, the `handleKeyDown` function works out what key was pressed, if up/right, it moves the focus forwards, if down/left it moves the focus backwards. If at the end of the list of focusables, it loops the focus back to the beginning (and vice versa backwards).

- The `handleFocus` function is then called, as a child component has just received focus. This function removes the (saved in state) previous focussed focusable from the tab order, adds the newly focussed focusable to the tab order, and saves this current focusable to state.

- In the case that no children are in the tab order (maybe the user filtered the contact list and removed the component that was in focus), `ArrowKeyControl` adds itself to the tab order and the next time it recieves focus, passes it immediately to the first available focusable.

## Instructions

So, how do we add arrow key navigation to a new section?

### Examples

A simple example can be found in [Sidebar](../sidebar/sidebar.js).

A complicated example can be found in [ContactList](../midbar/contact-list/contact-list.js).

### Step-by-step

Here are some higher-level step-by-step instructions, but I'd recommend reading how it works above, and the examples, if you get stuck/need more information. If all else fails, talk to BB3.

1. Identify your focusables
    - Make sure each element has an id set.
    - Remove all but the first focusable from the tab order using attribute `tabIndex="-1"`.
2. Create your `idList` using your ids
    - This must always match the visual order in the UI.
3. Wrap one `ArrowKeyControl` component around the focusables
    - All the focusables should be children/descendants of the *single* `ArrowKeyControl` component
    - It doesn't matter what other components end up as descendents, as long as they are not in the tab order.
    - Make sure to pass the `idList` through to the `ArrowKeyControl` component.

## Current Progress

We have currently broken out the sidebar, chat list and contact list as arrow-key-control sections, and still to do are: Call list (midbar), Contact List/Conversation buttons, and chat messages (rightbar).
