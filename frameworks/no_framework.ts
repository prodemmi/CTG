import Framework from '../types/framework'

const framework: Framework ={
    name: 'none',
    label: 'none',
    icon: null,
    requirements: [],
    detection: (path: string) => {},
    getVersion: (path: string) => '',
    getCliData: (path: string) => {},
    runCommand: (path: string) => {},
    runFullCommand: (path: string) => {}
}

export default framework


