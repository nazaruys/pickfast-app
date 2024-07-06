import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import colors from '../config/colors';
import getCheckboxBorder from '../functions/getCheckboxBorder';

function Checkbox({ priority, size = 25, isBought, setIsBought, style, onPress }) {
    
    const [borderWidth, borderColor] = getCheckboxBorder(priority, size)
    
    const handlePress = async () => {
        setIsBought(!isBought)
        onPress();
    }
    return (
        <View style={style}>
            <TouchableWithoutFeedback onPress={handlePress}>
                {isBought ? (
                    <MaterialCommunityIcons 
                        style={styles.icon} 
                        name="checkbox-marked" size={size * 1.2} 
                        color={colors.grey} 
                    />
                ) : (
                    <View style={{
                        borderColor: borderColor,
                        borderRadius: size / 5,
                        borderWidth: borderWidth,
                        width: size,
                        height: size,
                    }} />
                )}
            </TouchableWithoutFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    icon: {
        margin: -2,
    }
})

export default Checkbox;