type Framework = {
    name: String
    label: String
    icon: String
    requirements: String[]
    detection: Function
    getVersion: Function
    getCliData: Function
    runCommand: Function
    runFullCommand: Function
    addTabs: Function
}

export default Framework