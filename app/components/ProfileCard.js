import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {MaterialIcons} from '@expo/vector-icons'

import colors from '../config/colors';
import AppText from './AppText';

function ProfileCard({ onPress, icon, title, subTitle }) {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.container}>
                <MaterialIcons color={colors.dark} name={icon} size={35} style={styles.icon} />
                <AppText
                style={styles.title}
                numberOfLines={1}
                >{title}</AppText>
                <AppText
                style={styles.subTitle}
                >{subTitle}</AppText>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 25,
        marginVertical: 10,
        backgroundColor: colors.white,
        borderColor: colors.grey,
        borderWidth: 0.4,
        borderRadius: 1,
        elevation: 3,
    },
    title: {
        flex: 1,
        marginVertical: 17,
        marginHorizontal: 25,
    },
    subTitle: {
        color: colors.darkGrey,
    }
})

export default ProfileCard;