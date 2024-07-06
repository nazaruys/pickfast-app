import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import {MaterialIcons} from '@expo/vector-icons'

import AppText from './AppText';

function DropDownList({title, isOpen, setIsOpen, style}) {
    const handlePress = () => {
        setIsOpen(!isOpen)
    }
    return (
        <TouchableWithoutFeedback onPress={handlePress}>
            <View style={[styles.container, style]}>
                <AppText style={styles.title}>{title}</AppText>
                {isOpen ? 
                    <MaterialIcons style={styles.icon} name="keyboard-arrow-down" size={30} color="black" /> 
                : <MaterialIcons style={styles.icon} name="keyboard-arrow-right" size={30} color="black" />
                }
            </View>
        </TouchableWithoutFeedback>
        
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
    },
    title: {
        fontWeight: '700',
        flex: 1,
    },
    icon: {
        marginRight: -7
    }
})

export default DropDownList;