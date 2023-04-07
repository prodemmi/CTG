<script lang="ts" setup>
import {ipcRenderer} from "electron"
import {computed, onMounted, PropType, ref} from "vue"
import {Project} from "@/types"
import {useAppStore} from "@/src/store/app"
import CLIItem from "@/src/components/CLI/CLIItem.vue"
import CLIGeneraItem from "@/src/components/CLI/CLIGeneraItem.vue"
import _ from "lodash"
import {Search} from '@element-plus/icons-vue'

const store = useAppStore()
const data = ref([])
const search = ref(null)
const cliLoading = ref(false)
const initialData = ref([])

const props = defineProps({
  project: {
    type: Object as PropType<Project>,
    required: true,
  },
})
const getCLIData = async () => await ipcRenderer.invoke("GET_CLI_DATA", props.project?.type, props.project?.path)
const doSearch = () => store.setCliSearch(search.value)
const getGroupName = (commands: []) => _.upperFirst(_.get(commands, '0.group'))

const getWithoutGroup = computed(() => _.filter(data.value, ({group}) => group === ''))
const getWithGroup = computed(() => _.groupBy(_.filter(data.value, ({group}) => group !== ''), 'group'))

onMounted(async () => {

  ipcRenderer.on('SHOW_CLI_LOADING', async (event, message) => cliLoading.value = message)
  ipcRenderer.on('HIDE_CLI_LOADING', async (event) => cliLoading.value = false)

  data.value = await getCLIData()
  initialData.value = data.value

  store.$subscribe(async (mutation, state) => {
    console.log(mutation);

    const key = mutation.events.key
    const search = _.lowerCase(state.search)

    if (search === "" || search === null) {

      data.value = initialData.value
      return

    }

    if (key === "search") {

      data.value = _.filter(initialData.value, ({group, command, help}) => {

        return _.includes(_.lowerCase(group), search) ||
            _.includes(_.lowerCase(command), search) ||
            _.includes(_.lowerCase(help), search)

      })

    }

  })

})

</script>

<template>
  <div class="cli" v-loading="cliLoading" :element-loading-text="cliLoading">
    <div class="cli-search">
      <el-input v-model="search"
                :prefix-icon="Search"
                class="search-bar"
                placeholder="Search Command"
                @input="doSearch"/>
    </div>
    <div v-if="store.getCliSearch === null || store.getCliSearch === ''">
      <h2 v-show="data && data.length">General Commands</h2>
      <div class="general-wrapper">
        <CLIGeneraItem v-for="(commands, group) in getWithoutGroup"
                       :key="group"
                       :cmd="commands"
                       :project="project"
                       class="flex-between" style="text-align: left"/>
      </div>
      <h2 v-show="data && data.length">Other Commands</h2>
      <el-collapse>
        <el-collapse-item v-for="(commands, group) in getWithGroup"
                          :key="group"
                          :name="group"
                          :title="getGroupName(commands)">
          <CLIItem v-for="cmd in commands"
                   :key="cmd"
                   :cmd="cmd"
                   :project="project"
                   class="flex-between"
                   style="text-align: left"/>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div v-else>
      <CLIItem v-for="command in data"
               :key="cmd"
               :cmd="command"
               :project="project"
               class="flex-between"
               style="text-align: left"/>
    </div>
  </div>
</template>