import { app, BrowserWindow, shell, ipcMain, Menu, globalShortcut, MenuItem, MenuItemConstructorOptions, IpcMainInvokeEvent, } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'
import DB from "../db"
import _ from 'lodash'
import ipc_mains from "../ipc-main"
import menuTemplate from "../menu"

process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
    ? join(process.env.DIST_ELECTRON, '../public')
    : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {
    win = new BrowserWindow({
        title: 'CLI To GUI',
        icon: join(process.env.PUBLIC, 'app-icon.png'),
        width: 900,
        height: 650,
        minWidth: 840,
        minHeight: 600,
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: false,
        },
    })

    globalShortcut.register('f5', function () {
        win.reload()
    })

    globalShortcut.register('f6', function () {
        win.webContents.openDevTools()
    })

    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(url)
        win.webContents.openDevTools()
    } else {
        win.loadFile(indexHtml)
    }

    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:')) shell.openExternal(url)
        return { action: 'deny' }
    })

}

function createMenu() {

    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)

}

app.whenReady().then(() => {

    DB.open()
    createWindow()
    createMenu()

})

app.on('window-all-closed', () => {
    win = null
    DB.close()
    if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
    if (win) {
        // Focus on the main window if the user tried to open another
        if (win.isMinimized()) win.restore()
        win.focus()
    }
})

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        createWindow()
    }
})

ipcMain.handle('open-win', (_, arg) => {
    const childWindow = new BrowserWindow({
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: false,
        },
    })

    if (process.env.VITE_DEV_SERVER_URL) {
        childWindow.loadURL(`${url}#${arg}`)
    } else {
        childWindow.loadFile(indexHtml, { hash: arg })
    }
})

for (const method in ipc_mains) {

    ipcMain.handle(method, (event: IpcMainInvokeEvent, ...args) => {

        const win = BrowserWindow.fromWebContents(event.sender)

        return ipc_mains[method].call(this, event, win, ...args)

    })

}