<script lang="ts" setup>
import SidebarItem from "./SidebarItem.vue";
import {defineProps, onMounted, PropType, ref} from "vue";
import {useAppStore} from "@/src/store/app"
import {Project} from "@/types";

const store = useAppStore();
const props = defineProps({
  projects: {
    type: [] as PropType<Project[]>,
    required: true
  }
})

const defaultActive = ref(null)

onMounted(async () => {

    defaultActive.value = await store.getActiveProject

})

</script>

<template>
  <div v-if="projects && projects.length" class="project-sidebar">
    <el-menu
        :default-active="defaultActive"
        active-text-color="#ffd04b"
        background-color="#393e46"
        text-color="#fff">
      <SidebarItem
          v-for="project in projects"
          :key="project.id"
          :project="project"
      />
    </el-menu>
  </div>
</template>