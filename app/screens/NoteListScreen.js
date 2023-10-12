import { Text, StyleSheet, View } from "react-native";
import { useRoute } from '@react-navigation/native';
import { color } from "../config/color";

const NoteListScreen = ({navigation}) => {
    const route = useRoute();
    const { folderId } = route.params;
    return (
        <View style={styles.container}>
            <Text style={{color: '#fff'}}>Note List: {folderId}</Text>
        </View>
    );
};

export default NoteListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.primary
    }
});