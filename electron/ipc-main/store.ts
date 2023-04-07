import { BrowserWindow, IpcMainInvokeEvent } from "electron";
import { clearStore, deleteStore, getStore, hasStore, setStore } from "./utils";

export default {
    "SET_STORE": (event: IpcMainInvokeEvent, win: BrowserWindow, key: string, value: any) => setStore(key, value),
    "GET_STORE": (event: IpcMainInvokeEvent, win: BrowserWindow, key: string, defaultValue: any = null) => getStore(key, defaultValue),
    "DELETE_STORE": (event: IpcMainInvokeEvent, win: BrowserWindow, key: string) => deleteStore(key),
    "HAS_STORE": (event: IpcMainInvokeEvent, win: BrowserWindow, key: string) => hasStore(key),
    "CLEAR_STORE": (event: IpcMainInvokeEvent, win: BrowserWindow) => clearStore()
}