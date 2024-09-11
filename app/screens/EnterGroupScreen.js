import React, { useEffect, useState } from 'react';
import { BackHandler, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

import Screen from '../components/Screen';
import colors from '../config/colors';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import { fetchPatchUserGroupCode } from '../functions/apiUsers';
import { createLogoutAlert, createOkAlert } from '../functions/alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseFetch from '../functions/baseFetch';
import AppProgress from '../components/AppProgress';

function EnterGroupScreen() {
    const navigation = useNavigation();

    const CELL_COUNT = 6;
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value: code,
        setValue: setCode,
    });

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
        return () => backHandler.remove();
    }, []);

    const handleCodeInput = async (input) => {
        setCode(input.toUpperCase());
        if (input.length === CELL_COUNT) {
            setLoading(true);
            const newGroupId = input.toUpperCase();
            const response = await fetchPatchUserGroupCode(newGroupId);
            setLoading(false);

            if (response) {
                setCode('');
                if (response.status === 200) {
                    await AsyncStorage.setItem('groupId', newGroupId);
                    navigation.navigate('Home');
                    return;
                }

                let message;
                if (response.status === 400) {
                    message = 'Group does not exist';
                } else if (response.status === 403) {
                    message = 'You are blocked from this group';
                } else {
                    message = 'Unknown error';
                }
                createOkAlert(message);
            }
        }
    };

    const createGroup = async () => {
        setLoading(true);
        const data = await baseFetch('group/groups/', 'POST', {});
        setLoading(false);

        if (data.code) {
            await AsyncStorage.setItem('groupId', data.code);
            navigation.navigate('Home');
        } else {
            createOkAlert('Failed to create group');
        }
    };

    return (
        <Screen style={styles.container}>
            <TouchableOpacity style={styles.logoutContainer} onPress={createLogoutAlert}>
                <MaterialIcons color={colors.dark} name="logout" size={35} style={styles.icon} />
            </TouchableOpacity>
            <View style={styles.codeContainer}>
                <Image style={styles.logoImage} source={require('../assets/PickFast.png')} />
                <AppText style={styles.title}>Enter the code of your group</AppText>
                <CodeField
                    ref={ref}
                    {...props}
                    value={code}
                    onChangeText={handleCodeInput}
                    keyboardType="ascii-capable"
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
            </View>
            <View style={styles.buttonContainer}>
                <AppText style={styles.buttonText}>Don't have a group?</AppText>
                <AppButton title="Create a new Group" onPress={createGroup} />
            </View>
            {loading && (
                <AppProgress loading={loading}/>
            )}
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: '5%',
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: {
        width: '70%',
        height: undefined,
        aspectRatio: 1,
    },
    codeContainer: {
        bottom: 170,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        alignSelf: 'center',
        marginBottom: 30,
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
        marginHorizontal: 7,
    },
    focusCell: {
        borderColor: colors.primary,
    },
    buttonContainer: {
        width: '100%',
        position: 'absolute',
        top: '80%',
    },
    buttonText: {
        marginLeft: 10,
        fontSize: 20,
        marginBottom: 20,
        color: colors.darkGrey,
    },
    logoutContainer: {
        position: 'absolute',
        top: 0,
        left: '5%',
    },
});

export default EnterGroupScreen;
