const { Platform } = require("react-native")
const { default: colors } = require("./colors")

export default {
    colors,
    text: {
        fontSize: 18,
        fontFamily: Platform.OS === "android" ? "Roboto" : "Averia",
        color: colors.dark
    }
}

