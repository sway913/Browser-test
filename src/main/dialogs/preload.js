const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("api", {
    send: (channel, data) => {
        window.ipcRenderer.send(channel, data)
    },
    receive: (channel, func) => {
        window.ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
})
