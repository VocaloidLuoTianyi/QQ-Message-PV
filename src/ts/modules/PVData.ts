export interface PVAction {
    type: "delay" | "message" | "set-unread-msg-count",
    data: object
}

export interface PVData {
    name: string,
    actions: Array<PVAction>
}

export const defaultData : PVData = {
    name: "New PV",
    actions: []
}