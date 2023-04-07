<script lang="ts" setup>
import {basename} from 'path'
import {computed, onUpdated, ref} from 'vue'

const inputValue = ref('')
const inputRef = ref(null)

const props = defineProps({
  command: {
    type: String,
    required: true
  },
  output: {
    type: Array,
    default: [],
    required: false
  },
  readonly: {
    type: Boolean,
    required: false
  },
  path: {
    type: String,
    default: '',
    required: false
  }
})

const inputWidth = computed(() => `${(inputValue.value.length + 1) / 2}em`)
onUpdated(() => inputRef?.value?.focus())

</script>

<template>

  <div class="cli-output">

    <div class="command">
      <span>
        ➜ {{ basename(path) }}{{ command }} 
      </span>
      <div v-if="!readonly"
           ref="inputRef"
           :style="{ width: inputWidth }"
           class="input"
           contenteditable
           onblur="this.focus()" type="text"></div>
    </div>

    <pre v-for="op in output"
         :key="op"
         :style="{ color: op.error ? 'red' : 'green' }"
         class="output"
         v-html="op.output"/>

  </div>

</template>