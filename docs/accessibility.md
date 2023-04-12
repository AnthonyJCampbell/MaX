# Accessibility

A general overview of how we implement accessibility (a11y) is [Accessibility (a11y) design](https://metacom2.metaswitch.com/confluence/x/HBrfBg)

At a high level, the application is split into nav (sidebar), section/search (midbar) and main (rightbar) landmarks. The main section has the header panel marked as such.

Keyboard navigation is achieved mostly via tab, but with an ArrowControl to shorten the tablist (by using the arrow keys to move focus) in the following places:

- Sidebar
- The midbar lists (contacts, etc.)
- Drop-down menu (more menu in the rightbar, settings menu on the user avatar, etc.)
- TODO: The rightbar tabs
- TODO: The rightbar chat pane

## Code standards

- Use semantic html
- New code should not introduce new @axe-core/react console errors
- Aria labels should be added where appropriate
- It should be obvious that an interactive element has focus / the mouse is hovering over it

More detail on how to implement this is in [Accessibility (a11y) design](https://metacom2.metaswitch.com/confluence/x/HBrfBg).

## Testing

### Scripted tests

Electron FV tests use Spectron, which can automate some accessibility tests (roughly equivalent to axe below).  Note, this can only check the currently displayed UI, so auditAccessibility must be called multiple times, so that the UI is checked as it changes during the test.  Note, it don't call auditAccessibility after every interaction, just enough so that all UI parts are audited at some point, otherwise the test will be too slow.  Use some judgement, but if you're not sure, then add an audit.

### axe

> axe only runs on dev builds, so you can't do this check on bundled installers!

@axe-core/react is a library we use to check accessibility. This is automatically included in dev builds (i.e. `npm start` clients - NOT bundled installer). This library will print out errors on the dev tools console when it discovers an accessibility issue with the rendered DOM, e.g. missing string description for images, insufficient contrast between elements, etc. To open dev tools, press `Ctrl + Shift + I` on the client.  You'll then need to open the console tab and keep an eye on it while you use the app (axe only spots problems with the currently displayed UI).

The electron FVs should run very similar tests, so depending on your FV coverage this might not need to be done manually.

## Known issues

### Windows Narrator arrow-key navigation can cause deadlock

We've seen in testing that the app can deadlock (permanently) under the following conditions:

- Windows Narrator is on
- Focus is on a `<button>` which has:
  - An `aria-label` longer than ~10 characters
  - No child element
- User attempts to navigate away with arrow keys

We haven't bothered to test further to determine whether there is a more minimal repro, because it hasn't been valuable to do so. We also haven't been able to quickly find any report online of an issue that may be causing this behaviour.

There is a workaround, to add a child element containing the text to be displayed on the button:

```javascript
// Before
<button aria-label="my longish aria label">
  {"Click Me!"}
</button>

// After
<button aria-label="my longish aria label">
  <span aria-hidden={true}>
    {"Click Me!"}
  </span>
</button>
```

`<span>` tags should not cause any change in behaviour as they are just containers for e.g. CSS. Adding spans that just wrap pre-existing elements, as above, should also not cause any change in layout.
