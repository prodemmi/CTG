import _ from "lodash"

export const ARGUMENT_REGEX = /\$\{(.*?)\}/g
export const OPTION_REGEX = /\$\((.*?)\)/g

export const getScriptArguments = (command: string) => {
    const ars = []
    const mtch = command.match(ARGUMENT_REGEX) || []

    for (const match of mtch) {
        ars.push({
            name: match.replace('${', '').replace('}', '')
        })
    }

    return ars
}
  
export const getScriptOptions = (command: string) => {
    const options = []
    const mtch = command.match(OPTION_REGEX) || []
    for (const match of mtch) {
        const [name, type] = match.split(':')
        options.push({
            name: name.replace('$(', ''),
            type: type.replace(')', '') || 'boolean'
        })
    }

    return options
}

export const reformatCommand = (path: string, prefix: string, command: string, bindings: [], assigner = ' ') => {

    let optionText = ''

    const args = _.values(bindings.arguments).join(" ")
    const opts = _.map(bindings.options, (value, option) => {

        if (_.isBoolean(value) && value === true)
            optionText += option + ' '
        else if (!_.isBoolean(value))
            optionText += option + assigner + value + ' '

    })

    return `cd ${path};${prefix} ${command} ${args} ${optionText}`

}

export const reformatScriptCommand = (path: string, command: string, bindings: [], assigner = ' ') => {

    let optionText = ''
    const args = _(bindings.arguments).values().join(" ")
    const opts = _.map(bindings.options, (value, option) => {

        if (_.isBoolean(value) && value === true)
            optionText += option + ' '
        else if (!_.isBoolean(value))
            optionText += option + assigner + value + ' '

    })

    command = command.replaceAll(ARGUMENT_REGEX, '')
    command = command.replaceAll(OPTION_REGEX, '')

    return `cd ${path};${command} ${args} ${optionText}`

}