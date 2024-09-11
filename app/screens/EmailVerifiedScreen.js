import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Screen from '../components/Screen';
import colors from '../config/colors';
import AppButton from '../components/AppButton';
import AppText from '../components/AppText';

function EmailVerifiedScreen(props) {
    const navigation = useNavigation();

    return (
        <Screen style={styles.screen}>
            <Image style={styles.image} source={require('../assets/open-email.png')}/>
            <AppText style={styles.title}>Email successfully verified!</AppText>
            <AppButton title='Home' onPress={() => navigation.navigate('Home')} />
        </Screen>
    );
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingHorizontal: '5%'
    },
    image: {
        width: 200,
        height: 200
    },
    title: {
        fontSize: 30,
        fontWeight: '700',
        textAlign: 'center'
    }
})

export default EmailVerifiedScreen;