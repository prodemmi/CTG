import { BrowserWindow, IpcMainInvokeEvent } from "electron"
import { hideLoading, showLoading, showToast, updateScripts } from "./utils"
import DB from "../db"
import { reformatScriptCommand } from "../../utils/command"
import { exec } from 'child_process';

export default {
    "CREATE_SCRIPT": async (event: IpcMainInvokeEvent, win: BrowserWindow, projectId: Number, scriptName: string, scriptDesccription?: string, scriptCommand: string) => {
        try {
            DB.addScript(projectId, scriptName, scriptDesccription, scriptCommand)
            updateScripts(win)
            showToast(win, `Script '${scriptName}' added`)
        } catch (error) {
            win.webContents.send("ERROR", error)
        }
    },
    "RUN_SCRIPT": async (event: IpcMainInvokeEvent, win: BrowserWindow, path: string, command: string, args: [], options: []) => {

        const data = {}
        data.arguments = args
        data.options = options
        const commandText = reformatScriptCommand(path, command, { arguments: args, options })

        win.webContents.send("OUTPUT", '', commandText.split(';')[1])
    
        const process = exec(commandText)
        process.stdout.on('data', (data) => win.webContents.send('UPDATE_OUTPUT', { error: false, output: data.toString() }))
        process.stderr.on('data', (data) => win.webContents.send('UPDATE_OUTPUT', { error: true, output: data.toString() }))
        process.on('exit', (code) => { })

    },
    "DELETE_SCRIPT": (event: IpcMainInvokeEvent, win: BrowserWindow,  scriptId: Number) => {

        DB.deleteScript(scriptId)
        updateScripts(win)
        showToast(win, `Script successfuly deleted`)

    },
}