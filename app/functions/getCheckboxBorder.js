import colors from "../config/colors"

export default getCheckBoxBorder = (priority, size) => {
    let borderWidth
    let borderColor
    if (priority === 'L') {
        borderWidth = size / 10
        borderColor = colors.grey
    }
    else if (priority === 'M') {
        borderWidth = size / 8
        borderColor = colors.lightBlue
    }
    else if (priority === 'H') {
        borderWidth = size / 6
        borderColor = colors.primary
    }

    return [borderWidth, borderColor]
}