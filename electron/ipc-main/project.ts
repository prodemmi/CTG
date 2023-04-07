import { BrowserWindow, IpcMainInvokeEvent } from "electron"
import DB from "../db"
import { hideLoading, showLoading, showToast, updateProjects, detectProjectType, detectProjectVersion } from "./utils"
import { basename } from "path"
import _ from "lodash"

export default {
    "ADD_PROJECT": async (event: IpcMainInvokeEvent, win: BrowserWindow,  prjectName: string | null, projectPath: string, FolderName?: string) => {

        showLoading(win, "Adding project")

        try {

            prjectName = prjectName ?? basename(projectPath)
            showLoading(win, "Detecting project type")
            const projectType = await detectProjectType(projectPath)
            const projectVersion = await detectProjectVersion(projectType, projectPath)
            DB.addProject(prjectName, projectPath, projectVersion, projectType, FolderName)
            updateProjects(win)
            hideLoading(win)
            showToast(win, `Project '${prjectName}' added`)

            return true

        } catch (error) {
            
            win.webContents.send("ERROR", error)
            hideLoading(win)

        }

    },
    "DELETE_PROJECT": (event: IpcMainInvokeEvent, win: BrowserWindow,  projectId: Number) => {

        DB.deleteProject(projectId)
        updateProjects(win)
        showToast(win, `Project successfuly deleted`)

    },
    "GET_SIDEBAR_ITEMS": (event: IpcMainInvokeEvent, win: BrowserWindow) => DB.findAll('projects'),
}