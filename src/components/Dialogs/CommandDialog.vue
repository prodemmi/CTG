<script lang="ts" setup>
import {reactive} from "vue";

const argumentsValues = reactive({})
const optionsValues = reactive({})
const props = defineProps({
  arguments: {
    type: [],
    default: [],
    required: true
  },
  options: {
    type: [],
    default: [],
    required: true
  }
})
const emit = defineEmits(['get-data'])
const onChange = () => emit('get-data', {arguments: argumentsValues, options: optionsValues})
</script>

<template>

  <div class="command-dialog">
    <el-col>

      <el-col v-for="argument in arguments" :key="argument" class="wrapper">

        <el-col>
          <el-row class="item">
            <div>
              <b>
                <span>{{ argument.name }} </span>
                <span v-if="argument.is_value_required" class="required">*</span>
              </b>
            </div>
            <el-input
                class="my-2"
                v-model="argumentsValues[argument.name]"
                :value="argument.default"
                @input="onChange"/>
          </el-row>

          <span>{{ argument.description }}</span>
        </el-col>

      </el-col>

      <el-col v-for="option in options" :key="option" class="wrapper">

        <el-col>
          <el-row class="align-center">
            <el-checkbox
                v-if="!(option.accept_value || option.is_multiple)"
                v-model="optionsValues[option.name]"
                :value="option.default"
                @change="onChange"/>
            <div class="align-center mx-2">
                <div style="min-width: 64px;">
                  <b>
                    <span v-if="option.shortcut">{{ option.shortcut }} | </span>
                    <span>{{ option.name }}</span>
                  </b>
                  <span v-if="option.is_value_required" class="required">*</span>
                </div>
            </div>

          </el-row>

          <el-input
              v-if="option.accept_value || option.is_multiple"
              class="my-2"
              v-model="optionsValues[option.name]"
              :value="option.default"
              @input="onChange"/>

          <div>{{ option.description }}</div>

        </el-col>

      </el-col>

    </el-col>
  </div>

</template>