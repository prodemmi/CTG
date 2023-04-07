<template>

  <div class="create-script-dialog">

    <div class="flex-between">

      <div class="create-script-label">Name <span class="required">*</span> </div>
      <el-input v-model="name" class="create-script-input"/>

    </div>

    <div class="flex-between">

      <div class="create-script-label">Description</div>
      <el-input v-model="description" type="textarea" class="create-script-input" />

    </div>

    <div class="flex-between">

      <div class="create-script-label">Command <span class="required">*</span> </div>
      <el-input v-model="command" type="textarea" class="create-script-input" />

    </div>

  </div>


</template>

<script lang="ts" setup>
import {defineEmits, onUpdated, ref} from "vue"

const name = ref<string | null>(null)
const description = ref<string>('')
const command = ref<string | null>(null)

const emit = defineEmits(['get-data'])

onUpdated(() => {
  emit('get-data', {name: name.value, description: description.value, command: command.value})
})

</script>