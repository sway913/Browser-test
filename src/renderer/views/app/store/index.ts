/* Copyright (c) 2021-2024 Damon Smith */

import { observable, computed, makeObservable, makeAutoObservable } from "mobx"

import { TabsStore } from "./tabs"
import { TabGroupsStore } from "./tab-groups"
import { AddTabStore } from "./add-tab"
import { ipcRenderer } from "electron"
import { SettingsStore } from "./settings"
import { getCurrentWindowId } from "../utils/windows"
import { StartupTabsStore } from "./startup-tabs"
import { getTheme } from "~/utils/themes"
import { NETWORK_ERROR_HOST, WEBUI_BASE_URL } from "~/constants/files"

export class Store {
    public settings = new SettingsStore(this)
    public addTab = new AddTabStore()
    public tabs = new TabsStore()
    public startupTabs = new StartupTabsStore(this)
    public tabGroups = new TabGroupsStore(this)

    public inputRef: HTMLInputElement

    public canOpenSearch = false

    public mouse = {
        x: 0,
        y: 0
    }

    public windowId = getCurrentWindowId

    public barHideTimer = 0

    public isIncognito = ipcRenderer.sendSync(`is-incognito-${this.windowId}`)

    // Observable
    public isAlwaysOnTop = false

    public isFullscreen = false

    public isHTMLFullscreen = false

    public titlebarVisible = false

    public updateAvailable = false

    public navigationState = {
        canGoBack: false,
        canGoForward: false
    }

    public downloadsButtonVisible = false

    public isUIpage = true

    public downloadNotification = false

    public isBookmarked = false

    public zoomFactor = 1

    public dialogsVisibility: { [key: string]: boolean } = {
        menu: false,
        "add-bookmark": false,
        zoom: false,
        "extension-popup": false,
        "downloads-dialog": false,
        incognitoMenu: false,
        menuExtra: false
    }

    public get downloadProgress() {
        return 0
    }

    public get isCompact() {
        return this.settings.object.topBarVariant === "compact"
    }

    public get theme() {
        return getTheme(this.settings.object.theme)
    }

    public constructor() {
        makeObservable(this, {
            isAlwaysOnTop: observable,
            isFullscreen: observable,
            isHTMLFullscreen: observable,
            titlebarVisible: observable,
            updateAvailable: observable,
            navigationState: observable,
            downloadsButtonVisible: observable,
            downloadNotification: observable,
            isBookmarked: observable,
            zoomFactor: observable,
            dialogsVisibility: observable,
            theme: computed,
            isCompact: computed,
            downloadProgress: computed,
            isUIpage: observable
        })

        ipcRenderer.on("update-navigation-state", (e, data) => {
            this.navigationState = data
        })

        ipcRenderer.on("is-ui-page", (e, data) => {
            this.isUIpage = data
        })

        ipcRenderer.on("update-navigation-state-ui", (e, url) => {
            var url = url.url
            this.isUIpage =
                url.startsWith(WEBUI_BASE_URL) ||
                url.startsWith(NETWORK_ERROR_HOST)
        })

        ipcRenderer.on("fullscreen", (e, fullscreen: boolean) => {
            this.isFullscreen = fullscreen
        })

        ipcRenderer.on("html-fullscreen", (e, fullscreen: boolean) => {
            this.isHTMLFullscreen = fullscreen
        })

        ipcRenderer.on("update-available", () => {
            this.updateAvailable = true
        })

        ipcRenderer.on("dialog-visibility-change", (e, name, state) => {
            this.dialogsVisibility[name] = state
        })
    }
}

export default new Store()
