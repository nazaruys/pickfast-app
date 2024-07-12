import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

function CreateStoreScreen(props) {
    const navigation = useNavigation();

    return (
        <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={() => navigation.goBack()}>
            <Text>This is the store creation screen!</Text>
        </TouchableOpacity>
    );
}

export default CreateStoreScreen;