import { BrowserWindow, IpcMainInvokeEvent } from 'electron'
import fs from 'fs'

export default {
    "FILE_EXISTS": (event: IpcMainInvokeEvent, win: BrowserWindow, path: string) => {

        if (fs.existsSync(path))
            return true
        else
            throw new Error(`${path} not exists!`)

    },
}