<script lang="ts" setup>
import {ipcRenderer} from "electron"
import {Project} from "@/types"
import {PropType, h, ref, onMounted} from "vue"
import {ElMessageBox} from 'element-plus'
import CreateScriptDialog from '@/src/components/Dialogs/CreateScriptDialog.vue'

const scripts = ref([])

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
          ? await ipcRenderer.invoke('CREATE_SCRIPT', props.project.id, ...data.value) 
          : null
    }).catch(() => {})

}

onMounted(async () => {

  scripts.value = await ipcRenderer.invoke('DB_FIND_ALL', 'scripts', `WHERE project_id = ${props.project.id}`)

})
</script>

<template>
  <div class="script">
    <el-button @click="showCreateScriptDialog">Create Script</el-button>
    <div v-for="script in scripts" :key="script">
      {{ script.name }}
    </div>
  </div>
</template>