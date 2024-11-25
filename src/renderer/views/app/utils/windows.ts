const { ipcRenderer } = require("electron")

export const getCurrentWindowId: number = ipcRenderer.sendSync('get-current-window-id');

console.log('getCurrentWindowId:' + getCurrentWindowId);

export const closeWindow = () => {
  ipcRenderer.send('close');
}

export const minimizeWindow = () => {
  ipcRenderer.send('unmaximize');
}

export const maximizeWindow = () => {
  ipcRenderer.send('maximize');
}
