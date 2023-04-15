import { BrowserWindow } from "electron"
import { frameworks } from "../../frameworks";
import _ from "lodash";
const Store = require('electron-store');
const electronStore = new Store();

export const setStore = (key: string, value: any) => electronStore.set(key, value)
export const getStore = (key: string, defaultValue: any = null) => electronStore.get(key, defaultValue)
export const deleteStore = (key: string) => electronStore.delete(key)
export const hasStore = (key: string) => electronStore.has(key)
export const clearStore = () => electronStore.clear()

export const hideLoading = (win: BrowserWindow) => win.webContents.send("HIDE_LOADING")

export const showLoading = (win: BrowserWindow, message: string) => {

    hideLoading(win)
    win.webContents.send("SHOW_LOADING", message)

}

export const hideCLILoading = (win: BrowserWindow) => win.webContents.send("HIDE_CLI_LOADING")

export const showCLILoading = (win: BrowserWindow, message: string) => {

    hideLoading(win)
    win.webContents.send("SHOW_CLI_LOADING", message)

}

export const showError = (win: BrowserWindow, message: string) => win.webContents.send("ERROR", message)

export const updateProjects = (win: BrowserWindow) => win.webContents.send('UPDATE_PROJECTS')
export const updateScripts = (win: BrowserWindow) => win.webContents.send('UPDATE_SCRIPTS')

export const showToast = (win: BrowserWindow, message: string, type: any = 'success', options: Object = {}) => win.webContents.send("TOAST", message, type, options)

export const showOutput = (win: BrowserWindow, output: string, command: string) => win.webContents.send("OUTPUT", output, command)

export const detectProjectType = async (path: string) => {

    for (const framework of frameworks) {

        if (_.has(framework, 'detection') && await framework.detection(path)) {

            return framework.name

        }

    }

    return 'none'

}

export const detectProjectVersion = async (type: string, path: string) => {


    for (const framework of frameworks) {

        const has_get_version = _.has(framework, 'getVersion')
        const framework_type = _.has(framework, 'name') && _.get(framework, 'name')

        if (has_get_version && framework_type === type) {

            return await framework.getVersion(path)

        }

    }

    return ''

}