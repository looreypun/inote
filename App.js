import {View, StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import {useEffect, useState} from "react";
import {auth} from './firebase';
import LoginScreen from './app/screens/LoginScreen';
import SignupScreen from './app/screens/SignupScreen';
import MainScreen from "./app/screens/MainScreen";
import FolderScreen from "./app/screens/FolderScreen";
import Loader from './app/components/Loader';
import NoteListScreen from './app/screens/NoteListScreen';

const Stack = createStackNavigator();

export default function App() {
    const [user, setUser] = useState(null);
    const [initialRoute, setInitialRoute] = useState('Loading');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            setUser(authUser);

            if (authUser) {
                setInitialRoute('Main');
            } else {
                setInitialRoute('Login');
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    if (initialRoute === 'Loading') {
        return (
            <Loader />
        );
    }
    
    return (
        <View style={styles.container}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName={initialRoute}>
                    <Stack.Screen name="Login" component={LoginScreen} options={{
                        headerShown: false
                    }} />
                    <Stack.Screen name="Signup" component={SignupScreen} options={{
                        headerShown: false
                    }} />
                    <Stack.Screen name="Main" component={MainScreen} options={{
                        headerShown: false
                    }} />
                    <Stack.Screen name="Folder" component={FolderScreen} options={{
                        headerShown: false
                    }} />
                    <Stack.Screen name="NoteList" component={NoteListScreen} options={{
                        headerShown: true
                    }} />
                </Stack.Navigator>
            </NavigationContainer>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
