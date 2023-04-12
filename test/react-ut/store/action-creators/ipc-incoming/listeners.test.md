We have not written any unit tests for `listeners.js`, as the functionality within the file:

Is at the edge of Node-React IPC, and so would require more time to add UTs than they would save - it will be immediately obvious if the Node-React IPC stops working.