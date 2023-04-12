We have not written any unit tests for `window-listeners.js`, as the functionality within the file:

Is at the edge of Node-React IPC, and so would require more time to add UTs than they would save - it will be immediately obvious when trying to do any development or testing if the Node-React IPC stops working, as no contact list/chat list/anything received from Java will appear in the UI.