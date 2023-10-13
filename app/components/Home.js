import React from 'react';
import { BottomNavigation } from 'react-native-paper';
import {NavigationContainer} from "@react-navigation/native";
import Navigator from "./Navigator";
import {AllNotesScreen} from "../screens/AllNotesScreen";
import AccountScreen from "../screens/AccountScreen";

const Home = () => {
    const [index, setIndex] = React.useState(0);

    const [routes] = React.useState([
        { key: 'main', title: 'Home', focusedIcon: 'folder', unfocusedIcon: 'folder-outline'},
        { key: 'recent', title: 'Notes', focusedIcon: 'card-text', unfocusedIcon: 'card-text-outline' },
        { key: 'profile', title: 'Account', focusedIcon: 'account', unfocusedIcon: 'account-outline' },
    ]);

    const renderScene = BottomNavigation.SceneMap({
        main: Navigator,
        recent: AllNotesScreen,
        profile: AccountScreen
    });

    return (
        <NavigationContainer independent={true}>
            <BottomNavigation
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
            />
        </NavigationContainer>
    );
};

export default Home;
