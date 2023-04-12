# Incoming Call Window unit testing explanation

We have not written any unit tests (so far!) for `incoming-call-window.js`, as the functionality within the file:

- Contains too little logic, and so any UTs would to be too low-level - incoming call window dispatches an action on useEffect (hard to mock) and renders a component.
