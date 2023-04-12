# Pane control state handler

We have not written any unit tests (so far!) for `pane-control-state-handler.js`, as the functionality within the file:

- Contains too little logic, and so any UTs would to be too low-level - the pane control state handler dispatches actions on useEffect (hard to mock)
