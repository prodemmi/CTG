<script lang="ts" setup>
import {Project} from "@/types"
import {PropType, ref} from "vue"
import {Eleme} from '@element-plus/icons-vue'
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
  },
})

const run = async () => {

  loading.value = true

  try {
    await ipcRenderer.invoke("RUN_CLI_COMMAND", props.project.path, props.project.type, props.cmd.command)
  } catch (error) {
  }

  loading.value = false

}

</script>

<template>
  <div class="cli-item flex-between" style="text-align: left">
    <div style="width: 80%">
      <el-button :loading="loading" :loading-icon="Eleme" style="min-width: 200px" type="primary" @click="run">
        {{ cmd.command }}
      </el-button>
    </div>
    <p style="text-align: left;margin: 12px;width: 100%">{{ cmd.help }}</p>
  </div>
</template>