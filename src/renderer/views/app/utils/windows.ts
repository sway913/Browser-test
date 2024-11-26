export const getCurrentWindowId: number = window.ipcRenderer.sendSync('get-current-window-id');

console.log('getCurrentWindowId:' + getCurrentWindowId);

export const closeWindow = () => {
  window.ipcRenderer.send('close');
}

export const minimizeWindow = () => {
  window.ipcRenderer.send('unmaximize');
}

export const maximizeWindow = () => {
  window.ipcRenderer.send('maximize');
}
