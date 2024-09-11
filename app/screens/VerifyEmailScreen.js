import React, { useEffect, useState } from 'react';
import Screen from '../components/Screen';
import colors from '../config/colors';
import { BackHandler, Image, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import AppHeader from '../components/AppHeader';
import { useNavigation } from '@react-navigation/native';
import AppText from '../components/AppText';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import AppProgress from '../components/AppProgress';
import { createOkAlert } from '../functions/alerts';
import { fetchResendVerificationEmail, fetchVerifyEmail } from '../functions/apiUsers';
import SmallButton from '../components/SmallButton';

function VerifyEmailScreen({ route }) {
    const navigation = useNavigation()

    const { email } = route.params;

    const [resendClicked, setResendClicked] = useState(false);

    const CELL_COUNT = 6;
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value: code,
        setValue: setCode,
    });

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.goBack();
            return true;
        });
        return () => backHandler.remove();
    }, [navigation]);

    const handleCodeInput = async (input) => {
        setCode(input);
        if (input.length === CELL_COUNT) {
            setLoading(true);
            const response = await fetchVerifyEmail(email, input)
            if (!response) {
                createOkAlert('Invalid verification code.')
            } else {
                navigation.navigate('EmailVerified')
            }
            setCode('')
            setLoading(false);
        }
    }

    const resendEmail = async () => {
        setResendClicked(true)
        const data = await fetchResendVerificationEmail(email)
        if (data && 'error' in data) {
            createOkAlert(data['error'])
            return
        }
    }

    return (
        <Screen style={styles.screen}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.backgroundSecondary} />
            <AppHeader title="Verify your email" />
            <ScrollView contentContainerStyle={styles.body}>
                <View style={styles.titleContainer}>
                    <AppText style={styles.title}>Check your email</AppText>
                    <AppText style={styles.subTitle}>We sent a verification code to{"\n"}{email}</AppText>
                </View>
                <View style={styles.codeContainer}>
                    <Image style={styles.image} source={require('../assets/simple-email.png')}/>
                    <AppText style={styles.codeTitle}>Enter the verification code</AppText>
                    <CodeField
                        ref={ref}
                        {...props}
                        value={code}
                        onChangeText={handleCodeInput}
                        keyboardType="number-pad"
                        cellCount={CELL_COUNT}
                        renderCell={({ index, symbol, isFocused }) => (
                            <AppText
                                key={index}
                                style={[styles.cell, isFocused && styles.focusCell]}
                                onLayout={getCellOnLayoutHandler(index)}>
                                {symbol || (isFocused ? <Cursor /> : null)}
                            </AppText>
                        )}
                    />
                    <View style={styles.resendEmailContainer}>
                        <SmallButton title="Resend email" onPress={resendEmail} icon={false} style={{backgroundColor: resendClicked ? colors.darkGrey : colors.primary}} activeOpacity={resendClicked ? 1 : 0.2} />
                        <AppText style={styles.resentText}>{resendClicked ? 'Email resent' : ''}</AppText>
                    </View>
                    <AppText style={styles.spamReminderText}>*Check the spam folder</AppText>
                </View>
            </ScrollView>
            {loading && (
                <AppProgress loading={loading}/>
            )}
        </Screen>
    );
}

const styles = StyleSheet.create({
    screen: {
        backgroundColor: colors.backgroundSecondary,
    },
    body: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: '5%',
        paddingVertical: '5%'
    },
    image: {
        width: 80,
        height: 80,
        marginVertical: '10%'
    },
    titleContainer: {
        alignItems: 'center',
        marginTop: '10%'
    },
    title: {
        fontWeight: '700',
        fontSize: 30,
        textAlign: 'center',
        marginBottom: 15
    },
    subTitle: {
        fontSize: 14,
        textAlign: 'center',
        color: colors.darkGrey
    },
    codeContainer: {
        alignItems: 'center',
    },
    codeTitle: {
        fontWeight: '700',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 15
    },
    cell: {
        width: '14%',
        height: 70,
        lineHeight: 38,
        fontSize: 24,
        borderWidth: 5,
        borderColor: colors.tiffany,
        borderRadius: 10,
        textAlign: 'center',
        padding: 15,
        marginHorizontal: 5,
    },
    focusCell: {
        borderColor: colors.primary,
    },
    resendEmailContainer: {
        marginTop: '10%',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    spamReminderText: {
        fontSize: 16,
        alignSelf: 'flex-start',
        marginTop: 5,
        color: colors.dark
    },
    resentText: {
        color: colors.darkGrey
    }

})

export default VerifyEmailScreen;