import React from 'react';
import { StyleSheet, View } from 'react-native';
import {MaterialIcons} from '@expo/vector-icons'
import Ripple from 'react-native-material-ripple';

import colors from '../config/colors';
import AppText from './AppText';

function ProfileCard({ onPress, icon, title, subTitle, style }) {
    return (
        <Ripple rippleOpacity={0.2} style={[styles.rippleContainer, style]} onPress={onPress}>
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
        </Ripple>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 25,
        backgroundColor: colors.white,
        borderColor: colors.grey,
        borderWidth: 0.4,
        borderRadius: 1,
        elevation: 3,
    },
    rippleContainer: {
        marginVertical: 10,
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