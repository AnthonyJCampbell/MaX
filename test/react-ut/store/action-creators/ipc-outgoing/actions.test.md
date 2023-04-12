We have not written any unit tests (so far!) for `actions.js`, as the functionality within the file:
- Contains too little logic, and so any UTs would to be too low-level - the actions currently only define callbacks that send out for ipcRenderer messages.
