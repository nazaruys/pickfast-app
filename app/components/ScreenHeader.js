import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppText from './AppText';
import colors from '../config/colors';

function ScreenHeader({title}) {
  let height, paddingTop;
  if (Platform.OS === 'ios') {
    paddingTop = useSafeAreaInsets().top
    height = 40 + paddingTop
  }
    return (
        <View style={[styles.header, {height, paddingTop}]}>
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