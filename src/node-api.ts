import {ipcRenderer} from 'electron'
import {ElMessage, ElMessageBox} from 'element-plus'
import CLIOutput from '@/src/components/CLI/CLIOutput.vue'
import CommandDialog from '@/src/components/Dialogs/CommandDialog.vue'
import AddProjectDialog from '@/src/components/Dialogs/AddProjectDialog.vue'
import {h, ref} from 'vue'
import _ from 'lodash'

ipcRenderer.on('ADD_EXIST_PROJECT', async function (event) {
    const values = ref({});
    ElMessageBox({
        title: 'Add Project',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Add',
        draggable: true,
        showClose: false,
        message: () => h(AddProjectDialog, {
            onChange: (new_values: Object) => {
                values.value = new_values
            }
        }),
        callback: async (action, message) => {

            if (action === 'confirm') {

                try {

                    const directory = _.get(values.value, 'directory')
                    const name = _.get(values.value, 'name')
                    const group = _.get(values.value, 'group')

                    if (directory) {

                        await ipcRenderer.invoke('FILE_EXISTS', directory)
                        await ipcRenderer.invoke('ADD_PROJECT', name, directory, group)
                    }

                } catch (error) {
                }

            }

        }
    })

});
ipcRenderer.on('TOAST', async (event, message: string, type: any = 'success', options: Object = {}) => {
    ElMessage({
        message,
        type,
        ...options
    })
})
ipcRenderer.on('ERROR', async (event, message: string) => {
    ElMessageBox.confirm(message, 'Error', {
            showCancelButton: false,
            showConfirmButton: false,
            type: 'error',
            draggable: true,
        }
    );
})
ipcRenderer.on('OUTPUT', async (event, output: string, command: string) => {
    const out = ref([output])
    ipcRenderer.on('UPDATE_OUTPUT', async (event, output: string) => out.value.push(output))
    ElMessageBox({
        showConfirmButton: false,
        showClose: true,
        draggable: true,
        title: null,
        customClass: 'terminal-message',
        center: true,
        message: () => h(CLIOutput, {readonly: true, command, output: out.value}),
        dangerouslyUseHTMLString: true
    })
})
ipcRenderer.on('COMMAND_DIALOG', async (event, type: string, path: string, command: string, args: [], options: []) => {
    const data = ref([])
    ElMessageBox({
        title: command,
        confirmButtonText: 'Run',
        showCancelButton: true,
        showClose: false,
        center: false,
        closeOnClickModal: false,
        message: () => h(CommandDialog, {arguments: args, options, onGetData: (d: []) => data.value = d}),
        callback: (action, message) => action === 'confirm' ? ipcRenderer.invoke('RUN_COMMAND', type, path, command, JSON.parse(JSON.stringify(data.value))) : null
    }).catch(() => {})
})

ipcRenderer.on('RUN_MAIN_COMMAND', async (event, type: string, path: string, command: string, data: []) => {
    ipcRenderer.invoke('RUN_COMMAND', type, path, command, data)
})