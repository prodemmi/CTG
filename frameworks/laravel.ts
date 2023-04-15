import _ from 'lodash'
import fs from 'node:fs'
import { join } from 'node:path'
import { nestedKeyExists, run } from "./utils"
import { BrowserWindow } from 'electron'
import { exec, execSync } from 'child_process'
import { Framework } from "../types"
import { reformatCommand } from "../utils/command"

const exclude_commands = ['tinker', 'help']
const pined_commands = ['serve', 'migrate', 'optimize', 'test', 'up', 'down']
const useless_commands = ['--help', '--quiet', '--verbose', '--version', '--ansi', '--no-ansi', '--no-interaction', '--env']

const get_options = (options: []) => _.orderBy(_.filter(_.values(options), (option) => !useless_commands.includes(option.name)), 'is_required')

const get_arguments = (args: []) => _.orderBy(_.values(args), ['is_value_required'])

const php_artisan_exists = (path: string) => {

    const php_artisan_path = join(path, 'artisan')

    const file_exists = fs.existsSync(php_artisan_path)

    // if (file_exists) {

    //     try {

    //         const output = execSync(`php artisan`, { cwd: path })

    //         return _.includes(output.toString(), 'Laravel Framework')

    //     } catch (err) {}

    // }

    return file_exists

}

const composer_json_exists = (path: string) => {

    const composer_json_path = join(path, 'composer.json')

    const file_exists = fs.existsSync(composer_json_path)

    if (file_exists) {

        try {
            const composer_data = _.toArray(require(composer_json_path))
            return nestedKeyExists(composer_data, ['php', 'laravel/framework'])

        } catch (err) { }

    }

    return false

}

const detection = (path: string) => composer_json_exists(path) && php_artisan_exists(path)

const getVersion = (path: string) => {
    const output = execSync(`php artisan --version`, { cwd: path })
    return _.trim(output.toString().replace('Laravel Framework', ''))
}

const getCliData = async (path: string) => {

    const data = (await run(`cd ${path};php artisan --raw`)) as string
    let reformated = data.split('\n').map((d) => _.trim(d).split('  '))

    reformated = reformated.map((d) => {

        const splited = d[0].split(':')

        return { group: splited.length === 1 ? '' : splited[0], command: _.trim(d[0]), help: _.trim(d[d.length - 1]) }

    })

    reformated.pop()
    reformated = _.filter(reformated, r => !exclude_commands.includes(r.command))

    const last = reformated.length

    return _.sortBy(reformated, function (item) {
        return pined_commands.indexOf(item.command) !== -1 ? pined_commands.indexOf(item.command) : last
    })

}

const runFullCommand = (win, path: string, command: string, data: []) => {

    const commandText = reformatCommand(path, 'php artisan', command, data)

    win.webContents.send("OUTPUT", '', commandText.split(';')[1])

    const process = exec(commandText)

    process.stdout.on('data', (data) => {
        win.webContents.send('UPDATE_OUTPUT', { error: false, output: data.toString() })
    })

    process.stderr.on('data', (data) => {

        win.webContents.send('UPDATE_OUTPUT', { error: true, output: data.toString() })
    })

    process.on('exit', (code) => { })

}

const runCommand = (win, path: string, command: string) => {

    const output = execSync(`cd ${path};php artisan ${command} --help --format=json`)

    const to_json = JSON.parse(output.toString())
    const args = get_arguments(_.get(to_json, 'definition.arguments', []))
    const options = get_options(_.get(to_json, 'definition.options', []))

    if (!_.isEmpty(args) || !_.isEmpty(options))
        win.webContents.send('COMMAND_DIALOG', 'laravel', path, command, args, options)
    else 
        win.webContents.send('RUN_MAIN_COMMAND', 'laravel', path, command, [])
        
}

const addTabs = (win: BrowserWindow) => {
    win.webContents.send('ADD_TAB', 'Tinker', "Laravel/Tinker.vue")
    win.webContents.send('ADD_TAB', 'Migrations', "Laravel/Migrations.vue")
}

const framework: typeof Framework = {
    name: 'laravel',
    label: 'Laravel',
    icon: 'laravel.svg',
    requirements: ['php', 'composer'],
    detection: (path: string) => detection(path),
    getVersion: (path: string) => getVersion(path),
    getCliData: async (path: string) => await getCliData(path),
    runCommand: (win: BrowserWindow, path: string, cmd: string) => runCommand(win, path, cmd),
    runFullCommand: (win: BrowserWindow, path: string, command: string, data: []) => runFullCommand(win, path, command, data),
    addTabs: (win: BrowserWindow) => addTabs(win),
}

export default framework