import React, { useState } from 'react';
import { Appbar } from 'react-native-paper';
import {useRoute} from '@react-navigation/native';

const TopBar = ({navigation}) => {
    const route = useRoute();
    const { title } = route.params;

    return (
        <Appbar.Header>
            <Appbar.BackAction onPress={() => navigation.goBack()} />
            <Appbar.Content title={title?? ''} />
            <Appbar.Action icon="" onPress={() => {}} />
            <Appbar.Action icon="" onPress={() => {}} />
        </Appbar.Header>
    );
};

export default TopBar;