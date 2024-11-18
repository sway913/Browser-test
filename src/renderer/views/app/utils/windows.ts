// export const getCurrentWindow = () => remote.getCurrentWindow();

export const getCurrentWindow = async () => {
    const windowInfo = await window.ipcRenderer.invoke("get-current-window")
    return windowInfo
}

export const closeWindow = () => {
    // getCurrentWindow().close();
}

export const minimizeWindow = () => {
    // getCurrentWindow().minimize();
}

export const maximizeWindow = () => {
    // const currentWindow = getCurrentWindow();
    // if (currentWindow.isMaximized()) {
    //   currentWindow.unmaximize();
    // } else {
    //   currentWindow.maximize();
    // }
}
