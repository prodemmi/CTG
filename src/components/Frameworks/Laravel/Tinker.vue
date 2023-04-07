<template>
  Tinker
</template>

<script lang="ts" setup>
import {Project} from "@/types"
import {PropType} from "vue";
const props = defineProps({
  project: {
    type: Object as PropType<Project>,
    required: true,
  },
})
</script>