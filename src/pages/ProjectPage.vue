<script lang="ts" setup>
import CLI from "@/src/components/CLI/CLI.vue"
import Script from "@/src/components/Script/Script.vue"
import About from "@/src/components/About/About.vue"
import {TabsPaneContext} from "element-plus";
import {onMounted, reactive, ref, computed, defineAsyncComponent, h} from "vue";
import {useAppStore} from "@/src/store/app"
import {ipcRenderer} from "electron";
import {Project} from "@/types";
import _ from "lodash";

const store = useAppStore()
const activeName = ref('1')
const project = ref({} as Project)
const tabs = reactive([] as any[])

const handleClick = (tab: TabsPaneContext, event: Event) => {}
const updateProjects = async () => project.value = await ipcRenderer.invoke('DB_FIND_ONE', 'projects', await store.getActiveProject)

onMounted(async () => {
  await updateProjects()
  // ipcRenderer.on('ADD_TAB', async (event, tabName: string, component: string) => {
  //   const importedComponent = computed(() => defineAsyncComponent(() => import(`../components/Frameworks/${component}`)))
  //   tabs.push({
  //     tabName,
  //     component: importedComponent
  //   })
  // })
})
</script>

<template>
  <div v-if="!_.isEmpty(project)" class="project-page">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="CLI" name="0">
        <CLI :project="project"/>
      </el-tab-pane>
      <el-tab-pane label="Scripts" name="1">
        <Script :project="project"/>
      </el-tab-pane>
      // <el-tab-pane v-for="(tab, index) in tabs" :label="tab.tabName" :key="index" :name="index + 2">
      //   <component :is="tab.component" :project="project"/>
      // </el-tab-pane>
      <el-tab-pane label="About" :name="tabs.length + 3">
        <About :project="project"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>