export const icon = (name: string, { type = 'line' as string, size = 'lg' as string, color = 'black' as string} = {}) => {

    return `<i style="color: ${color}" class="ri-${name}-${type} ri-${size}"></i>`

}