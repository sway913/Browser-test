import { getWebUIURL } from "~/common/webui"
import { TabCreateProperties } from "~/interfaces/tabs"

export const NEWTAB_URL = getWebUIURL("newtab")

export const defaultTabOptions: TabCreateProperties = {
    url: NEWTAB_URL,
    active: true
}
