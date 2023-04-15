import { ipcRenderer } from 'electron';
import { Project } from '@/types'
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import _ from "lodash";

export const useAppStore = defineStore('app', () => {

    const projects = ref<Project[]>([])
    const activeProject = ref<Number | null>(null)
    const cliSearch = ref<Number | string | null>(null)

    const getProjects = computed(() => projects.value)
    const getActiveProject = computed(() => {
        checkHaveSidebarItems()
        return activeProject.value
    })
    const checkHaveSidebarItems = (async () => {

        const db_projects = await ipcRenderer.invoke('DB_FIND_ALL', 'projects')

        if (activeProject.value === null) {
            if (!_.isEmpty(db_projects))
                activeProject.value = _.get(db_projects, '0.id', null)
        }

        if (_.isNull(db_projects))
            activeProject.value = null

        return activeProject.value

    })
    const getCliSearch = computed(() => cliSearch.value)
    const setCliSearch = (search: Number | string | null) => cliSearch.value = search
    const setActiveProject = (projectId: Number | null) => activeProject.value = projectId
    const addProject = async (projectPath?: string) => projects.value = await ipcRenderer.invoke("ADD_PROJECT", projectPath) as [] as Project[]
    const deleteProject = async (projectId: Number) => await ipcRenderer.invoke("DELETE_PROJECT", projectId)

    return {
        getProjects,
        getActiveProject,
        getCliSearch,
        setCliSearch,
        setActiveProject,
        addProject,
        deleteProject
    }
})
