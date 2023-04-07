<template>

  <div class="about">
    <p><span class="about-item">Name</span> <b>{{ project.name }}</b></p>
    <p><span class="about-item">Path</span> <b>{{ project.path }}</b></p>
    <p><span class="about-item">Framework</span> <b>{{ project.type }}</b></p>
    <p><span class="about-item">Version</span> <b>{{ project.version }}</b></p>
  </div>

</template>

<script lang="ts" setup>
import {PropType} from "vue";
import {Project} from "@/types";

const props = defineProps({
  project: {
    type: Object as PropType<Project>,
    required: true
  }
})

</script>