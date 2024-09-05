import React, { useEffect } from 'react';
import { BackHandler, Image, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import AppButton from '../components/AppButton';
import Screen from '../components/Screen';
import colors from '../config/colors';
import AppText from '../components/AppText';


function WelcomeScreen() {
    const navigation = useNavigation();

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => backHandler.remove()
      }, [])
    
    return (
        <Screen style={styles.container}>
            <View style={styles.logoContainer}>
                <Image style={styles.logoImage} source={require('../assets/PickFast.png')}/>
                <AppText style={styles.logoText}>Welcome to PickFast!</AppText>
            </View>
            <View style={styles.buttonsContainer}>
                <AppButton title='Login' style={styles.button} color={colors.green} textColor={colors.black} onPress={() => navigation.navigate('Login')} />
                <AppButton title='Register' style={styles.button} onPress={() => navigation.navigate('Register')} />
            </View>
        </Screen> 
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '5%'
    },
    button: {
        marginVertical: '3%'
    },
    buttonsContainer: {
        width: '100%',
        paddingBottom: '30%'
    },
    logoContainer: {
        position: 'absolute',
        alignItems: 'center',
        top: '8%',
    },
    logoImage: {
        width: '80%',
        height: undefined,
        aspectRatio: 1,
    },
    logoText: {
        textAlign: 'center',
        fontSize: 40,
        fontWeight: '700'
    }
})



export default WelcomeScreen;