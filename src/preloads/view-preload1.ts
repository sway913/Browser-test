import { app, ipcRenderer, webFrame } from "electron"
import { getTheme } from "~/utils/themes"
import { ERROR_PROTOCOL, WEBUI_BASE_URL } from "~/constants/files"
import { contextBridge } from "electron"
const tabId = ipcRenderer.sendSync("get-webcontents-id")

export const windowId: number = ipcRenderer.sendSync("get-window-id")

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
    on(...args: Parameters<typeof window.ipcRenderer.on>) {
        const [channel, listener] = args
        return window.ipcRenderer.on(channel, (event, ...args) =>
            listener(event, ...args)
        )
    },
    off(...args: Parameters<typeof ipcRenderer.off>) {
        const [channel, ...omit] = args
        return ipcRenderer.off(channel, ...omit)
    },
    send(...args: Parameters<typeof window.ipcRenderer.send>) {
        const [channel, ...omit] = args
        return window.ipcRenderer.send(channel, ...omit)
    },
    invoke(...args: Parameters<typeof window.ipcRenderer.invoke>) {
        const [channel, ...omit] = args
        return window.ipcRenderer.invoke(channel, ...omit)
    }

    // You can expose other APTs you need here.
    // ...
})

const goBack = async () => {
    await window.ipcRenderer.invoke(`web-contents-call`, {
        webContentsId: tabId,
        method: "goBack"
    })
}

const goForward = async () => {
    await window.ipcRenderer.invoke(`web-contents-call`, {
        webContentsId: tabId,
        method: "goForward"
    })
}

window.addEventListener("mouseup", async (e) => {
    if (e.button === 3) {
        e.preventDefault()
        await goBack()
    } else if (e.button === 4) {
        e.preventDefault()
        await goForward()
    }
})

let beginningScrollLeft: number = null
let beginningScrollRight: number = null
let horizontalMouseMove = 0
let verticalMouseMove = 0

function getScrollStartPoint(x: number, y: number) {
    let left = 0
    let right = 0

    let n = document.elementFromPoint(x, y)

    while (n) {
        if (n.scrollLeft !== undefined) {
            left = Math.max(left, n.scrollLeft)
            right = Math.max(
                right,
                n.scrollWidth - n.clientWidth - n.scrollLeft
            )
        }
        n = n.parentElement
    }
    return { left, right }
}

document.addEventListener("wheel", (e) => {
    verticalMouseMove += e.deltaY
    horizontalMouseMove += e.deltaX

    if (beginningScrollLeft === null || beginningScrollRight === null) {
        const result = getScrollStartPoint(e.deltaX, e.deltaY)
        beginningScrollLeft = result.left
        beginningScrollRight = result.right
    }
})


const postMsg = (data: any, res: any) => {
    window.postMessage(
        {
            id: data.id,
            result: res,
            type: "result"
        },
        "*"
    )
}

const hostname = window.location.href.substr(WEBUI_BASE_URL.length)

const settings = ipcRenderer.sendSync("get-settings-sync")
if (
    window.location.href.startsWith(WEBUI_BASE_URL) ||
    window.location.protocol === `${ERROR_PROTOCOL}:`
) {
    ;(async function () {
        contextBridge.exposeInMainWorld("process", process)
        contextBridge.exposeInMainWorld("settings", settings)
        if (window.location.pathname.startsWith("//network-error")) {
            contextBridge.exposeInMainWorld("theme", getTheme(settings.theme))
            contextBridge.exposeInMainWorld(
                "errorURL",
                await window.ipcRenderer.invoke(`get-error-url-${tabId}`)
            )
        } else if (hostname.startsWith("newtab")) {
            contextBridge.exposeInMainWorld(
                "getTopSites",
                async (count: number) => {
                    return await window.ipcRenderer.invoke(
                        `topsites-get`,
                        count
                    )
                }
            )
        }
    })()
} else {
    ;(async function () {
        if (settings.doNotTrack) {
            await webFrame.executeJavaScript(
                `window.navigator.doNotTrack = { value: 1 }`
            )
        }

        if (settings.globalPrivacyControl) {
            await webFrame.executeJavaScript(
                `window.navigator.globalPrivacyControl = true`
            )
        }
    })()
}

if (window.location.href.startsWith(WEBUI_BASE_URL)) {
    window.addEventListener("DOMContentLoaded", () => {
        if (hostname.startsWith("settings")) document.title = "Settings"
        else if (hostname.startsWith("history")) document.title = "History"
        else if (hostname.startsWith("bookmarks")) document.title = "Bookmarks"
        else if (hostname.startsWith("extensions"))
            document.title = "Extensions"
        else if (hostname.startsWith("welcome"))
            document.title = "lunarwolf Setup"
        else if (hostname.startsWith("changelog")) document.title = "Updater"
        else if (hostname.startsWith("newtab")) document.title = "New Tab"
    })

    window.addEventListener("message", async ({ data }) => {
        if (data.type === "storage") {
            const res = await window.ipcRenderer.invoke(
                `storage-${data.operation}`,
                {
                    scope: data.scope,
                    ...data.data
                }
            )

            postMsg(data, res)
        } else if (data.type === "credentials-get-password") {
            const res = await window.ipcRenderer.invoke(
                "credentials-get-password",
                data.data
            )
            postMsg(data, res)
        } else if (data.type === "save-settings") {
            window.ipcRenderer.send("save-settings", { settings: data.data })
        }
    })

}
