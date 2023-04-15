import {exec, execSync} from "child_process"
import { BrowserWindow, IpcMainInvokeEvent } from "electron"
import _ from "lodash"

export default {
    "LIST_MIGRATIONS": async (event: IpcMainInvokeEvent, win: BrowserWindow, path: string) => {

        try {

            const output = execSync('php artisan migrate:status', { cwd: path}) 
            const x = output.toString().split('\n').map(splited => {
                const splited2 = splited.split(' ')

                if(splited2.length === 8)
                    return ({
                        name: splited2[2],
                        batch: splited2[4],
                        status: splited2[5],
                    })
                return null
            })
            
            return _.filter(x)

        } catch(error) {

            win.webContents.send("ERROR", error.message)

        }

    },
    "REFRESH_MIGRATION": async (event: IpcMainInvokeEvent, win: BrowserWindow, path: string, migrationName: string) => {

        try {

            const command = `php artisan migrate:refresh --path=${path}/databases/migrations/${migrationName}.php`

            win.webContents.send("OUTPUT", '', command)
            const process = exec(command, { cwd: path })

            process.stdout.on('data', (data) => {
                win.webContents.send('UPDATE_OUTPUT', { error: false, output: data.toString() })
            })
        
            process.stderr.on('data', (data) => {
        
                win.webContents.send('UPDATE_OUTPUT', { error: true, output: data.toString() })
            })
        
            process.on('exit', (code) => { })

        } catch(error) {

            win.webContents.send("ERROR", error.message)

        }

    },
}