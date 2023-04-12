# Selectability Rules

These are the rules we should follow when implementing new UI which includes data or content that could be extracted from the app by the user. Includes text messages, contact details, etc. This rules apply only for highlighting and copying of this data.

- Data/content - The content that users may want to extract from the app is primarily data. Contact details, chat messages etc. If the element we’re implementing includes data we should consider making the item selectable.
- Non-interactive - However we should also ensure that the selecting behaviour won’t get in the way of navigating/interacting with the app. If the element performs a function/is interactive we should ensure the item is not selectable. A button label for example.
- Accessible in at least one place - If it doesn’t make sense to make the element user selectable, ensure the same data is available elsewhere in the app. For instance, contact names appear in the b pane but these are interactive elements - we have a read-only label at the top of the c pane which can be made selectable.
