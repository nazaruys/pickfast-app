import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';

import AppText from './AppText';
import colors from '../config/colors';

function ScreenHeader({title}) {
    return (
        <View style={styles.header}>
            <AppText style={styles.headerText}>{title}</AppText>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
      backgroundColor: colors.background,
      paddingLeft: '5%',
      height: 50
    },
    headerText: {
      fontSize: 30,
      fontWeight: '700',
    },
  });

export default ScreenHeader;