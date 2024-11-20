import { makeObservable, observable } from "mobx"
import { Store } from "."
import { Database } from "~/models/database"
import { IStartupTab } from "~/interfaces/startup-tab"
import { ITab } from "../models"
import { defaultTabOptions } from "~/constants/tabs"

export class StartupTabsStore {
    public db = new Database<IStartupTab>("startupTabs")

    public isLoaded = false

    public list: IStartupTab[] = []

    private store: Store

    public constructor(store: Store) {
        makeObservable(this, { list: observable })

        this.store = store
    }

    public async load() {
        if (this.isLoaded) return

        this.isLoaded = true

        let needsNewTabPage = false

        needsNewTabPage = true
        if (needsNewTabPage) {
            this.store.tabs.addTabs([defaultTabOptions])
        }
    }

    public async addStartupTabItem(item: IStartupTab) {
        const itemToReplace = this.list.find((x) => x.id === item.id)
        if (itemToReplace) {
            this.db.update({ id: item.id }, item)
            this.list[this.list.indexOf(itemToReplace)] = {
                ...itemToReplace,
                ...item
            }
        } else {
            const doc = await this.db.insert(item)
            this.list.push(doc)
        }
    }

    public removeStartupTabItem(tabId: number) {
        const itemToDelete = this.list.find((x) => x.id === tabId)
        if (itemToDelete) {
            this.list = this.list.filter((x) => x.id !== tabId)
            this.db.remove({ id: tabId })
        }
    }

    public async updateStartupTabItem(tab: ITab) {
        this.addStartupTabItem({
            id: tab.id,
            windowId: this.store.windowId,
            url: tab.url,
            pinned: tab.isPinned,
            title: tab.title,
            favicon: tab.favicon,
            isUserDefined: false
        })
    }

    public clearStartupTabs(removePinned: boolean, removeUserDefined: boolean) {
        if (removePinned && removeUserDefined) {
            this.db.remove({}, true)
            this.list = []
        } else if (!removePinned) {
            this.db.remove({ pinned: false }, true)
            this.list = this.list.filter((x) => x.pinned)
        } else if (!removeUserDefined) {
            this.db.remove({ isUserDefined: false }, true)
            this.list = this.list.filter((x) => x.isUserDefined)
        } else {
            this.db.remove({ isUserDefined: false, pinned: false }, true)
            this.list = this.list.filter((x) => x.isUserDefined || x.pinned)
        }
    }
}
