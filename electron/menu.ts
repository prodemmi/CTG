import { BrowserWindow, Menu, MenuItem, MenuItemConstructorOptions } from "electron"

const menuTemplate: Array<(MenuItemConstructorOptions) | (MenuItem)> = [
    {
        label: "File",
        submenu: [
            {
                label: 'Add Exist Project',
                click: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => browserWindow.webContents?.send("ADD_EXIST_PROJECT")
            },
            {
                label: 'Create New Project'
            },
            {
                label: 'Clone Project'
            },
            {
                type: 'separator'
            },
            {
                label: 'Quit',
                click: (menuItem: MenuItem, browserWindow: BrowserWindow, event: KeyboardEvent) => browserWindow.close()
            }
        ]
    }
]

export default menuTemplate