import { spawn } from 'child_process';
import { BrowserWindow, IpcMainInvokeEvent, dialog, shell } from 'electron';

export default {
    "OPEN_SINGLE_FOLDER_DIALOG": async (event: IpcMainInvokeEvent, win: BrowserWindow) => {

        const result = await dialog.showOpenDialog({ properties: ['openDirectory'] })

        if (result.canceled)
            return null
        else
            return result.filePaths[0]


    },
    "OPEN_IN_EXPLORER": (event: IpcMainInvokeEvent, win: BrowserWindow, path: string) => shell.openPath(path),
    "OPEN_IN_TERMINAL": (event: IpcMainInvokeEvent, win: BrowserWindow, path: string) => spawn('gnome-terminal', { cwd: path }),
}