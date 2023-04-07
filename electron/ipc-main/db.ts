import { BrowserWindow, IpcMainInvokeEvent } from "electron"
import DB from "../db"

export default {
    "DB_FIND_ALL": async (event: IpcMainInvokeEvent, win: BrowserWindow, table: string, sql: string = '') => await DB.findAll(table, sql),
    "DB_FIND_ONE": async (event: IpcMainInvokeEvent, win: BrowserWindow, table: string, id: Number) => await DB.findOne(table, id),
    "DB_DELETE_ONE": async (event: IpcMainInvokeEvent, win: BrowserWindow, table: string, id: Number) => await DB.findOne(table, id),
}