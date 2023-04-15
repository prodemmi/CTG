<script lang="ts" setup>
import Project from "@/types/project"
import {PropType, ref} from "vue"
import {Eleme} from '@element-plus/icons-vue'
import {icon} from '@/utils/icon'
import {ipcRenderer} from "electron";

const loading = ref(false)

const props = defineProps({
  project: {
    type: Object as PropType<Project>,
    required: true,
  },
  cmd: {
    type: Object,
    required: true,
  }
})
const run = async () => {

  loading.value = true

  try {
    await ipcRenderer.invoke("RUN_CLI_COMMAND", props.project.path, props.project.type, props.cmd.command)
  } catch (error) {}

  loading.value = false

}

</script>

<template>

  <div class="cli-general-item">
    <el-button :loading="loading" :loading-icon="Eleme" class="flex-center" style="margin: 4px;width: 100%;" type="primary"
               @click="run">
      <span style="margin-right: 6px;min-width: 120px;">{{ cmd.command }}</span>
      <el-popover
          :content="cmd.help"
          placement="top-start"
          trigger="hover"
          width="fix-content">
        <template #reference>
          <span v-html="icon('question', { color: 'white' })"></span>
        </template>
      </el-popover>
    </el-button>
  </div>

</template>