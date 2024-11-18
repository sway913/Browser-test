/* Copyright (c) 2021-2024 Damon Smith */

import { observable, action, computed, makeObservable } from "mobx"

import { ISettings } from "~/interfaces"
import { DEFAULT_SETTINGS } from "~/constants"
import { Store } from "."

export type SettingsSection = "startup"

export class SettingsStore {
    public selectedSection: SettingsSection = "startup"

    public object: ISettings = DEFAULT_SETTINGS

    public store: Store

    public constructor(store: Store) {
        makeObservable(this, {
            selectedSection: observable,
            object: observable,
            searchEngine: computed,
            updateSettings: action
        })

        this.store = store

        let firstTime = false

        window.ipcRenderer.send("get-settings")

        window.ipcRenderer.on("update-settings", (e, settings: ISettings) => {
            this.updateSettings(settings)

            if (!firstTime) {
                store.startupTabs.load()
                firstTime = true
            }
        })
    }

    public get searchEngine() {
        return this.object.searchEngines[this.object.searchEngine]
    }

    public updateSettings(newSettings: ISettings) {
        const prevState = { ...this.object }
        this.object = { ...this.object, ...newSettings }

        if (prevState.topBarVariant !== newSettings.topBarVariant) {
            requestAnimationFrame(() => {
                this.store.tabs.updateTabsBounds(true)
            })
        }
    }

    public async save() {
        window.ipcRenderer.send("save-settings", {
            settings: JSON.stringify(this.object)
        })
    }
}
