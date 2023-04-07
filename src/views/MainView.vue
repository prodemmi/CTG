<script lang="ts" setup>
import {ipcRenderer} from "electron"
import {onMounted, ref} from "vue"
import Sidebar from "@/src/components/Sidebar/Sidebar.vue"
import WelcomePage from "@/src/pages/WelcomePage.vue"
import ProjectPage from "@/src/pages/ProjectPage.vue"
import {useAppStore} from "@/src/store/app"
import {Project} from "@/types"
import _ from "lodash"

const store = useAppStore()
const listProjects = ref([] as Project[])
const showLoading = ref(false)

const updateSidebarItems = async () => listProjects.value = await ipcRenderer.invoke('GET_SIDEBAR_ITEMS')

onMounted(async () => {

  updateSidebarItems()

  ipcRenderer.on('UPDATE_PROJECTS', async (event) => updateSidebarItems())

  ipcRenderer.on('SHOW_LOADING', async (event, message) => showLoading.value = message)

  ipcRenderer.on('HIDE_LOADING', async (event) => showLoading.value = false)

})

</script>

<template>
  <div v-loading="showLoading" :element-loading-text="showLoading" class="main-view">
    <Sidebar :projects="listProjects"/>
    <component :is="_.isNull(store.getActiveProject) ? WelcomePage : ProjectPage" :key="store.getActiveProject"/>
  </div>
</template>