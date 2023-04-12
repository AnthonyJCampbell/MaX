# Menu

## Behaviour

`Menu` allows the creation of menus with sections (and section titles), simple buttons, radio buttons and sliders all inside a non-modal (i.e. the user can interact with the UI outside it) menu. It provides some keyboard navigation. The current implementation tied into `TopMenuButton` (using Tippy) prevents multiple concurrent menus from being visible.

## Design

`Menu` is a component to be reused throughout the application when a button is pressed and should contain a menu.
It handles the menu visibility and passes down some methods for keyboard navigation using the `keyboardNavTools` object.
`Menu` needs to take a `keyboardNavTools` object from its parent component (i.e.: [`AddMenu`](../sidebar/add-menu.js),
[`AvatarMenu`](../sidebar/avatar-menu.js) or [`CallMenu`](src/components/rightbar/content-header-panel/default-header-panel/call-button/call-menu.js)) as its props so it can handle keyboard navigation correctly.
See the usage in the [`Menu` component](menu.js) for details of what the `keyboardNavTools` prop should contain.

When the menu object provides a clickAction property for Button objects, we expect that that clickAction method does an explicit log.userAction call.
The Button object itself will only log a user action when the button is disabled, either explicitly, or because no clickAction has been provided.

Components in `menu.js` should be used to build a new `XxxMenu` component for each required menu like this:

```js
return (
  <Menu keyboardNavTools={keyboardNavTools}>
    <Section>
      <Title text={"Menu Header Text"} /> // Optional - Adds a header to the menu
      <Button imageSrc={ImageSource} text={`Menu button text`} />
    </Section>
  </Menu>
);
```

**Note:** When using the `Tippy` component for showing a menu ([`Sidebar`](../sidebar/sidebar.js) has some examples), it must have another component as a parent (usually a simple React Fragment) in order for the menu to appear correctly anchored to its parent. For more information on using Tippy.js, take a look at the documentation: [Tippy.js v4 docs](https://kabbouchi.github.io/tippyjs-v4-docs/).
