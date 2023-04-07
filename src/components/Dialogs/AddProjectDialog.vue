<template>

  <div class="add-project-dialog">

    <div class="flex-between">

      <div class="add-project-dialog-label">Name</div>
      <el-input v-model="name" class="add-project-dialog-input"/>

    </div>

    <div class="flex-between">

      <div class="add-project-dialog-label">Directory</div>
      <el-input v-model="directory" class="add-project-dialog-input">
        <template #append>
          <span @click="openBrowser" v-html="icon('folder-open')"></span>
        </template>
      </el-input>

    </div>

    <div class="flex-between">

      <div class="add-project-dialog-label">Group</div>
      <el-input v-model="group" class="add-project-dialog-input"/>

    </div>

  </div>


</template>

<script lang="ts" setup>
import {ipcRenderer} from "electron"
import {defineEmits, onUpdated, ref} from "vue"
import {icon} from '@/utils/icon'

const name = ref<string | null>(null)
const directory = ref<string>('')
const group = ref<string | null>(null)

const emit = defineEmits(['change'])

const openBrowser = async () => {

  const path = await ipcRenderer.invoke('OPEN_SINGLE_FOLDER_DIALOG')

  if (path)
    directory.value = path

}

onUpdated(() => {
  emit('change', {directory: directory.value, name: name.value, group: group.value})
})

</script>