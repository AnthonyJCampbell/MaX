# IPC Listeners

This directory contains the `ipcRenderer` listeners which listen for IPC messages from Node. They will typically call Redux actions to trigger state updates when receiving messages.

The listeners are wrapped inside React components so that they are activated when the DOM renders. They can not be easily activated in other ways