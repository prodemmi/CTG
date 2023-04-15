<script lang="ts" setup>
import {Script} from "@/types"
import { ipcRenderer } from "electron"
import { ElMessageBox } from "element-plus"
import _ from "lodash"
import {computed, PropType, reactive, ref} from "vue"
import {getScriptArguments, getScriptOptions} from "@/utils/command"

const running = ref<Boolean>(false)
const args = reactive([])
const options = reactive([])

const props = defineProps({
  path: {
    type: String,
    required: true,
  },
  script: {
    type: Object as PropType<Script>,
    required: true,
  },
})

const getArguments = computed(() => getScriptArguments(props.script.command))

const getOptions = computed(() => getScriptOptions(props.script.command))

const run = async () => {
  running.value = true
  try {
    await ipcRenderer.invoke('RUN_SCRIPT', props.path, props.script.command, Object.assign({}, args),  Object.assign({}, options))
  } catch (error) {}
  running.value = false
}

const deleteScript = async () => {

  ElMessageBox.confirm(
      `Script '${props.script.name}' will permanently delete. Continue ?`,
      'Warning',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
  ).then(async () => await ipcRenderer.invoke('DELETE_SCRIPT', props.script.id))

}

</script>

<template>
  <div class="script-item">
    <el-collapse>
      <el-collapse-item :title="script.name">
        <div class="script-item-command">Command: <b>{{ script.command }}</b></div>
        
        <div class="script-item-description">Description: {{ script.description }}</div>
        <div class="my-2">
          <b v-if="!_.isEmpty(getArguments)">Arguments</b>
          <div class="m-2">
            <div v-for="arg in getArguments" :key="arg.name" class="my-2">
              <span>{{ arg.name }}</span>
              <el-input v-model="args[arg.name]"/>
            </div>
          </div>

          <b v-if="!_.isEmpty(getOptions)">Options</b>
          <div class="m-2">
            <div v-for="option in getOptions" :key="option.name" class="my-2">
              <span class="mx-2">{{ option.name }}</span>
              <el-checkbox v-if="option.type === 'boolean'" v-model="options[option.name]"/>
              <el-input v-else v-model="options[option.name]"/>
            </div>
          </div>

        </div>
        <div class="script-item-button">
          <el-button @click="deleteScript" type="danger">Delete</el-button>
          <el-button @click="run" :loading="running" type="primary">Run</el-button>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>