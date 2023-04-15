<template>
  <div v-loading="loading" class="migration">
    <div v-for="(migration, index) in migrations" :key="index" class="migration-row">
      <span>
        {{ migration.name }}
      </span>
      <div>
        <!-- <span class="mx-2">
          {{ migration.batch }}
        </span>
        <span class="mx-2">
          {{ migration.status }}
        </span> -->
        <el-button @click="refresh(migration.name)" type="primary">Refresh</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {Project} from "@/types"
import {PropType, ref, onMounted} from "vue";
import {ipcRenderer} from "electron";

const migrations = ref([])
const loading = ref(false)

const props = defineProps({
  project: {
    type: Object as PropType<Project>,
    required: true,
  },
})

const refresh = (name: string) => ipcRenderer.invoke("REFRESH_MIGRATION", props.project.path, name)

onMounted(async () => {
  loading.value = true
  migrations.value = await ipcRenderer.invoke("LIST_MIGRATIONS", props.project.path)
  loading.value = false
})
</script>