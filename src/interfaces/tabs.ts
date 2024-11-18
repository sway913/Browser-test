/* Copyright (c) 2021-2024 Damon Smith */

export type TabEvent =
    | "load-commit"
    | "url-updated"
    | "title-updated"
    | "favicon-updated"
    | "did-navigate"
    | "loading"
    | "pinned"
    | "credentials"
    | "blocked-ad"
    | "zoom-updated"
    | "media-playing"
    | "media-paused"

export interface TabCreateProperties {
    /** Optional. The position the tab should take in the window. The provided value will be clamped to between zero and the number of tabs in the window. */
    index?: number | undefined
    /**
     * Optional.
     * The ID of the tab that opened this tab. If specified, the opener tab must be in the same window as the newly created tab.
     * @since Chrome 18
     */
    openerTabId?: number | undefined
    /**
     * Optional.
     * The URL to navigate the tab to initially. Fully-qualified URLs must include a scheme (i.e. 'http://www.google.com', not 'www.google.com'). Relative URLs will be relative to the current page within the extension. Defaults to the New Tab Page.
     */
    url?: string | undefined
    /**
     * Optional. Whether the tab should be pinned. Defaults to false
     * @since Chrome 9
     */
    pinned?: boolean | undefined
    /** Optional. The window to create the new tab in. Defaults to the current window. */
    windowId?: number | undefined
    /**
     * Optional.
     * Whether the tab should become the active tab in the window. Does not affect whether the window is focused (see windows.update). Defaults to true.
     * @since Chrome 16
     */
    active?: boolean | undefined
    /**
     * Optional. Whether the tab should become the selected tab in the window. Defaults to true
     * @deprecated since Chrome 33. Please use active.
     */
    selected?: boolean | undefined
}
