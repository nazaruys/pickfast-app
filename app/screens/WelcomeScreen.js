import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import AppButton from '../components/AppButton';
import Screen from '../components/Screen';
import colors from '../config/colors';
import AppText from '../components/AppText';
import { useNavigation } from '@react-navigation/native';


function WelcomeScreen(props) {
    const navigation = useNavigation();
    return (
        <Screen style={styles.container}>
            <View style={styles.logoContainer}>
                <Image style={styles.logoImage} source={require('../assets/Groceries-Cart.png')}/>
                <AppText style={styles.logoText}>Welcome!</AppText>
            </View>
            <View style={styles.buttonsContainer}>
                <AppButton title='Login' style={styles.button} color={colors.green} textColor={colors.black} />
                <AppButton title='Register' style={styles.button} onPress={() => navigation.navigate('RegisterScreen')} />
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
        marginVertical: 15
    },
    buttonsContainer: {
        width: '100%',
        paddingBottom: '40%'
    },
    logoContainer: {
        position: 'absolute',
        alignItems: 'center',
        top: 100
    },
    logoImage: {
        width: 275,
        height: 275
    },
    logoText: {
        fontSize: 50,
        fontWeight: '700'
    }
})



export default WelcomeScreen;