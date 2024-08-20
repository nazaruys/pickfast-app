import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Ripple from 'react-native-material-ripple';

import AppText from './AppText';

function AppHeader({title, onBackPress}) {
    const navigation = useNavigation();

    const handleBackPress = () => {
        onBackPress ? onBackPress() : navigation.goBack()
    }

    return (
        <View style={styles.header}>
            <Ripple onPress={handleBackPress} rippleContainerBorderRadius={5}	>
                <Ionicons name="arrow-back" size={30} color="black" />
            </Ripple>
            <AppText style={[styles.headerTitle]}>{title}</AppText>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '5%',
        height: 40,
    },
    headerTitle: {
        marginLeft: 25,
        fontSize: 26,
        fontWeight: '700',
    }
})

export default AppHeader;