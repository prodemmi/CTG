<script lang="ts" setup>
import {ElMessageBox} from "element-plus"
import {onMounted, ref} from "vue"
import {useAppStore} from "@/src/store/app"
import {icon} from "@/utils/icon"
import {frameworks} from "@/frameworks"
import _ from "lodash"
import {ipcRenderer} from "electron"

const store = useAppStore()

const itemIcon = ref<string | null>('')
const showingMenu = ref<boolean>(false)
const showButtons = ref(false)

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
})
const deleteProject = () => {

  ElMessageBox.confirm(
      `Project '${props.project.name}' will permanently delete. Continue ?`,
      'Warning',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
  ).then(() => store.deleteProject(props.project.id))

}

const openInExplorer = () => ipcRenderer.invoke('OPEN_IN_EXPLORER', props.project.path)
const openInTerminal = () => ipcRenderer.invoke('OPEN_IN_TERMINAL', props.project.path)

onMounted(() => {

  itemIcon.value = _.find(frameworks, {name: props.project.type})?.icon

})

</script>

<template>
  <div @mouseleave="showingMenu ? null : showButtons = false" @mouseover="showButtons = true">

    <el-menu-item
        :key="props.project.id"
        :index="props.project.id"
        class="sidebar-item"
        small>

      <div class="flex-between">

        <div style="width: 100%;z-index: 0;" @click="store.setActiveProject(props.project.id)">
          <img v-if="itemIcon" :src="'src/assets/icons/frameworks/' + itemIcon" alt="" width="32">
          <span class="name">{{ props.project.name }}</span>
        </div>

        <div v-if="showButtons" style="z-index: 1;display: flex">

          <el-popover
              :width="200"
              placement="right"
              trigger="click"
              @click="showingMenu = false"
              @before-enter="showingMenu = true"
              @before-leave="showingMenu = false">
            <template #reference>
              <span
                  class="icon-button"
                  v-html="icon('more', { color: 'white' })"
              ></span>
            </template>

            <el-menu-item index="0" small @click="openInExplorer">Open In Explorer</el-menu-item>
            <el-menu-item index="1" small @click="openInTerminal">Open In Terminal</el-menu-item>

          </el-popover>

          <span
              class="icon-button"
              @click="deleteProject"
              v-html="icon('close', { color: 'white' })">
          </span>

        </div>

      </div>

    </el-menu-item>

  </div>
</template>