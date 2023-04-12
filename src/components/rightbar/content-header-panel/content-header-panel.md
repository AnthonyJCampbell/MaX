# ContentHeaderPanel

## Behaviour
`ContentHeaderPanel`, which displays one of `InCallHeaderPanel` or `DefaultHeaderPanel`. Both of these display the name and status of the selected contact.

- `DefaultHeaderPanel` also has buttons to initiate (amongst others) calls and chats.
- `InCallHeaderPanel` also has buttons for call features, e.g. hold and ending the call.  Some of these buttons open menus

## Design

The choice of HeaderPanel is based on the activeCall state (and will factor in which Contact(s) are in the call).

`InCallHeaderPanel` uses the `TopButton` and `Menu` components to create the header buttons and menus.