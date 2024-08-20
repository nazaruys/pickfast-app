import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';

import colors from '../config/colors';import AppText from './AppText';

function UserCard({ user, onPressDeleteIcon, onPressAdminIcon, iconShown, blocked, style }) {
    return (
        <View style={[styles.container, style, {opacity: blocked ? 0.5 : 1}]}>
            <AppText
                style={styles.name}
                numberOfLines={1}
                >
                {user.name}
            </AppText>
            {!blocked && user.admin_of && <AppText
                style={styles.subTitle}>
                Admin
            </AppText>}
            {!blocked && iconShown && 
                <TouchableOpacity onPress={onPressAdminIcon}>
                    <MaterialCommunityIcons 
                        style={styles.icon}
                        name='crown' 
                        size={24} 
                        color="black" 
                    />
                </TouchableOpacity>
            }
            {iconShown && 
                <TouchableOpacity onPress={onPressDeleteIcon}>
                    <MaterialCommunityIcons 
                        style={styles.icon}
                        name='close' 
                        size={24} 
                        color="black" 
                    />
                </TouchableOpacity>
            }
        </View>
        
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 17,
        marginVertical: 10,
        backgroundColor: colors.white,
        borderColor: colors.grey,
        borderWidth: 0.4,
        borderRadius: 1,
        elevation: 3,
    },
    name: {
        flex: 1
    },
    subTitle: {
        color: colors.tiffany,
        fontSize: 16,
        marginLeft: 25,
    },
    icon: {
        marginLeft: 15
    }
})

export default UserCard;