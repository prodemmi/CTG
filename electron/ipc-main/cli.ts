import { BrowserWindow, IpcMainInvokeEvent } from "electron"
import { getFramework } from "../../frameworks"
import { hideCLILoading, hideLoading, setStore, getStore, showCLILoading, showError, showLoading } from "./utils"

export default {
    "GET_CLI_DATA": async (event: IpcMainInvokeEvent, win: BrowserWindow, projectType: string, projectPath: string) => {

        try {

            showCLILoading(win, 'Getting CLI data')
            let data = await getFramework(projectType)
            await data.addTabs(win)
            const config = await getStore(projectPath)
            if(config){
                data = config
            } else {
                data = await data.getCliData(projectPath)
            }
            setStore(projectPath, data)
            setTimeout(() => hideCLILoading(win), 2000)
            return data

        } catch (error) {

            hideLoading(win)
            showError(win, error.message)

        }

    },
    "RUN_CLI_COMMAND": async (event: IpcMainInvokeEvent, win: BrowserWindow, projectPath: string, projectType: string, command: string) => {

        showLoading(win, `Running command '${command}'`)

        try {

            setTimeout(async () => {

                let data = await getFramework(projectType)
                data = await data.runCommand(win, projectPath, command)
                hideLoading(win)

                return data

            }, 600)

        } catch (error) {

            hideLoading(win)
            showError(win, error.message)

        }

    },
    "RUN_COMMAND": async (event: IpcMainInvokeEvent, win: BrowserWindow, projectType: string, projectPath: string, command: string, data: []) => {

        try {
    
            const d = await getFramework(projectType)
            return await d.runFullCommand(win, projectPath, command, data)

        } catch (error) {

            showError(win, error.message)

        }

    }
}