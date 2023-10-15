import { createStackNavigator } from '@react-navigation/stack';
import FolderScreen from "../screens/FolderScreen";
import MainScreen from "../screens/MainScreen";
import NoteListScreen from "../screens/NoteListScreen";
import NoteScreen from '../screens/NoteScreen';

const Stack = createStackNavigator();

const Navigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Main" component={MainScreen} options={{
                headerShown: false
            }} />
            <Stack.Screen name="Folder" component={FolderScreen} options={{
                headerShown: false
            }} />
            <Stack.Screen name="NoteList" component={NoteListScreen} options={{
                headerShown: false
            }} />
            <Stack.Screen name="Note" component={NoteScreen} options={{
                headerShown: false
            }} />
        </Stack.Navigator>
    );
};

export default Navigator;
