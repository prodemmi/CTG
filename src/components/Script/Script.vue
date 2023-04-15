<script lang="ts" setup>
import {ipcRenderer} from "electron"
import {Project} from "@/types"
import {PropType, h, ref, onMounted} from "vue"
import {ElMessageBox} from 'element-plus'
import CreateScriptDialog from '@/src/components/Dialogs/CreateScriptDialog.vue'
import ScriptItem from '@/src/components/Script/ScriptItem.vue'

const scripts = ref([])
const loading = ref(false)

const props = defineProps({
  project: {
    type: Object as PropType<Project>,
    required: true,
  },
})

const showCreateScriptDialog = () => {

      const data = ref({})
  
      ElMessageBox({
        title: 'Create Script',
        confirmButtonText: 'Create',
        showCancelButton: true,
        showClose: false,
        center: false,
        closeOnClickModal: false,
        message: () => h(CreateScriptDialog, {onGetData: (d: []) => data.value = d}),
        callback: async (action, message) => action === 'confirm' 
          ? await ipcRenderer.invoke('CREATE_SCRIPT', props.project.id, data.value.name, data.value.description, data.value.command) 
          : null
    }).catch(() => {})

}

const updateScripts = async () => {
  loading.value = true
  scripts.value = await ipcRenderer.invoke('DB_FIND_ALL', 'scripts', `WHERE project_id = ${props.project.id}`)
  loading.value = false
}

onMounted(async () => {
  await updateScripts()
  ipcRenderer.on('UPDATE_SCRIPTS', async (event) => await updateScripts())
})
</script>

<template>
  <div v-loading="loading" class="script">
    <el-button class="my-2" @click="showCreateScriptDialog">Create Script</el-button>
    <div v-for="script in scripts" :key="script">
      <ScriptItem :path="project.path" :script="script"/>
    </div>
  </div>
</template>