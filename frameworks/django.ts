import _ from 'lodash'
import fs from 'node:fs'
import { join } from 'node:path'
import { nestedKeyExists, run } from "./utils"
import { BrowserWindow } from 'electron'
import { exec, execSync } from 'child_process'
import { Framework } from "../types"
import { reformatCommand } from "../utils/command"

const manage_exists = (path: string) => {
    const manage_path = join(path, 'manage.py')
    const file_exists = fs.existsSync(manage_path)

    return file_exists
}

const detection = (path: string) => manage_exists(path)

const getVersion = (path: string) => execSync(`python manage.py --version`, { cwd: path })

const getCliData = async (path: string) => {

}

const runFullCommand = (win: BrowserWindow, path: string, command: string, data: []) => {
}

const runCommand = (win: BrowserWindow, path: string, command: string) => {
}

const addTabs = (win: BrowserWindow) => {
}

const framework: typeof Framework = {
    name: 'django',
    label: 'Django',
    icon: 'django.svg',
    requirements: ['python', 'python-pip'],
    detection: (path: string) => detection(path),
    getVersion: (path: string) => getVersion(path),
    getCliData: async (path: string) => await getCliData(path),
    runCommand: (win: BrowserWindow, path: string, cmd: string) => runCommand(win, path, cmd),
    runFullCommand: (win: BrowserWindow, path: string, command: string, data: []) => runFullCommand(win, path, command, data),
    addTabs: (win: BrowserWindow) => addTabs(win),
}

export default framework